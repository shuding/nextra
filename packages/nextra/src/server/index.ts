/* eslint-env node */
import { sep } from 'node:path'
import type { NextConfig } from 'next'
import type { RuleSetRule } from 'webpack'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types'
import {
  DEFAULT_CONFIG,
  DEFAULT_LOCALE,
  DEFAULT_LOCALES,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS,
  META_REGEX
} from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'
import { NextraPlugin, NextraSearchPlugin } from './webpack-plugins/index.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

const AGNOSTIC_PAGE_MAP_PATH = `.next${sep}static${sep}chunks${sep}nextra-page-map`

const RE_SEP = sep === '/' ? '/' : '\\\\'

const nextra: Nextra = nextraConfig => {
  const { error } = nextraConfigSchema.safeParse(nextraConfig)
  if (error) {
    logger.error('Error validating nextraConfig')
    throw fromZodError(error)
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
            nextConfig.i18n?.defaultLocale || DEFAULT_LOCALE,
          NEXTRA_LOCALES: JSON.stringify(nextConfig.i18n?.locales)
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
        config.resolve.alias = { ...config.resolve.alias }
        const rules = config.module.rules as RuleSetRule[]

        const defaultLoaderOptions = [
          options.defaultLoaders.babel,
          {
            loader: 'nextra/loader',
            options: loaderOptions
          }
        ]

        rules.push(
          {
            test: MARKDOWN_EXTENSION_REGEX,
            oneOf: [
              {
                // Match pages (imports without an issuer request).
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
                // Match Markdown imports from non-pages. These imports have an
                // issuer, which can be anything as long as it's not empty string.
                // When the issuer is `null`, it means that it can be imported via a
                // runtime import call such as `import('...')`.
                issuer: request => !request?.includes(AGNOSTIC_PAGE_MAP_PATH),
                use: defaultLoaderOptions
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
            test: new RegExp(`pages${RE_SEP}_app\\.`),
            issuer: request => !request,
            use: defaultLoaderOptions
          }
        )

        return nextConfig.webpack?.(config, options) || config
      }
    }
  }
}

export default nextra

export type * from '../types'
