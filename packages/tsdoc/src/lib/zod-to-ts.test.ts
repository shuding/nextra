import { z } from 'zod'
import { generateTsFromZod } from './zod-to-ts.js'

describe('generateTsFromZod', () => {
  it('should generate TypeScript with @description and @default for primitive types', () => {
    const schema = z.strictObject({
      id: z.string().describe('The unique identifier'),
      name: z.string().default('Anonymous').describe("The user's name"),
      age: z.number().optional().describe("User's age"),
      isAdmin: z.boolean().default(false).describe('Admin status')
    })

    const expected = `{
  /**
   * @description The unique identifier
   */
  id: string

  /**
   * @description The user's name
   * @default "Anonymous"
   */
  name: string

  /**
   * @description User's age
   */
  age?: number

  /**
   * @description Admin status
   * @default false
   */
  isAdmin: boolean
}`

    expect(generateTsFromZod(schema)).toBe(expected)
  })

  it('should handle nested objects correctly', () => {
    const schema = z.strictObject({
      user: z
        .strictObject({
          id: z.string().describe('User ID'),
          profile: z
            .strictObject({
              bio: z.string().optional().describe('User bio'),
              age: z.number().default(25).describe("User's age")
            })
            .describe('Profile')
        })
        .describe('User')
    })

    const expected = `{
  /**
   * @description User
   */
  user: {
    /**
     * @description User ID
     */
    id: string

    /**
     * @description Profile
     */
    profile: {
      /**
       * @description User bio
       */
      bio?: string

      /**
       * @description User's age
       * @default 25
       */
      age: number
    }
  }
}`

    expect(generateTsFromZod(schema)).toBe(expected)
  })

  it('should handle arrays and unions', () => {
    const schema = z.strictObject({
      tags: z.array(z.string()).describe('User tags'),
      status: z
        .union([z.literal('active'), z.literal('inactive')])
        .describe('User status')
    })

    const expected = `{
  /**
   * @description User tags
   */
  tags: string[]

  /**
   * @description User status
   */
  status: "active" | "inactive"
}`

    expect(generateTsFromZod(schema)).toBe(expected)
  })

  it('should handle nullable and optional types', () => {
    const schema = z.strictObject({
      nickname: z.string().nullable().describe('User nickname'),
      country: z.string().optional().describe("User's country")
    })

    const expected = `{
  /**
   * @description User nickname
   */
  nickname: string | null

  /**
   * @description User's country
   */
  country?: string
}`

    expect(generateTsFromZod(schema)).toBe(expected)
  })

  it('should handle default values correctly', () => {
    const schema = z.strictObject({
      active: z.boolean().default(true).describe('User active status'),
      count: z.number().default(0).describe('User count')
    })

    const expected = `{
  /**
   * @description User active status
   * @default true
   */
  active: boolean

  /**
   * @description User count
   * @default 0
   */
  count: number
}`

    expect(generateTsFromZod(schema)).toBe(expected)
  })

  it('should handle enum', () => {
    expect(generateTsFromZod(z.strictObject({
      layout: z
        .enum(['default', 'full'])
        .optional()
        .default('default')
        .describe('Defines the layout style.'),
    }))).toMatchInlineSnapshot(`
      "{
        /**
         * @description Defines the layout style.
         * @default "default"
         */
        layout?: "default" | "full"
      }"
    `)
  })
})
