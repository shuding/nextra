import type { GenerateDocumentationOptions } from '../lib/base.js'
import { generateDocumentation } from '../lib/base.js'

export interface BaseTypeTableProps {
  /**
   * Exported type name to generate from.
   * @default 'default'
   */
  exportName?: string

  /**
   * Set the type to generate from.
   */
  code: string

  options?: GenerateDocumentationOptions & {
    /**
     * base path to resolve `path` prop
     */
    basePath?: string
  }
}

export async function getTypeTableOutput({
  exportName = 'default',
  code,
  options
}: BaseTypeTableProps) {
  const output = generateDocumentation('temp.ts', exportName, code, options)
  if (!output.length) {
    throw new Error(`Type "${exportName}" in code doesn't exist`)
  }
  return output
}
