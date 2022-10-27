module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [require('prettier-plugin-tailwindcss')],
  overrides: [
    {
      files: 'packages/nextra-theme-docs/**/*',
      options: {
        tailwindConfig: 'packages/nextra-theme-docs/tailwind.config.js'
      }
    }
  ]
}
