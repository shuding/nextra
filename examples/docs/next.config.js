const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.js',
  unstable_staticImage: true,
  unstable_git_fetch_on_shallow: true
})

module.exports = withNextra({
  reactStrictMode: true
})
