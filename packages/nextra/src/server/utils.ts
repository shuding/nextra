import path from 'node:path'
import type {
  ArrayExpression,
  ExportNamedDeclaration,
  Expression,
  ObjectExpression
} from 'estree'
import fg from 'fast-glob'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import slash from 'slash'
import title from 'title'
import { CWD, DEFAULT_PROPERTY_PROPS } from './constants.js'

export const logger = {
  info: console.log.bind(null, '-', '\x1b[36minfo\x1b[0m', '[nextra]'),
  warn: console.log.bind(null, '-', '\x1b[33mwarn\x1b[0m', '[nextra]'),
  error: console.log.bind(null, '-', '\x1b[31merror\x1b[0m', '[nextra]')
}

export function pageTitleFromFilename(fileName: string) {
  return title(fileName.replaceAll(/[-_]/g, ' '), { special: ['SSR'] })
}

export function normalizePageRoute(parentRoute: string, route: string): string {
  return slash(path.join(parentRoute, route.replace(/^index$/, '')))
}

export function createAstExportConst(
  name: string,
  value: ArrayExpression | ObjectExpression | Expression
): ExportNamedDeclaration {
  return {
    type: 'ExportNamedDeclaration',
    specifiers: [],
    declaration: {
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name },
          init: value
        }
      ]
    }
  }
}

export function createAstObject(
  obj: Record<string, string | number | boolean | null | Expression>
): ObjectExpression {
  return {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([key, value]) => ({
      ...DEFAULT_PROPERTY_PROPS,
      key: { type: 'Identifier', name: key },
      value:
        value && typeof value === 'object' ? value : { type: 'Literal', value }
    }))
  }
}

export function getDirectories() {
  const { appDir } = findPagesDir(CWD)
  if (!appDir) {
    throw new Error('Unable to find `app` directory')
  }
  // Next.js take priority to `app` rather than `src/app`, we do the same for
  // `content` directory
  const [contentDir] = fg.sync(['{src/,}content'], { onlyDirectories: true })
  return {
    appDir,
    contentDir
  }
}
