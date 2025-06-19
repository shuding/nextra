import { z } from 'zod'

export function generateTsFromZod(schema: z.ZodType, indent = 2): string {
  const isZodObject = schema instanceof z.ZodObject
  if (!isZodObject) {
    return generateTsFromZodType(schema, indent)
  }
  const objectFields = Object.entries(schema.shape)
    .map(([key, _value]) => {
      const value = _value as z.ZodType
      const tsType = generateTsFromZodType(value, indent + 2)
      const docComment = getDocComment(value, indent)
      // Check if field explicitly set as optional with .optional(),
      // otherwise it's optional if it has a default value
      const isOptional =
        value instanceof z.ZodOptional || getDefaultValue(value) !== undefined
      return [
        docComment,
        ' '.repeat(indent),
        key,
        isOptional ? '?' : '',
        `: ${tsType}\n`
      ].join('')
    })
    .join('\n')

  return ['{\n', objectFields, ' '.repeat(indent - 2), '}'].join('')
}

function generateTsFromZodType(schema: z.ZodType, indent: number): string {
  const { name } = schema.constructor
  const typeName = schema.meta()?.type as string | undefined
  if (typeName) return typeName

  if (schema instanceof z.ZodCustom) {
    const fnName = schema.def.fn.name
    return fnName.startsWith('check')
      ? 'React.' + fnName.slice(5)
      : '"@TODO TO IMPLEMENT"'
  }

  switch (name) {
    case 'ZodString':
      return 'string'
    case 'ZodNumber':
      return 'number'
    case 'ZodBoolean':
      return 'boolean'
  }
  if (schema instanceof z.ZodPipe) {
    // @ts-expect-error -- fixme
    return generateTsFromZodType(schema.in, indent)
  }
  if (schema instanceof z.ZodLiteral) {
    return `"${[...schema.values]}"`
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodDefault) {
    // @ts-expect-error -- fixme
    return generateTsFromZodType(schema.def.innerType, indent)
  }
  if (schema instanceof z.ZodNullable) {
    // @ts-expect-error -- fixme
    return `${generateTsFromZodType(schema.def.innerType, indent)} | null`
  }
  if (schema instanceof z.ZodArray) {
    // @ts-expect-error -- fixme
    return `${generateTsFromZodType(schema.def.element, indent)}[]`
  }
  if (schema instanceof z.ZodUnion) {
    return schema.def.options
      .map(opt => {
        const r = generateTsFromZodType(opt as z.ZodType, indent)
        return opt instanceof z.ZodArray ? `(${r.replace('[', ')[')}` : r
      })
      .join(' | ')
  }
  if (schema instanceof z.ZodObject) {
    return generateTsFromZod(schema, indent)
  }
  if (schema instanceof z.ZodEnum) {
    // @ts-expect-error -- fixme
    return schema.options.map((v: string) => `"${v}"`).join(' | ')
  }
  throw new Error(`Unknown schema type '${name}'`)
}

function getDefaultValue(schema: z.ZodType): unknown {
  if (schema instanceof z.ZodDefault) {
    return schema.def.defaultValue()
  }
  if (schema instanceof z.ZodPipe) {
    // @ts-expect-error fixme
    return schema.in.def.defaultValue()
  }
  // eslint-disable-next-line sonarjs/no-redundant-jump -- this fix types-check error in `@nextra-tsdoc` – ../nextra/src/server/tsdoc/zod-to-ts.ts:87:46 - error TS7030: Not all code paths return a value.
  return
}

function getDocComment(schema: z.ZodType, indent: number): string {
  const meta = (schema.meta() ?? {}) as Record<string, string>
  const description: string =
    // @ts-expect-error -- fixme
    meta.description || schema.def.innerType?.description
  const defaultValue = getDefaultValue(schema)
  const def =
    meta.default ??
    (defaultValue === undefined
      ? undefined
      : JSON.stringify(defaultValue, null, 2))
  const comments: string[] = []
  if (description) {
    comments.push(description)
  }
  if (def !== undefined) {
    comments.push(`@default ${def}`)
  }
  if (!comments.length) {
    return ''
  }
  const comment = [
    //
    '/**',
    ...comments.flatMap(comment =>
      comment.split('\n').map(line => ` * ${line}`)
    ),
    ' */'
  ]
    .map(line => `${' '.repeat(indent)}${line}`)
    .join('\n')

  return comment + '\n'
}
