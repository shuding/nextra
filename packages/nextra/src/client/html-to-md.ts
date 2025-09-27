import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

export async function htmlToMarkdown(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse) // parse HTML -> HAST
    .use(rehypeRemark) // HAST -> MDAST (HTML -> Markdown AST)
    .use(remarkGfm) // support GFM (tables)
    .use(
      remarkStringify, // serialize MDAST -> Markdown text
      {
        bullet: '-'
      }
    )
    .process(html)
  return String(file) // markdown string
}
