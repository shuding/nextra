/* eslint-env node */
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import type { RuleSetRule } from 'webpack'
import { fromZodError } from 'zod-validation-error'
import type { Nextra } from '../types.js'
import { CWD, MARKDOWN_EXTENSION_RE } from './constants.js'
import { nextraConfigSchema } from './schemas.js'
import { logger } from './utils.js'

const require = createRequire(import.meta.url)

const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'] as const

const FILENAME = fileURLToPath(import.meta.url)

const LOADER_PATH = path.join(FILENAME, '..', '..', '..', 'loader.cjs')

const SEP = path.sep === '/' ? '/' : '\\\\'

const GET_PAGE_MAP_PATH = '/nextra/dist/server/page-map/get.js'

const PAGE_MAP_PLACEHOLDER_PATH = '/nextra/dist/server/page-map/placeholder.js'

const GET_PAGE_MAP_RE = new RegExp(
  GET_PAGE_MAP_PATH.replaceAll('/', SEP).replaceAll('.', String.raw`\.`)
)
const PAGE_MAP_PLACEHOLDER_RE = new RegExp(
  PAGE_MAP_PLACEHOLDER_PATH.replaceAll('/', SEP).replaceAll('.', String.raw`\.`)
)
const CONTENT_DIR = getContentDirectory()

function getContentDirectory() {
  // Next.js gives priority to `app` over `src/app`, we do the same for `content` directory
  const [contentDir = 'content'] = fg.sync(['{src/,}content'], {
    onlyDirectories: true
  })
  return contentDir
}

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
      // Remove forward slash
      contentDirBasePath: loaderOptions.contentDirBasePath.slice(1),
      contentDir: CONTENT_DIR,
      shouldAddLocaleToLinks: loaderOptions.unstable_shouldAddLocaleToLinks
    }
  }

  return function withNextra(nextConfig = {}) {
    const { locales, defaultLocale } = nextConfig.i18n || {}
    if (locales) {
      logger.info(
        'You have Next.js i18n enabled, read here https://nextjs.org/docs/app/building-your-application/routing/internationalization for the docs.'
      )
    }
    const pageMapLoader = {
      loader: LOADER_PATH,
      options: {
        // ts complains about readonly array
        locales: locales ? [...locales] : ['']
      }
    }
    return {
      ...nextConfig,
      transpilePackages: [
        // To import ESM-only packages with `next dev --turbopack`. Source: https://github.com/vercel/next.js/issues/63318#issuecomment-2079677098
        ...(process.env.TURBOPACK === '1' ? ['shiki'] : []),
        ...(nextConfig.transpilePackages || [])
      ],
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS
      ],
      // We always unset `nextConfig.i18n` property
      i18n: undefined,
      env: {
        ...nextConfig.env,
        NEXTRA_LOCALES: JSON.stringify(pageMapLoader.options.locales),
        NEXTRA_DEFAULT_LOCALE: defaultLocale,
        NEXTRA_SHOULD_ADD_LOCALE_TO_LINKS: String(
          loaderOptions.unstable_shouldAddLocaleToLinks
        )
      },
      experimental: {
        ...nextConfig.experimental,
        optimizePackageImports: [
          'nextra/components',
          'nextra-theme-docs',
          'nextra-theme-blog',
          ...(nextConfig.experimental?.optimizePackageImports || [])
        ],
        turbo: {
          ...nextConfig.experimental?.turbo,
          rules: {
            ...nextConfig.experimental?.turbo?.rules,
            [`./{src/,}app/**/page.{${MARKDOWN_EXTENSIONS}}`]: {
              as: '*.tsx',
              loaders: [pageImportLoader as any]
            },
            // Order matter here, pages match first -> after partial files
            [`*.{${MARKDOWN_EXTENSIONS}}`]: {
              as: '*.tsx',
              loaders: [loader as any]
            },
            [`**${PAGE_MAP_PLACEHOLDER_PATH}`]: {
              loaders: [pageMapPlaceholderLoader]
            },
            [`**${GET_PAGE_MAP_PATH}`]: {
              loaders: [pageMapLoader]
            }
          },
          resolveAlias: {
            ...nextConfig.experimental?.turbo?.resolveAlias,
            'next-mdx-import-source-file':
              '@vercel/turbopack-next/mdx-import-source',
            'private-next-root-dir/*': './*',
            'private-next-content-dir/*': `./${CONTENT_DIR}/*`,
            // Fixes when Turbopack is enabled: Module not found: Can't resolve '@theguild/remark-mermaid/mermaid'
            '@theguild/remark-mermaid/mermaid': path.relative(
              CWD,
              path.join(
                require.resolve('@theguild/remark-mermaid/package.json'),
                '..',
                'dist',
                'mermaid.js'
              )
            )
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
              ignored.replace(
                String.raw`(\.(git|next)|node_modules)`,
                String.raw`\.(git|next)`
              )
            )
          }
        }
        config.resolve.alias['private-next-content-dir'] = [
          'private-next-root-dir/content',
          'private-next-root-dir/src/content'
        ]
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
            test: GET_PAGE_MAP_RE,
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
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- types are wrong, value can be null
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
