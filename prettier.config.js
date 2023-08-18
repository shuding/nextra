module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [
    'prettier-plugin-tailwindcss',
    // for sort fields in package.json
    'prettier-plugin-pkg',
    // for sorting imports
    '@ianvs/prettier-plugin-sort-imports'
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
