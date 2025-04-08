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
  /** Function return type. */
  type: string
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
