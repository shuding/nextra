import { z } from 'zod'

function generateTsFromZod(schema: z.ZodTypeAny, indent = 0): string {
  if (schema instanceof z.ZodObject) {
    return `{\n${Object.entries(schema.shape)
      .map(([key, value]) => {
        const tsType = generateTsFromZod(value, indent + 2)
        const docComment = getDocComment(value)
        return `${' '.repeat(indent + 2)}${docComment}${key}: ${tsType};\n`
      })
      .join('')}${' '.repeat(indent)}}`
  } else if (schema instanceof z.ZodString) {
    return 'string'
  } else if (schema instanceof z.ZodNumber) {
    return 'number'
  } else if (schema instanceof z.ZodBoolean) {
    return 'boolean'
  } else if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable
  ) {
    return `${generateTsFromZod(schema._def.innerType, indent)}?`
  } else if (schema instanceof z.ZodArray) {
    return `${generateTsFromZod(schema._def.type, indent)}[]`
  } else if (schema instanceof z.ZodUnion) {
    return schema._def.options
      .map((opt: any) => generateTsFromZod(opt, indent))
      .join(' | ')
  } else if (schema instanceof z.ZodDefault) {
    return generateTsFromZod(schema._def.innerType, indent)
  }

  return 'unknown'
}

function getDocComment(schema: z.ZodTypeAny): string {
  const description = (schema._def as any).description
  const defaultValue =
    schema instanceof z.ZodDefault ? schema._def.defaultValue() : undefined
  const comments: string[] = []

  if (description) comments.push(` * @description ${description}`)
  if (defaultValue !== undefined)
    comments.push(` * @default ${JSON.stringify(defaultValue)}`)

  return comments.length ? `/**\n${comments.join('\n')}\n */\n` : ''
}
