export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [
    // For sort fields in package.json
    'prettier-plugin-pkg',
    // For sorting imports
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss' // MUST come last
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
