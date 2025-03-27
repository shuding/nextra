import { getTypeTableOutput } from '../utils/type-table'

describe('TypeTable', () => {
  it('<Banner />', async () => {
    const code = `import type { ComponentProps } from 'react'
import type { Banner } from 'nextra/components'
type BannerProps = ComponentProps<typeof Banner>
export default BannerProps`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchSnapshot()
  })
  it('<Search />', async () => {
    const code = `import type { ComponentProps } from 'react'
import type { Search } from 'nextra/components'
type SearchProps = ComponentProps<typeof Search>
export default SearchProps`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchSnapshot()
  })
})
