/* eslint-env node */
import { sep } from 'node:path'
import type { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types'
import {
  DEFAULT_CONFIG,
  DEFAULT_LOCALES,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS
} from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'
import { NextraPlugin, NextraSearchPlugin } from './webpack-plugins/index.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

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
    }
    const locales = nextConfig.i18n?.locales || DEFAULT_LOCALES

    const loaderOptions = {
      ...DEFAULT_CONFIG,
      ...nextraConfig,
      locales
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
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS
      ],
      ...(hasI18n && {
        i18n: undefined,
        env: {
          ...nextConfig.env,
          NEXTRA_DEFAULT_LOCALE: nextConfig.i18n?.defaultLocale || 'en'
        }
      }),
      webpack(config, options) {
        if (options.nextRuntime !== 'edge' && options.isServer) {
          config.plugins ||= []
          config.plugins.push(
            new NextraPlugin({
              locales,
              mdxBaseDir: loaderOptions.mdxBaseDir
              // transformPageMap: nextraConfig.transformPageMap
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

        const rules = config.module.rules as RuleSetRule[]

        rules.push(
          {
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request => request.includes(AGNOSTIC_PAGE_MAP_PATH),
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: { ...loaderOptions, isPageMapImport: true }
              }
            ]
          },
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
