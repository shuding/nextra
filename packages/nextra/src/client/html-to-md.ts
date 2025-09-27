import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
// import { SKIP, visit } from 'unist-util-visit'

// function remarkRemoveComments() {
//   return (tree: any) => {
//     visit(tree, 'html', (node, index, parent) => {
//       console.log(node.value, node.value.trim().startsWith('<!--'))
//       // if (
//       //   typeof node.value === 'string' &&
//       //   node.value.trim().startsWith('<!--')
//       // ) {
//       //   parent.children.splice(index, 1)
//       //   return [SKIP, index] // stop visiting this branch
//       // }
//     })
//   }
// }

export async function htmlToMarkdown(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse) // parse HTML -> HAST
    .use(rehypeRemark) // HAST -> MDAST (HTML -> Markdown AST)
    .use(remarkGfm) // support GFM (tables)
    .use(remarkStringify, {
      // serialize MDAST -> Markdown text
      // optional: tweak Markdown output (bullet: '-', fence: '```', listItemIndent: '1', etc.)
      bullet: '-'
      // fence: '`',
      // listItemIndent: '1'
    })
    // .use(remarkRemoveComments)
    .process(html)
  console.log(html)
  return String(file) // markdown string
}
