import { NextraPlugin, pageMapCache } from './plugin'
import { DEFAULT_LOCALE, MARKDOWN_EXTENSION_REGEX } from './constants'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const MARKDOWN_EXTENSIONS = ['md', 'mdx']

const nextra = (...config) =>
  function withNextra(nextConfig = {}) {
    const nextraConfig =
      typeof config[0] === 'string'
        ? {
            theme: config[0],
            themeConfig: config[1]
          }
        : config[0]

    const nextraPlugin = new NextraPlugin(nextraConfig)
    const { pageExtensions = DEFAULT_EXTENSIONS } = nextConfig

    if (nextConfig.i18n?.locales) {
      console.log(
        '[nextra] You have Next.js i18n enabled, read here https://nextjs.org/docs/advanced-features/i18n-routing for the docs.'
      )
    }

    // If `i18n.locales` and `i18n.defaultLocale` were not specified,
    // client will receive error - Text content does not match server-rendered HTML.
    // Due to `const { locale } = useRouter()` where `locale` will be `undefined`
    // To fix it we need to explicitly specify `i18n.locales` and `i18n.defaultLocale`
    const i18n = {
      locales: nextConfig.i18n?.locales || [DEFAULT_LOCALE],
      defaultLocale: nextConfig.i18n?.defaultLocale || DEFAULT_LOCALE
    }

    return {
      ...nextConfig,
      i18n,
      pageExtensions: [...pageExtensions, ...MARKDOWN_EXTENSIONS],
      webpack(config, options) {
        config.plugins ||= []
        config.plugins.push(nextraPlugin)

        const nextraLoaderOptions = {
          ...nextraConfig,
          locales: i18n.locales,
          defaultLocale: i18n.defaultLocale,
          pageMapCache,
          newNextLinkBehavior: nextConfig.experimental?.newNextLinkBehavior
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
          }
        )

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      }
    }
  }

module.exports = nextra
