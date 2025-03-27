import { getTypeTableOutput } from '../utils/type-table'

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
})
