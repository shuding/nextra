import prettier from 'prettier'

export function clean(content: any, minify = true): Promise<string> {
  if (minify) {
    content = content.slice(
      content.indexOf('\n'),
      content.lastIndexOf('function MDXContent')
    )
  }

  const cleanedContent = content.trim()

  return prettier.format(cleanedContent, { parser: 'typescript' })
}
