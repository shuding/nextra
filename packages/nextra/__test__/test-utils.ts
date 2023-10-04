import type { VFile } from '@mdx-js/mdx/lib/compile'
import prettier from 'prettier'

export async function clean(
  content: VFile | string,
  minify = true
): Promise<string> {
  if (typeof content !== 'string') {
    content = String(content)
  }

  if (minify) {
    content = content
      // Remove everything starting from `function MDXContent` declaration
      .slice(content.indexOf('\n'), content.lastIndexOf('function MDXContent'))
  }
  return prettier.format(content, {
    parser: 'typescript',
    semi: false,
    trailingComma: 'none',
    singleQuote: true,
    printWidth: 120,
    arrowParens: 'avoid'
  })
}
