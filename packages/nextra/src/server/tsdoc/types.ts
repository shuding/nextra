export type GeneratedType = {
  /** Type name. */
  name: string
  /** Type description. */
  description: string
  /** Type fields. */
  entries: TypeField[]
}

export type Tags = Record<string, string>

export type ReturnField = {
  /** Function return description. */
  description?: string
  /** Function return type. */
  type?: string
}

export type GeneratedFunction = {
  /** Function name. */
  name: string
  /** Function description. */
  description?: string
  /** Function tags. */
  tags?: Tags
  signatures: {
    /** Function parameters. */
    params: TypeField[]
    /** Function return. */
    returns: ReturnField[]
  }[]
}

export type TypeField = {
  /** Field name. */
  name: string
  /** Field description. */
  description?: string
  /** Field tags. */
  tags?: Tags
  /** Field type. */
  type: string
  /** Is field optional. */
  optional?: boolean
}

export type BaseTypeTableProps = {
  /** TypeScript source code to be processed. */
  code: string
  /**
   * Whether to flatten nested objects.
   * E.g. `{ foo: { bar: string } }` will be represented as: `{ foo.bar: string }`
   * @default false
   */
  flattened?: boolean
  /**
   * The name of the exported declaration.
   * @default "default"
   */
  exportName?: string
}
