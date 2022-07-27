import { NextraPlugin, pageMapCache } from './plugin'
import { DEFAULT_LOCALE, MARKDOWN_EXTENSION_REGEX } from './constants'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const MARKDOWN_EXTENSIONS = ['md', 'mdx']

const nextra = (...args) =>
  function withNextra(nextConfig = {}) {
    const nextraConfig =
      typeof args[0] === 'string'
        ? {
            theme: args[0],
            themeConfig: args[1]
          }
        : args[0]

    const nextraPlugin = new NextraPlugin(nextraConfig)
    const { i18n, pageExtensions = DEFAULT_EXTENSIONS } = nextConfig
    let defaulti18n = i18n || {};

    if (i18n?.locales) {
      console.log(
        '[nextra] You have Next.js i18n enabled, read here https://nextjs.org/docs/advanced-features/i18n-routing for the docs.'
      )
    } else if (!i18n?.defaultLocale) {
      // If `i18n.locales` and `i18n.defaultLocale` were not specified,
      // client will receive error - Text content does not match server-rendered HTML.
      // Due to `const { locale } = useRouter()` where `locale` will be `undefined`
      // To fix it we need to explicitly specify `i18n.locales` and `i18n.defaultLocale`
      defaulti18n = {
        ...i18n,
        locales: [DEFAULT_LOCALE],
        defaultLocale: DEFAULT_LOCALE
      }
    }

    return {
      ...nextConfig,
      i18n: defaulti18n,
      pageExtensions: [...pageExtensions, ...MARKDOWN_EXTENSIONS],
      webpack(config, options) {
        config.plugins ||= []
        config.plugins.push(nextraPlugin)

        config.module.rules.push({
          test: MARKDOWN_EXTENSION_REGEX,
          use: [
            options.defaultLoaders.babel,
            {
              loader: 'nextra/loader',
              options: {
                ...nextraConfig,
                locales: nextConfig.i18n?.locales,
                defaultLocale: nextConfig.i18n?.defaultLocale,
                pageMapCache
              }
            }
          ]
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      }
    }
  }
module.exports = nextra
