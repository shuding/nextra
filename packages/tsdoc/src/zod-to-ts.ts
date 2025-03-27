import { z } from 'zod'

export function generateTsFromZod(schema: z.ZodTypeAny, indent = 2): string {
  const isZodObject = schema instanceof z.ZodObject
  if (!isZodObject) {
    return generateTsFromZodType(schema, indent)
  }
  return `{\n${Object.entries(schema.shape)
    .map(([key, value]) => {
      const tsType = generateTsFromZodType(value as z.ZodTypeAny, indent + 2)
      const docComment = getDocComment(value as z.ZodTypeAny, indent)
      // @ts-expect-error -- fixme
      return `${docComment}${' '.repeat(indent)}${key}${value.isOptional() ? '?' : ''}: ${tsType}\n`
    })
    .join('\n')}${' '.repeat(indent - 2)}}`
}

function generateTsFromZodType(schema: z.ZodTypeAny, indent: number): string {
  if (schema instanceof z.ZodString) return 'string'
  if (schema instanceof z.ZodNumber) return 'number'
  if (schema instanceof z.ZodBoolean) return 'boolean'
  if (schema instanceof z.ZodLiteral) return `"${schema._def.value}"`
  if (schema instanceof z.ZodOptional) {
    return generateTsFromZodType(schema._def.innerType, indent)
  }
  if (schema instanceof z.ZodNullable) {
    return `${generateTsFromZodType(schema._def.innerType, indent)} | null`
  }
  if (schema instanceof z.ZodArray) {
    return `${generateTsFromZodType(schema._def.type, indent)}[]`
  }
  if (schema instanceof z.ZodUnion) {
    return schema._def.options
      .map((opt: any) => generateTsFromZodType(opt, indent))
      .join(' | ')
  }
  if (schema instanceof z.ZodDefault) {
    return generateTsFromZodType(schema._def.innerType, indent)
  }
  if (schema instanceof z.ZodObject) {
    return generateTsFromZod(schema, indent)
  }
  if (schema instanceof z.ZodEffects) {
    return generateTsFromZodType(schema._def.schema, indent)
  }
  if (schema instanceof z.ZodAny) {
    return '"@TODO TO IMPLEMENT"'
  }
  if (schema instanceof z.ZodEnum) {
    return schema._def.values.map((v: string) => `"${v}"`).join(' | ')
  }
  throw new Error(`Unknown schema type '${schema.constructor.name}'`)
}

function getDocComment(schema: z.ZodTypeAny, indent: number): string {
  const { description } = schema._def
  const defaultValue =
    schema instanceof z.ZodDefault ? schema._def.defaultValue() : undefined
  const comments: string[] = []

  if (description) {
    comments.push(` * ${description}`)
  }
  if (!description?.includes('\n@default') && defaultValue !== undefined) {
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
