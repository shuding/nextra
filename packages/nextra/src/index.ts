import { NextraPlugin, pageMapCache } from './plugin'
import { MARKDOWN_EXTENSION_REGEX } from './constants'
import { LoaderOptions, WithNextra } from './types'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'] as const
const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const

const nextra: WithNextra = (...args) =>
  function withNextra(nextConfig = {}) {
    const nextraConfig =
      typeof args[0] === 'string'
        ? {
            theme: args[0],
            themeConfig: args[1] as string
          }
        : args[0]

    const nextraPlugin = new NextraPlugin(nextraConfig)
    const { i18n, pageExtensions = DEFAULT_EXTENSIONS } = nextConfig

    if (i18n?.locales) {
      console.log(
        '[nextra] You have Next.js i18n enabled, read here https://nextjs.org/docs/advanced-features/i18n-routing for the docs.'
      )
    } else if (!i18n?.defaultLocale) {
      // If `i18n.locales` and `i18n.defaultLocale` were not specified,
      // client will receive error - Text content does not match server-rendered HTML.
      // Due to `const { locales } = useRouter()` where `locales` will be `undefined`
      // To fix it we need to explicitly specify `i18n.locales` and `i18n.defaultLocale`
      nextConfig.i18n = {
        ...i18n,
        locales: ['en-US'],
        defaultLocale: 'en-US'
      }
    }

    return {
      ...nextConfig,
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
              options: <LoaderOptions>{
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
export * from './types'
module.exports = nextra
