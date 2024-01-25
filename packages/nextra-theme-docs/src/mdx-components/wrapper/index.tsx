import type { NextraMDXContent } from 'nextra'
import { removeLinks } from 'nextra/remove-links'
import { ClientWrapper } from './wrapper.client'

export const Wrapper: NextraMDXContent = ({ toc, children }) => {
  return (
    <div className="_mx-auto _flex _max-w-[90rem]">
      <ClientWrapper
        // @ts-expect-error fixme
        toc={toc.map(item => ({
          ...item,
          value: removeLinks(item.value)
        }))}
      >
        {children}
      </ClientWrapper>
    </div>
  )
}
