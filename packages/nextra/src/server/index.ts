/* eslint-env node */
import { sep } from 'node:path'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types'
import {
  DEFAULT_LOCALES,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS
} from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'
import { NextraPlugin } from './webpack-plugins/index.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

const AGNOSTIC_PAGE_MAP_PATH = `.next${sep}static${sep}chunks${sep}nextra-page-map`

const RE_SEP = sep === '/' ? '/' : '\\\\'

const nextra: Nextra = nextraConfig => {
  const { error, data: loaderOptions } =
    nextraConfigSchema.safeParse(nextraConfig)
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
              locales: nextConfig.i18n?.locales || DEFAULT_LOCALES,
              mdxBaseDir: loaderOptions.mdxBaseDir
              // transformPageMap: nextraConfig.transformPageMap
            })
          )
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
            issuer: request => request?.includes(AGNOSTIC_PAGE_MAP_PATH),
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
            use: defaultLoaderOptions
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
            test: new RegExp(
              `@typescript${RE_SEP}vfs${RE_SEP}dist${RE_SEP}vfs\\.`
            ),
            issuer: request => !!request,
            use: defaultLoaderOptions
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
