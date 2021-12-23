const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.js',
  unstable_stork: false,
  unstable_staticImage: true
})

module.exports = withNextra({
  i18n: {
    locales: ['en', 'ar', 'zh'],
    defaultLocale: 'en'
  }
})
