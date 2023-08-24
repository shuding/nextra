/* eslint-env node */
import {
  DEFAULT_CONFIG,
  DEFAULT_LOCALE,
  DEFAULT_LOCALES,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS
} from './constants'
import { pageMapCache } from './page-map'
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

    if (nextConfig.i18n?.locales) {
      console.log(
        '[nextra] You have Next.js i18n enabled, read here https://nextjs.org/docs/advanced-features/i18n-routing for the docs.'
      )
    }
    const locales = nextConfig.i18n?.locales || DEFAULT_LOCALES
    const nextraPlugin = new NextraPlugin({ ...nextraConfig, locales })

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
      defaultLocale: nextConfig.i18n?.defaultLocale || DEFAULT_LOCALE,
      pageMapCache,
      newNextLinkBehavior: nextConfig.experimental?.newNextLinkBehavior
    }

    // Check if there's a theme provided
    if (!nextraLoaderOptions.theme) {
      throw new Error('No Nextra theme found!')
    }

    return {
      ...nextConfig,
      ...(nextConfig.output !== 'export' && { rewrites }),
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS
      ],
      webpack(config, options) {
        if (options.nextRuntime !== 'edge' && options.isServer) {
          config.plugins ||= []
          config.plugins.push(nextraPlugin)

          if (nextraConfig.flexsearch) {
            config.plugins.push(new NextraSearchPlugin())
          }
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
            test: /_meta(\.[a-z]{2}-[A-Z]{2})?\.js$/,
            issuer: request => !request,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: {
                  isMetaImport: true
                }
              }
            ]
          }
        )

        return nextConfig.webpack?.(config, options) || config
      }
    }
  }

module.exports = nextra
