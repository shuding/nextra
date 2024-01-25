import { removeLinks } from 'nextra/remove-links'
import type { NextraMDXContent } from 'nextra'
import { ClientWrapper } from './wrapper.client'

export const Wrapper: NextraMDXContent = ({ toc, children }) => {
  return (
    <ClientWrapper
      // @ts-expect-error fixme
      toc={toc.map(item => ({
        ...item,
        value: removeLinks(item.value)
      }))}
    >
      {children}
    </ClientWrapper>
  )
}
