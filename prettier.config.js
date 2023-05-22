module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [require('prettier-plugin-tailwindcss')],
  proseWrap: 'always' // printWidth line breaks in md/mdx
}
