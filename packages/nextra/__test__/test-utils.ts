import prettier from 'prettier'

export async function clean(content: any): Promise<string> {
  const cleanedContent = content
    // Remove starting from `function MDXContent` declaration
    .slice(content.indexOf('\n'), content.lastIndexOf('function MDXContent'))
    .trim()

  return prettier.format(cleanedContent, { parser: 'typescript' })
}
