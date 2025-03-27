import { z } from 'zod'

export function generateTsFromZod(schema: z.ZodTypeAny, indent = 2): string {
  const isZodObject = schema instanceof z.ZodObject
  if (!isZodObject) {
    // @ts-expect-error -- fixme
    return generateTsFromZodType(schema, indent)
  }
  return `{\n${Object.entries(schema.shape)
    .map(([key, value]) => {
      // @ts-expect-error -- fixme
      const result = generateTsFromZodType(value, indent + 2)
      const tsType = typeof result === 'object' ? result.type : result
      const optional = typeof result === 'object' && result.optional
      // @ts-expect-error -- fixme
      const docComment = getDocComment(value, indent)
      return `${docComment}${' '.repeat(indent)}${key}${optional ? '?' : ''}: ${tsType};\n`
    })
    .join('\n')}${' '.repeat(indent - 2)}}`
}

function generateTsFromZodType(
  schema: z.ZodTypeAny,
  indent: number
): string | { type: string; optional: boolean } {
  if (schema instanceof z.ZodString) {
    return 'string'
  }
  if (schema instanceof z.ZodNumber) {
    return 'number'
  }
  if (schema instanceof z.ZodBoolean) {
    return 'boolean'
  }
  if (schema instanceof z.ZodOptional) {
    return {
      type: generateTsFromZodType(schema._def.innerType, indent) as string,
      optional: true
    }
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
  if (schema instanceof z.ZodLiteral) {
    return `"${schema._def.value}"`
  }
  if (schema instanceof z.ZodObject) {
    return generateTsFromZod(schema, indent)
  }
  if (schema instanceof z.ZodEffects) {
    return '"TO IMPLEMENT"'
  }
  if (schema instanceof z.ZodAny) {
    return '"TO IMPLEMENT"'
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
    comments.push(` * @description ${description}`)
  }
  if (defaultValue !== undefined) {
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
