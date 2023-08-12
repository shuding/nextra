module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [
    require('prettier-plugin-tailwindcss'),
    // for sort fields in package.json
    require('prettier-plugin-pkg'),
    // for sorting imports
    require('@ianvs/prettier-plugin-sort-imports')
  ],
  overrides: [
    {
      files: '*.svg',
      options: {
        parser: 'html'
      }
    }
  ],
  proseWrap: 'always' // printWidth line breaks in md/mdx
}
