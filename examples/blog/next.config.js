const withNextra = require('nextra')({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.js',
  unstable_staticImage: true,
  unstable_git_fetch_on_shallow: true
})
module.exports = withNextra({
  reactStrictMode: true
})
