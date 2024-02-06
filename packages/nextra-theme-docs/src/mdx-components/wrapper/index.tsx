import type { NextraMDXContent } from 'nextra'
import { removeLinks } from 'nextra/remove-links'
import { SkipNavContent } from '../../components'
import { ClientWrapper } from './wrapper.client'

export const Wrapper: NextraMDXContent = ({ toc, children, ...restProps }) => {
  return (
    <div className="_mx-auto _flex _max-w-[90rem]">
      <ClientWrapper
        // @ts-expect-error fixme
        toc={toc.map(item => ({
          ...item,
          value: removeLinks(item.value)
        }))}
        skipNavContent={<SkipNavContent />}
        {...restProps}
      >
        {children}
      </ClientWrapper>
    </div>
  )
}
