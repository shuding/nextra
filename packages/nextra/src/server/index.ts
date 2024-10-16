/* eslint-env node */
import path from 'node:path'
import type { RuleSetRule } from 'webpack'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types'
import {
  DEFAULT_LOCALES,
  IS_PRODUCTION,
  MARKDOWN_EXTENSION_RE,
  MARKDOWN_EXTENSIONS
} from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'
import { NextraPlugin } from './webpack-plugins/index.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

const SEP_RE = path.sep === '/' ? '/' : '\\\\'

const PAGE_MAP_RE = new RegExp(
  `.next${SEP_RE}static${SEP_RE}chunks${SEP_RE}nextra-page-map`
)

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
        'You have Next.js i18n enabled, read here https://nextjs.org/docs/app/building-your-application/routing/internationalization for the docs.'
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
          NEXTRA_DEFAULT_LOCALE: nextConfig.i18n?.defaultLocale || 'en',
          NEXTRA_LOCALES: JSON.stringify(nextConfig.i18n?.locales)
        }
      }),
      webpack(config, options) {
        if (options.nextRuntime !== 'edge' && options.isServer) {
          config.plugins.push(
            new NextraPlugin({
              locales: nextConfig.i18n?.locales || DEFAULT_LOCALES,
              useContentDir: loaderOptions.useContentDir
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
        config.resolve.alias['next-mdx-import-source-file'] = [
          'private-next-root-dir/src/mdx-components',
          'private-next-root-dir/mdx-components',
          'nextra/mdx'
        ]
        const rules = config.module.rules as RuleSetRule[]

        rules.push(
          {
            test: PAGE_MAP_RE,
            // @ts-expect-error
            issuer: request => console.log({ request }) || true,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: loaderOptions
              }
            ]
          },
          {
            test: MARKDOWN_EXTENSION_RE,
            oneOf: [
              ...(IS_PRODUCTION
                ? []
                : [
                    {
                      issuer: PAGE_MAP_RE,
                      use: [
                        options.defaultLoaders.babel,
                        {
                          loader: 'nextra/loader',
                          options: { ...loaderOptions, isPageMapImport: true }
                        }
                      ]
                    }
                  ]),
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
                issuer: request => request === null || !!request,
                use: [
                  options.defaultLoaders.babel,
                  {
                    loader: 'nextra/loader',
                    options: loaderOptions
                  }
                ]
              }
            ]
          }
        )

        return nextConfig.webpack?.(config, options) || config
      }
    }
  }
}

export default nextra

export type * from '../types'
