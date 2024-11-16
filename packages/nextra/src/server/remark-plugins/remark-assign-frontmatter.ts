import path from 'node:path'
import type { Property } from 'estree'
import { valueToEstree } from 'estree-util-value-to-estree'
import type { Root } from 'mdast'
import slash from 'slash'
import type { Plugin } from 'unified'
import type { ReadingTime } from '../../types.js'
import { CWD } from '../constants.js'
import { getFrontMatterASTObject, isExportNode } from './remark-mdx-title.js'

export const remarkAssignFrontMatter: Plugin<
  [{ lastCommitTime?: number }],
  Root
> =
  ({ lastCommitTime }) =>
  (ast: Root, file) => {
    const frontMatterNode = ast.children.find(node =>
      isExportNode(node, 'metadata')
    )!
    const frontMatter = getFrontMatterASTObject(frontMatterNode)

    const [filePath] = file.history
    const { readingTime, title } = file.data as {
      readingTime?: ReadingTime
      title?: string
    }

    const { properties } = valueToEstree({
      ...(title && { title }),
      // File path can be undefined (e.g. dynamic mdx without filePath provided to processor)
      ...(filePath && { filePath: slash(path.relative(CWD, filePath)) }),
      ...(readingTime && { readingTime }),
      ...(lastCommitTime && { timestamp: lastCommitTime })
    }) as { properties: Property[] }
    frontMatter.push(...properties)
  }
