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
      return [
        docComment,
        ' '.repeat(indent),
        key,
        value.isOptional() ? '?' : '',
        `: ${tsType}\n`
      ].join('')
    })
    .join('\n')

  return ['{\n', objectFields, ' '.repeat(indent - 2), '}'].join('')
}

function generateTsFromZodType(schema: z.ZodType, indent: number): string {
  const { name } = schema.constructor
  if (schema instanceof z.ZodCustom) {
    const typeName = schema.meta()?.type as string | undefined
    if (typeName) return typeName
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
}

function getDocComment(schema: z.ZodType, indent: number): string {
  const meta = schema.meta() ?? ({} as Record<string, string>)
  const description =
    // @ts-expect-error -- fixme
    meta.description || schema.def.innerType?.description
  const defaultValue = getDefaultValue(schema)
  const comments: string[] = []

  if (description) {
    comments.push(` * ${description}`)
  }
  if (defaultValue !== undefined) {
    comments.push(` * @default ${meta.default ?? JSON.stringify(defaultValue)}`)
  }
  if (!comments.length) {
    return ''
  }
  const spacing = ' '.repeat(indent)
  const comment = [
    `${spacing}/**`,
    ...comments.map(line => `${spacing}${line}`),
    `${spacing} */`
  ].join('\n')

  return comment + '\n'
}
