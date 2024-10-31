/* eslint-env node */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RuleSetRule } from 'webpack'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types.js'
import { MARKDOWN_EXTENSION_RE, MARKDOWN_EXTENSIONS } from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const FILENAME = fileURLToPath(import.meta.url)
const DIRNAME = path.dirname(FILENAME)
const LOADER_PATH = path.join(DIRNAME, '..', '..', 'loader.cjs')
const SEP = path.sep === '/' ? '/' : '\\\\'
const PAGE_MAP_PLACEHOLDER_RE = new RegExp(
  'nextra/dist/server/page-map/placeholder\\.js'.replaceAll('/', SEP)
)
const PAGE_MAP_RE = new RegExp(
  'nextra/dist/server/page-map/get\\.js'.replaceAll('/', SEP)
)

const nextra: Nextra = nextraConfig => {
  const { error, data: loaderOptions } =
    nextraConfigSchema.safeParse(nextraConfig)
  if (error) {
    logger.error('Error validating nextraConfig')
    throw fromZodError(error)
  }

  const loader = {
    loader: LOADER_PATH,
    options: loaderOptions
  }
  const pageImportLoader = {
    loader: LOADER_PATH,
    options: { ...loaderOptions, isPageImport: true }
  }
  const pageMapPlaceholderLoader = {
    loader: LOADER_PATH,
    options: {
      contentDirBasePath: loaderOptions.contentDirBasePath
    }
  }

  return function withNextra(nextConfig = {}) {
    const pageMapLoader = {
      loader: LOADER_PATH,
      options: {
        locales: nextConfig.i18n?.locales || ['']
      }
    }
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
      transpilePackages: [
        // To import ESM-only packages with `next dev --turbopack`. Source: https://github.com/vercel/next.js/issues/63318#issuecomment-2079677098
        ...(process.env.TURBOPACK === '1' ? ['shiki'] : []),
        ...(nextConfig.transpilePackages || [])
      ],
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
          NEXTRA_DEFAULT_LOCALE: nextConfig.i18n?.defaultLocale,
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
            '**/nextra/dist/server/page-map/placeholder.js': {
              loaders: [pageMapPlaceholderLoader]
            },
            '**/nextra/dist/server/page-map/get.js': {
              loaders: [pageMapLoader]
            }
          },
          resolveAlias: {
            ...nextConfig.experimental?.turbo?.resolveAlias,
            'next-mdx-import-source-file': './mdx-components', // '@vercel/turbopack-next/mdx-import-source'
            'private-next-root-dir/*': './*'
          }
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
          'private-next-root-dir/mdx-components',
          'private-next-root-dir/src/mdx-components'
        ]
        const rules = config.module.rules as RuleSetRule[]

        rules.push(
          {
            test: PAGE_MAP_PLACEHOLDER_RE,
            use: [options.defaultLoaders.babel, pageMapPlaceholderLoader]
          },
          {
            test: PAGE_MAP_RE,
            use: [options.defaultLoaders.babel, pageMapLoader]
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

export type * from '../types.js'
