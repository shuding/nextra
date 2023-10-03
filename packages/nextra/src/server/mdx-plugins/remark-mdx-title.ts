import type { Property } from 'estree'
import type { MdxjsEsm } from 'hast-util-to-estree/lib/handlers/mdxjs-esm'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { createAstExportConst } from '../utils.js'

function getFrontMatterASTObject(node: MdxjsEsm): Property[] {
  const [n] = node.data!.estree!.body
  return (n as any).declaration.declarations[0].init.properties
}

export const remarkMdxTitle: Plugin<[], Root> = () => ast => {
  let title = ''
  const frontMatterNode = ast.children.find((node: MdxjsEsm) => {
    if (node.type !== 'mdxjsEsm') return
    const [n] = node.data!.estree!.body

    if (n.type !== 'ExportNamedDeclaration') return
    return (n as any).declaration.declarations[0].id.name === 'frontMatter'
  })
  const frontMatter = getFrontMatterASTObject(frontMatterNode)
  for (const { key, value } of frontMatter) {
    if (key.value === 'title') {
      title = value.value
      break
    }
  }
  ast.children.unshift(
    {
      type: 'mdxjsEsm',
      data: {
        estree: {
          body: [
            createAstExportConst('title', { type: 'Literal', value: title })
          ]
        }
      }
    }
  )
}
