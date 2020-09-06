export default (
  theme, themeConfig
) => (
  nextConfig = {}
) => {
  const markdownExtension = /\.mdx?$/
  return Object.assign({
      pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
    }, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: markdownExtension,
        use: [
          options.defaultLoaders.babel,
          {
            loader: 'mdx-next-loader-test',
          },
          {
            loader: 'nextra/loader',
            options: { theme, themeConfig }
          }
        ]
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}
