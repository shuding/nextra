import type {
  ArrayExpression,
  ExportNamedDeclaration,
  Expression,
  ObjectExpression
} from 'estree'
import title from 'title'
import { DEFAULT_PROPERTY_PROPS } from './constants.js'

export const logger = {
  info: console.log.bind(null, '-', '\u001B[36minfo\u001B[0m', '[nextra]'),
  warn: console.log.bind(null, '-', '\u001B[33mwarn\u001B[0m', '[nextra]'),
  error: console.log.bind(null, '-', '\u001B[31merror\u001B[0m', '[nextra]')
}

export function pageTitleFromFilename(fileName: string) {
  return title(fileName.replaceAll(/[-_]/g, ' '), {
    special: ['SSR', 'CORS', 'ESLint']
  })
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
