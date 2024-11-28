import prettierPluginSortImport from '@ianvs/prettier-plugin-sort-imports'
import prettierPluginPkg from 'prettier-plugin-pkg'
import * as prettierPluginTailwindCss from 'prettier-plugin-tailwindcss'

export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  plugins: [
    // For sort fields in package.json
    prettierPluginPkg,
    // For sorting imports
    prettierPluginSortImport,
    prettierPluginTailwindCss // MUST come last
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
