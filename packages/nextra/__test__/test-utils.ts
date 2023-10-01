import prettier from 'prettier'

export async function clean(content: any, minify = true): Promise<string> {
  if (minify) {
    content = content
      // Remove everything starting from `function MDXContent` declaration
      .slice(content.indexOf('\n'), content.lastIndexOf('function MDXContent'))
  }
  return prettier.format(content.trim(), {
    parser: 'typescript',
    semi: false,
    trailingComma: 'none',
    singleQuote: true
  })
}
