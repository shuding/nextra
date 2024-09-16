import type { MDXWrapper } from 'nextra'
import { removeLinks } from 'nextra/remove-links'
import { MobileNav, Sidebar, SkipNavContent } from '../../components'
import { ClientWrapper } from './wrapper.client'

export const Wrapper: MDXWrapper = ({ toc, children, ...restProps }) => {
  return (
    <div className="_mx-auto _flex _max-w-[90rem]">
      <MobileNav toc={toc} />
      <Sidebar toc={toc} />

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
