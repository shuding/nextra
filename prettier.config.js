module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('@ianvs/prettier-plugin-sort-imports')
  ],
  proseWrap: 'always' // printWidth line breaks in md/mdx
}
