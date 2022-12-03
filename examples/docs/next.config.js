const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.js',
  staticImage: true,
  flexsearch: {
    codeblock: false
  }
})

module.exports = withNextra({
  reactStrictMode: true
})
