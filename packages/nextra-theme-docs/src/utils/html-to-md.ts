import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

export async function htmlToMarkdown(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse) // parse HTML -> HAST
    .use(rehypeRemark) // HAST -> MDAST (HTML -> Markdown AST)
    .use(remarkStringify, {
      // serialize MDAST -> Markdown text
      // optional: tweak Markdown output (bullet: '-', fence: '```', listItemIndent: '1', etc.)
      bullet: '-'
      // fence: '`',
      // listItemIndent: '1'
    })
    .process(html)
  console.log(html)
  return String(file) // markdown string
}
