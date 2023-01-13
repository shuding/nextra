/* eslint-env node */
import { NextraPlugin, pageMapCache } from './plugin'
import {
  DEFAULT_LOCALE,
  DEFAULT_CONFIG,
  MARKDOWN_EXTENSION_REGEX,
  MARKDOWN_EXTENSIONS
} from './constants'

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

    const nextraPlugin = new NextraPlugin({
      ...nextraConfig,
      distDir: nextConfig.distDir,
      locales: nextConfig.i18n?.locales || ['']
    })

    const rewrites = async () => {
      const rules = [
        {
          source: '/:path*/_meta',
          destination: '/404'
        }
      ]

      if (nextraPlugin.rewrites) {
        const originalRewrites = await nextraPlugin.rewrites()
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
      locales: nextConfig.i18n?.locales || [''],
      defaultLocale: nextConfig.i18n?.defaultLocale || DEFAULT_LOCALE,
      pageMapCache,
      newNextLinkBehavior: nextConfig.experimental?.newNextLinkBehavior,
      distDir: nextConfig.distDir
    }

    return {
      ...nextConfig,
      rewrites,
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS
      ],
      webpack(config, options) {
        if (options.nextRuntime !== 'edge' && options.isServer) {
          config.plugins ||= []
          config.plugins.push(nextraPlugin)
        }

        config.module.rules.push(
          {
            // Match Markdown imports from non-pages. These imports have an
            // issuer, which can be anything as long as it's not empty.
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request => !!request,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: nextraLoaderOptions
              }
            ]
          },
          {
            // Match pages (imports without an issuer).
            test: MARKDOWN_EXTENSION_REGEX,
            issuer: request => !request,
            use: [
              options.defaultLoaders.babel,
              {
                loader: 'nextra/loader',
                options: {
                  ...nextraLoaderOptions,
                  pageImport: true
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
                  metaImport: true
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
