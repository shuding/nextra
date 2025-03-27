import { z } from 'zod'

export function generateTsFromZod(schema: z.ZodTypeAny, indent = 0): string {
  if (schema instanceof z.ZodObject) {
    return `{\n${Object.entries(schema.shape)
      .map(([key, value]) => {
        const tsType = generateTsFromZod(value, indent + 2)
        const docComment = getDocComment(value)
        return `${' '.repeat(indent + 2)}${docComment}${key}: ${tsType};\n`
      })
      .join('')}${' '.repeat(indent)}}`
  }
  if (schema instanceof z.ZodString) {
    return 'string'
  }
  if (schema instanceof z.ZodNumber) {
    return 'number'
  }
  if (schema instanceof z.ZodBoolean) {
    return 'boolean'
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return `${generateTsFromZod(schema._def.innerType, indent)}?`
  }
  if (schema instanceof z.ZodArray) {
    return `${generateTsFromZod(schema._def.type, indent)}[]`
  }
  if (schema instanceof z.ZodUnion) {
    return schema._def.options
      .map((opt: any) => generateTsFromZod(opt, indent))
      .join(' | ')
  } if (schema instanceof z.ZodDefault) {
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
