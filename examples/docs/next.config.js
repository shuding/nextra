const withNextra = require('nextra')({
  theme: 'nextra-theme-docs', 
  themeConfig: './theme.config.js',
  stork: true
})

module.exports = withNextra({
  i18n: {
    locales: ['en', 'ar', 'zh'],
    defaultLocale: 'en'
  }
})
