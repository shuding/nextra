export type GeneratedType = {
  /** Type fields. */
  entries: TypeField[]
}

export type Tags = Record<string, string>

export type ReturnField = {
  /** Function return type. */
  type: string
}

export type GeneratedDefinition = {
  /**
   * Where type definition is located on disk.
   */
  filePath?: string
  /**
   * Definition name.
   */
  name: string
  /**
   * Definition description.
   */
  description?: string
  /**
   * [TSDoc tags](https://tsdoc.org/pages/spec/tag_kinds).
   */
  tags?: Tags
}

export type GeneratedFunction = {
  signatures: {
    /** Function parameters. */
    params: TypeField[]
    /** Function return. */
    returns: TypeField[] | ReturnField
  }[]
}

export type TypeField = {
  /** Field name. */
  name: string
  /** Field type. */
  type: string
  /** Field description. */
  description?: string
  /** Is field optional. */
  optional?: boolean
  /** Field tags. */
  tags?: Tags
}

export type BaseArgs = {
  /** TypeScript source code to be processed. */
  code: string
  /**
   * The name of the exported declaration.
   * @default "default"
   */
  exportName?: string
  /**
   * Whether to flatten nested objects.
   * E.g. `{ foo: { bar: string } }` will be represented as: `{ foo.bar: string }`
   * @default false
   */
  flattened?: boolean
}
