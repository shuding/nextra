import path from 'node:path'
import type { Property } from 'estree'
import type { MdxjsEsm } from 'hast-util-to-estree/lib/handlers/mdxjs-esm'
import type { Root, RootContent } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { EXIT, visit } from 'unist-util-visit'
import { pageTitleFromFilename } from '../utils.js'
import { getFlattenedValue } from './remark-headings.js'

export function getFrontMatterASTObject(node: MdxjsEsm): Property[] {
  const [n] = node.data!.estree!.body
  return (n as any).declaration.declarations[0].init.properties
}

export function isExportNode(
  node: MdxjsEsm | RootContent,
  varName: string
): node is MdxjsEsm {
  if (node.type !== 'mdxjsEsm') return false
  const n = node.data!.estree!.body[0]!

  if (n.type !== 'ExportNamedDeclaration') return false

  const name = (n as any).declaration?.declarations?.[0].id.name
  if (!name) return false

  return name === varName
}

const transformer: Transformer<Root> = (ast, file) => {
  let title = ''

  const frontMatterNode = ast.children.find(node =>
    isExportNode(node, 'metadata')
  )!

  for (const { key, value } of getFrontMatterASTObject(frontMatterNode)) {
    if (key.type === 'Literal' && key.value === 'title') {
      // @ts-expect-error -- fixme
      title = value.value
      break
    }
    if (key.type === 'Identifier' && key.name === 'title') {
      // @ts-expect-error -- fixme
      title = value.value
      break
    }
  }
  // No title in metadata
  if (!title) {
    // Get from first h1
    visit(ast, { type: 'heading', depth: 1 }, node => {
      title = getFlattenedValue(node)
      return EXIT
    })
    // Get from filename
    if (!title) {
      const [filePath] = file.history
      if (filePath) {
        title = pageTitleFromFilename(path.parse(filePath).name)
      }
    }
    // Set from h1 or from filename
    if (title) {
      file.data.title = title
    }
  }
}

export const remarkMdxTitle: Plugin<[], Root> = () => transformer
