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
  if (schema instanceof z.ZodString) return 'string'
  if (schema instanceof z.ZodNumber) return 'number'
  if (schema instanceof z.ZodBoolean) return 'boolean'
  // @ts-expect-error -- fixme
  if (schema instanceof z.ZodLiteral) return `"${schema.def.value}"`
  if (schema instanceof z.ZodOptional) {
    // @ts-expect-error -- fixme
    return generateTsFromZodType(schema.def.innerType, indent)
  }
  if (schema instanceof z.ZodNullable) {
    // @ts-expect-error -- fixme
    return `${generateTsFromZodType(schema.def.innerType, indent)} | null`
  }
  if (schema instanceof z.ZodArray) {
    // @ts-expect-error -- fixme
    return `${generateTsFromZodType(schema.def.type, indent)}[]`
  }
  if (schema instanceof z.ZodUnion) {
    return schema.def.options
      .map((opt: any) => generateTsFromZodType(opt, indent))
      .join(' | ')
  }
  if (schema instanceof z.ZodDefault) {
    // @ts-expect-error -- fixme
    return generateTsFromZodType(schema.def.innerType, indent)
  }
  if (schema instanceof z.ZodObject) {
    return generateTsFromZod(schema, indent)
  }
  // @ts-expect-error -- fixme
  if (schema instanceof z.ZodEffects) {
    // @ts-expect-error -- fixme
    return generateTsFromZodType(schema.def.schema, indent)
  }
  if (schema instanceof z.ZodAny) {
    return '"@TODO TO IMPLEMENT"'
  }
  if (schema instanceof z.ZodEnum) {
    // @ts-expect-error -- fixme
    return schema.def.values.map((v: string) => `"${v}"`).join(' | ')
  }
  throw new Error(`Unknown schema type '${schema.constructor.name}'`)
}

function getDocComment(schema: z.ZodType, indent: number): string {
  // @ts-expect-error -- fixme
  const { description } = schema.def
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
