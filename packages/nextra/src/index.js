import { buildStorkIndex } from './stork-index'

const defaultExtensions = ['js', 'jsx', 'ts', 'tsx']
const markdownExtensions = ['md', 'mdx']
const markdownExtensionTest = /\.mdx?$/
const STORK_PATH = process.env.STORK_PATH || 'stork'

export default (...args) => (nextConfig = {}) => {
  const nextraConfig = typeof args[0] === 'string' ? {
    theme: args[0],
    themeConfig: args[1]
  } : args[0];

  const locales = nextConfig.i18n ? nextConfig.i18n.locales : null
  const defaultLocale = nextConfig.i18n ? nextConfig.i18n.defaultLocale : null

  let pageExtensions = nextConfig.pageExtensions || [...defaultExtensions]
  if (locales) {
    console.log('You have i18n enabled for Nextra.')
    if (!defaultLocale) {
      console.error('Default locale is missing.')
    }
    pageExtensions = pageExtensions.concat(markdownExtensions.map(ext => defaultLocale + '.' + ext))
  } else {
    pageExtensions = pageExtensions.concat(markdownExtensions)
  }

  if (nextraConfig.stork) {
    console.log('You have Stork indexing enabled for Nextra. Stork binary:', STORK_PATH)

    // Add header for .st
    const originalHeaders = nextConfig.headers || (() => [])
    nextConfig.headers = async () => {
      return [
        ...await originalHeaders(),
        {
          source: `/:index(index-.+\.st)`,
          headers: [
            {
              key: 'content-type',
              value: 'application/wasm'
            }
          ]
        }
      ]
    }
  }

  return Object.assign(
    {},
    nextConfig,
    {
      pageExtensions,
      webpack(config, options) {
        config.module.rules.push({
          test: markdownExtensionTest,
          use: [
            options.defaultLoaders.babel,
            {
              loader: 'nextra/react17-loader',
            },
            {
              loader: '@mdx-js/loader',
              options: nextraConfig.mdxOptions
            },
            {
              loader: 'nextra/loader',
              options: { ...nextraConfig, locales, defaultLocale }
            }
          ]
        })

        if (!config.plugins) config.plugins = []
        config.plugins.push({
          apply: (compiler) => {
            compiler.hooks.done.tap('buildStorkIndex', () => {
              buildStorkIndex(STORK_PATH, locales)
            });
          }
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      }
    }
  )
}
