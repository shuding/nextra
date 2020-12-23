const defaultExtensions = ['js', 'jsx', 'ts', 'tsx']
const markdownExtensions = ['md', 'mdx']
const markdownExtensionTest = /\.mdx?$/

export default (theme, themeConfig) => (nextConfig = {}) => {
  const config = typeof theme === "string" ? {
    theme,
    themeConfig
  } : theme;
  const locales = nextConfig.i18n ? nextConfig.i18n.locales : null
  const defaultLocale = nextConfig.i18n ? nextConfig.i18n.defaultLocale : null

  let pageExtensions = [...defaultExtensions]
  if (locales) {
    console.log('You have i18n enabled for Nextra.')
    if (!defaultLocale) {
      console.error('Default locale is missing.')
    }

    // Exclude other locales to ensure there's no route conflicts.
    pageExtensions = pageExtensions.concat(
      markdownExtensions.map(extension => defaultLocale + '.' + extension)
    )
  } else {
    pageExtensions = pageExtensions.concat(markdownExtensions)
  }

  return Object.assign(
    {
      pageExtensions
    },
    nextConfig,
    {
      webpack(config, options) {
        config.module.rules.push({
          test: markdownExtensionTest,
          use: [
            options.defaultLoaders.babel,
            {
              loader: '@mdx-js/loader',
              options: config.mdxOptions
            },
            {
              loader: 'nextra/loader',
              options: { theme: config.theme, themeConfig: config.themeConfig, locales, defaultLocale }
            }
          ]
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      }
    }
  )
}
