import { reactNode } from 'nextra/schemas'
import { z } from 'zod'
import { LayoutPropsSchema } from '../../../nextra-theme-docs/src/schemas.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { NextraConfigSchema } from '../../../nextra/src/server/schemas.js'
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts.js'

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
   * The unique identifier
   */
  id: string

  /**
   * The user's name
   * @default "Anonymous"
   */
  name?: string

  /**
   * User's age
   */
  age?: number

  /**
   * Admin status
   * @default false
   */
  isAdmin?: boolean
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
   * User
   */
  user: {
    /**
     * User ID
     */
    id: string

    /**
     * Profile
     */
    profile: {
      /**
       * User bio
       */
      bio?: string

      /**
       * User's age
       * @default 25
       */
      age?: number
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
   * User tags
   */
  tags: string[]

  /**
   * User status
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
   * User nickname
   */
  nickname: string | null

  /**
   * User's country
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
   * User active status
   * @default true
   */
  active?: boolean

  /**
   * User count
   * @default 0
   */
  count?: number
}`
    expect(generateTsFromZod(schema)).toBe(expected)
  })

  it('should handle enum', () => {
    const schema = z.strictObject({
      layout: z
        .enum(['default', 'full'])
        .optional()
        .default('default')
        .describe('Defines the layout style.')
    })
    expect(generateTsFromZod(schema)).toMatchInlineSnapshot(`
      "{
        /**
         * Defines the layout style.
         * @default "default"
         */
        layout?: "default" | "full"
      }"
    `)
  })

  it('should handle ReactNode', () => {
    const schema = z.strictObject({
      children: reactNode
        .describe('Extra content after last icon.')
        .default(null)
    })
    expect(generateTsFromZod(schema)).toMatchInlineSnapshot(`
      "{
        /**
         * Extra content after last icon.
         * @default null
         */
        children?: React.ReactNode
      }"
    `)
  })

  it('should convert LayoutPropsSchema', () => {
    return expect(
      'interface $ ' + generateTsFromZod(LayoutPropsSchema)
    ).toMatchFileSnapshot('./snapshots/layout-props.ts')
  })
  it('should convert HeadPropsSchema', () => {
    return expect(
      'interface $$ ' + generateTsFromZod(HeadPropsSchema)
    ).toMatchFileSnapshot('./snapshots/head-props.ts')
  })
  it('should convert NextraConfigSchema and HeadPropsSchema', () => {
    return expect(
      `export interface NextraConfig ${generateTsFromZod(NextraConfigSchema)}

export interface HeadProps ${generateTsFromZod(HeadPropsSchema)}`
    ).toMatchFileSnapshot('../../../nextra/src/types.generated.ts')
  })
})
