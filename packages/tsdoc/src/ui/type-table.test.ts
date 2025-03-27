import { getTypeTableOutput } from '../utils/type-table.js'

describe('TypeTable', () => {
  it('<Banner />', async () => {
    const code = `import type { Banner } from 'nextra/components'
type $ = React.ComponentProps<typeof Banner>
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchSnapshot()
  })
  it('<Search />', async () => {
    const code = `import type { Search } from 'nextra/components'
type $ = React.ComponentProps<typeof Search>
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchSnapshot()
  })
  it('<Callout />', async () => {
    const code = `import type { Callout } from 'nextra/components'
type $ = React.ComponentProps<typeof Callout>
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchSnapshot()
  })
  it('<NotFoundPage />', async () => {
    const code = `import type { NotFoundPage } from 'nextra-theme-docs'
type $ = React.ComponentProps<typeof NotFoundPage>
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchSnapshot()
  })
  it('inline description and @description as tag', async () => {
    const code = `type $ = {
/**
 * @description Show or hide breadcrumb navigation.
 */
breadcrumb?: boolean

/**
 * Indicates whether the item in sidebar is collapsed by default.
 */
collapsed?: boolean
}
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "",
              "name": "breadcrumb",
              "required": false,
              "tags": {
                "description": "Show or hide breadcrumb navigation.",
              },
              "type": "boolean",
            },
            {
              "description": "Indicates whether the item in sidebar is collapsed by default.",
              "name": "collapsed",
              "required": false,
              "tags": {},
              "type": "boolean",
            },
          ],
          "name": "default",
        },
      ]
    `)
  })
})
