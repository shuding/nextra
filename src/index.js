import path from 'path'

export default (
  theme
) => (
  nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
  }
) => {
  const markdownExtension = /\.mdx?$/
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: markdownExtension,
        use: [
          options.defaultLoaders.babel,
          {
            loader: 'mdx-next-loader-test',
          },
          {
            loader: path.resolve(__dirname, 'loader'),
            options: { theme }
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
