/* eslint-env node */
import {
  DEFAULT_CONFIG,
  DEFAULT_LOCALE,
  DEFAULT_LOCALES,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS
} from './constants'
import { logger } from './utils'
import { NextraPlugin, NextraSearchPlugin } from './webpack-plugins'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

const nextra = (themeOrNextraConfig, themeConfig) =>
  function withNextra(nextConfig = {}) {
    const nextraConfig = {
      ...DEFAULT_CONFIG,
      ...(typeof themeOrNextraConfig === 'string'
        ? { theme: themeOrNextraConfig, themeConfig }
        : themeOrNextraConfig)
    }

    const hasI18n = !!nextConfig.i18n?.locales

    if (hasI18n) {
      logger.info(
        'You have Next.js i18n enabled, read here https://nextjs.org/docs/advanced-features/i18n-routing for the docs.'
      )
      logger.warn(
        'When i18n enabled, Nextra set nextConfig.i18n = undefined, use `useRouter` from `nextra/hooks` if you need `locale` or `defaultLocale` values.'
      )
    }
    const locales = nextConfig.i18n?.locales || DEFAULT_LOCALES

    const rewrites = async () => {
      const rules = [
        {
          source: '/:path*/_meta',
          destination: '/404'
        }
      ]

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

    const nextraLoaderOptions = {
      ...nextraConfig,
      locales,
      defaultLocale: nextConfig.i18n?.defaultLocale || DEFAULT_LOCALE
    }

    // Check if there's a theme provided
    if (!nextraLoaderOptions.theme) {
      throw new Error('No Nextra theme found!')
    }

    return {
      ...nextConfig,
      ...(nextConfig.output !== 'export' && { rewrites }),
      ...(hasI18n && {
        env: {
          NEXTRA_DEFAULT_LOCALE: nextraLoaderOptions.defaultLocale,
          ...nextConfig.env
        },
        i18n: undefined
      }),
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS
      ],
      webpack(config, options) {
        if (options.nextRuntime !== 'edge' && options.isServer) {
          config.plugins ||= []
          config.plugins.push(new NextraPlugin({ locales }))

          if (nextraConfig.flexsearch) {
            config.plugins.push(new NextraSearchPlugin())
          }
        }

        /* Adds client-side webpack optimization rules for splitting chunks during build-time */
        if (!options.isServer && config.optimization.splitChunks) {
          config.optimization.splitChunks.cacheGroups = {
            ...config.optimization.splitChunks.cacheGroups,
            ...Object.fromEntries(
              nextraLoaderOptions.locales.map(locale => [
                `nextra-page-map-${locale}`,
                {
                  test: new RegExp(`nextra-page-map-${locale}`),
                  name: `nextra-page-map-${locale}`,
                  enforce: true
                }
              ])
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

        config.module.rules.push(
          {
            // Match Markdown imports from non-pages. These imports have an
            // issuer, which can be anything as long as it's not empty.
            // When the issuer is null, it means that it can be imported via a
            // runtime import call such as `import('...')`.
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request => !!request || request === null,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: nextraLoaderOptions
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
                options: {
                  ...nextraLoaderOptions,
                  isPageImport: true
                }
              }
            ]
          },
          {
            // Match dynamic meta files inside pages.
            test: /_meta\.js$/,
            issuer: request => !request,
            use: [options.defaultLoaders.babel, { loader: 'nextra/loader' }]
          },
          {
            test: /pages\/_app\./,
            issuer: request => !request,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: nextraLoaderOptions
              }
            ]
          }
        )

        return nextConfig.webpack?.(config, options) || config
      }
    }
  }

module.exports = nextra
