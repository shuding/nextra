/* eslint-env node */
import path from 'node:path'
import type { RuleSetRule } from 'webpack'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types'
import { MARKDOWN_EXTENSION_RE, MARKDOWN_EXTENSIONS } from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

const SEP_RE = path.sep === '/' ? '/' : '\\\\'

const PAGE_MAP_RE = new RegExp(
  `nextra${SEP_RE}dist${SEP_RE}server${SEP_RE}page-map-placeholder`
)

const nextra: Nextra = nextraConfig => {
  const { error, data: loaderOptions } =
    nextraConfigSchema.safeParse(nextraConfig)
  if (error) {
    logger.error('Error validating nextraConfig')
    throw fromZodError(error)
  }

  const loader = {
    loader: 'nextra/loader',
    options: loaderOptions
  }
  const pageImportLoader = {
    loader: 'nextra/loader',
    options: { ...loaderOptions, isPageImport: true }
  }
  const pageMapLoader = {
    loader: 'nextra/loader',
    options: {
      useContentDir: loaderOptions.useContentDir ?? false,
      isPageMapImport: true
    }
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
      experimental: {
        ...nextConfig.experimental,
        // optimizePackageImports: [...optimizedImports]
        turbo: {
          ...nextConfig.experimental?.turbo,
          rules: {
            ...nextConfig.experimental?.turbo?.rules,
            './{src/app,app}/**/page.{md,mdx}': {
              as: '*.tsx',
              loaders: [pageImportLoader as any]
            },
            // Order matter here, pages match first -> after partial files
            '*.{md,mdx}': {
              as: '*.tsx',
              loaders: [loader as any]
            },
            '**/nextra/dist/server/page-map-placeholder.js': {
              loaders: [pageMapLoader]
            }
          },
          resolveAlias: {
            ...nextConfig.experimental?.turbo?.resolveAlias,
            // TODO: resolving .jsx/.tsx doesn't work for some reason
            'next-mdx-import-source-file': './mdx-components', // '@vercel/turbopack-next/mdx-import-source'
            'private-next-app-dir/*': './app/*',
            'private-next-root-dir/*': './*'
          },
        }
      },
      webpack(config, options) {
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
            use: [options.defaultLoaders.babel, loader]
          },
          {
            test: MARKDOWN_EXTENSION_RE,
            oneOf: [
              {
                // Match pages (imports without an issuer request).
                issuer: request => request === '',
                use: [options.defaultLoaders.babel, pageImportLoader]
              },
              {
                // Match Markdown imports from non-pages. These imports have an
                // issuer, which can be anything as long as it's not empty string.
                // When the issuer is `null`, it means that it can be imported via a
                // runtime import call such as `import('...')`.
                issuer: request => request === null || !!request,
                use: [options.defaultLoaders.babel, loader]
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
