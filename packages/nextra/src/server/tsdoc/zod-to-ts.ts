import { z } from 'zod'

export function generateTsFromZod(schema: z.ZodType, indent = 2): string {
  const isZodObject = schema instanceof z.ZodObject
  if (!isZodObject) {
    return generateTsFromZodType(schema, indent)
  }
  return `{\n${Object.entries(schema.shape)
    .map(([key, value]) => {
      const tsType = generateTsFromZodType(value as z.ZodType, indent + 2)
      const docComment = getDocComment(value as z.ZodType, indent)
      return [
        docComment,
        ' '.repeat(indent),
        key,
        (value as z.ZodType).isOptional() ? '?' : '',
        `: ${tsType}\n`
      ].join('')
    })
    .join('\n')}${' '.repeat(indent - 2)}}`
}

function generateTsFromZodType(schema: z.ZodType, indent: number): string {
  const { name } = schema.constructor
  switch (name) {
    case 'ZodString':
      return 'string'
    case 'ZodNumber':
      return 'number'
    case 'ZodBoolean':
      return 'boolean'
    case 'ZodCustom':
      return '"@TODO TO IMPLEMENT"'
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
      .map(opt => generateTsFromZodType(opt as z.ZodType, indent))
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

function getDocComment(schema: z.ZodType, indent: number): string {
  // @ts-expect-error -- fixme
  const description = schema.description || schema.def.innerType.description
  const defaultValue =
    schema instanceof z.ZodDefault ? schema.def.defaultValue() : undefined
  const comments: string[] = []

  if (description) {
    comments.push(` * ${description}`)
  }
  if (
    // Do not add zod's `.default()` value, if already exist in TSDoc description
    !description?.includes('\n@default') &&
    defaultValue !== undefined
  ) {
    comments.push(` * @default ${JSON.stringify(defaultValue)}`)
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
