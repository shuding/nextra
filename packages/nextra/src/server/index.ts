/* eslint-env node */
import { createRequire } from 'node:module'
import { sep } from 'node:path'
import type { NextConfig } from 'next'
import type { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types'
import {
  DEFAULT_CONFIG,
  DEFAULT_LOCALE,
  DEFAULT_LOCALES,
  IMPORT_FRONTMATTER,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS,
  META_REGEX
} from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'
import { NextraPlugin, NextraSearchPlugin } from './webpack-plugins/index.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

const require = createRequire(import.meta.url)

const AGNOSTIC_PAGE_MAP_PATH = `.next${sep}static${sep}chunks${sep}nextra-page-map`

const nextra: Nextra = nextraConfig => {
  try {
    nextraConfigSchema.parse(nextraConfig)
  } catch (error) {
    logger.error('Error validating nextraConfig')
    throw fromZodError(error as ZodError)
  }

  return function withNextra(nextConfig = {}) {
    const hasI18n = !!nextConfig.i18n?.locales

    if (hasI18n) {
      logger.info(
        'You have Next.js i18n enabled, read here https://nextjs.org/docs/advanced-features/i18n-routing for the docs.'
      )
      logger.warn(
        "Next.js doesn't support i18n by locale folder names.\n" +
          'When i18n enabled, Nextra unset nextConfig.i18n to `undefined`, use `useRouter` from `nextra/hooks` if you need `locale` or `defaultLocale` values.'
      )
    }
    const locales = nextConfig.i18n?.locales || DEFAULT_LOCALES

    const rewrites: NextConfig['rewrites'] = async () => {
      const rules = [{ source: '/:path*/_meta', destination: '/404' }]

      if (nextConfig.rewrites) {
        const originalRewrites = await nextConfig.rewrites()
        if (Array.isArray(originalRewrites)) {
          return [...originalRewrites, ...rules]
        }
        return {
          ...originalRewrites,
          beforeFiles: [...(originalRewrites.beforeFiles || []), ...rules]
        }
      }

      return rules
    }

    const loaderOptions = {
      ...DEFAULT_CONFIG,
      ...nextraConfig,
      locales
    }

    // Check if there's a theme provided
    if (!nextraConfig.theme) {
      throw new Error('No Nextra theme found!')
    }

    // const optimizedImports = new Set(
    //   nextConfig.experimental?.optimizePackageImports || []
    // )
    //
    // optimizedImports.add('nextra/components')

    return {
      ...nextConfig,
      // experimental: {
      //   ...nextConfig.experimental,
      //   optimizePackageImports: [...optimizedImports]
      // },
      ...(nextConfig.output !== 'export' && { rewrites }),
      env: {
        ...nextConfig.env,
        ...(hasI18n && {
          NEXTRA_DEFAULT_LOCALE:
            nextConfig.i18n?.defaultLocale || DEFAULT_LOCALE
        }),
        NEXTRA_SEARCH: String(!!loaderOptions.search)
      },
      ...(hasI18n && { i18n: undefined }),
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS
      ],
      webpack(config, options) {
        if (options.nextRuntime !== 'edge' && options.isServer) {
          config.plugins ||= []
          config.plugins.push(
            new NextraPlugin({
              locales,
              transformPageMap: nextraConfig.transformPageMap
            })
          )

          if (loaderOptions.search) {
            config.plugins.push(new NextraSearchPlugin())
          }
        }

        // Fixes https://github.com/vercel/next.js/issues/55872
        if (config.watchOptions.ignored instanceof RegExp) {
          const ignored = config.watchOptions.ignored.source

          config.watchOptions = {
            ...config.watchOptions,
            ignored: new RegExp(
              ignored.replace('(\\.(git|next)|node_modules)', '\\.(git|next)')
            )
          }
        }

        const defaultESMAppPath = require.resolve('next/dist/esm/pages/_app.js')
        const defaultCJSAppPath = require.resolve('next/dist/pages/_app.js')

        config.resolve.alias = {
          ...config.resolve.alias,
          // Resolves ESM _app file instead cjs, so we could import theme.config via `import` statement
          [defaultCJSAppPath]: defaultESMAppPath
        }
        const rules = config.module.rules as RuleSetRule[]

        if (IMPORT_FRONTMATTER) {
          rules.push({
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request => request.includes(AGNOSTIC_PAGE_MAP_PATH),
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: { ...loaderOptions, isPageMapImport: true }
              }
            ]
          })
        }

        rules.push(
          {
            // Match Markdown imports from non-pages. These imports have an
            // issuer, which can be anything as long as it's not empty.
            // When the issuer is null, it means that it can be imported via a
            // runtime import call such as `import('...')`.
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request =>
              (!!request && !request.includes(AGNOSTIC_PAGE_MAP_PATH)) ||
              request === null,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: loaderOptions
              }
            ]
          },
          {
            // Match pages (imports without an issuer request).
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request => request === '',
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: { ...loaderOptions, isPageImport: true }
              }
            ]
          },
          {
            // Match dynamic meta files inside pages.
            test: META_REGEX,
            issuer: request => !request,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: {
                  isMetaFile: true
                }
              }
            ]
          },
          {
            // Use platform separator because /pages\/_app\./ will not work on windows
            test: new RegExp(`pages${sep === '/' ? '/' : '\\\\'}_app\\.`),
            issuer: request => !request,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: loaderOptions
              }
            ]
          }
        )

        return nextConfig.webpack?.(config, options) || config
      }
    }
  }
}

// TODO: take this type from webpack directly
type RuleSetRule = {
  issuer: (value: string) => boolean
  test: RegExp
  use: unknown[]
}

export default nextra

export type * from '../types'
