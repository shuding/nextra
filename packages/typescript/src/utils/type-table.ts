import * as fs from 'node:fs/promises';
import {
  generateDocumentation,
  type GenerateDocumentationOptions,
} from '@/lib/base';
import { join } from 'node:path';

export interface BaseTypeTableProps {
  /**
   * The path to source TypeScript file.
   */
  path?: string;

  /**
   * Exported type name to generate from.
   */
  name?: string;

  /**
   * Set the type to generate from.
   *
   * When used with `name`, it generates the type with `name` as export name.
   *
   * ```ts
   * export const myName = MyType;
   * ```
   *
   * When `type` contains multiple lines, `export const` is not added.
   * You need to export it manually, and specify the type name with `name`.
   *
   * ```tsx
   * <AutoTypeTable
   *   path="./file.ts"
   *   type={`import { ReactNode } from "react"
   *   export const MyName = ReactNode`}
   *   name="MyName"
   * />
   * ```
   */
  type?: string;

  options?: GenerateDocumentationOptions & {
    /**
     * base path to resolve `path` prop
     */
    basePath?: string;
  };
}

export async function getTypeTableOutput({
  name,
  type,
  options,
  ...props
}: BaseTypeTableProps) {
  const file =
    props.path && options?.basePath
      ? join(options.basePath, props.path)
      : props.path;
  let typeName = name;
  let content = '';

  if (file) {
    content = (await fs.readFile(file)).toString();
  }

  if (type && type.split('\n').length > 1) {
    content += `\n${type}`;
  } else if (type) {
    typeName ??= '$Fumadocs';
    content += `\nexport type ${typeName} = ${type}`;
  }

  const output = generateDocumentation(
    file ?? 'temp.ts',
    typeName,
    content,
    options,
  );

  if (name && output.length === 0)
    throw new Error(`${name} in ${file ?? 'empty file'} doesn't exist`);

  return output;
}
