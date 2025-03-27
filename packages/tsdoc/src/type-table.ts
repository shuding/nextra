import type { GenerateDocumentationOptions } from './base.js'
import { generateDocumentation } from './base.js'

export interface BaseTypeTableProps {
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
  code,
  options
}: BaseTypeTableProps) {
  const output = generateDocumentation('temp.ts', 'default', code, options)
  if (!output.length) {
    throw new Error("Can't find `export default` statement")
  }
  return output
}
