import prettier from 'prettier'

export function clean(content: any): Promise<string> {
  const cleanedContent = content
    .slice(content.indexOf('\n'), content.lastIndexOf('function MDXContent'))
    .trim()

  return prettier.format(cleanedContent, { parser: 'typescript' })
}
