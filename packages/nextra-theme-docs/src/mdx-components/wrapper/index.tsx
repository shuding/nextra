import type { MDXWrapper } from 'nextra'
import { removeLinks } from 'nextra/remove-links'
import { MobileNav, Sidebar, SkipNavContent } from '../../components'
import { ClientWrapper } from './wrapper.client'

export const Wrapper: MDXWrapper = ({ toc, children, ...props }) => {
  return (
    <div className="_mx-auto _flex _max-w-[90rem]">
      <Sidebar toc={toc} />

      <MobileNav toc={toc} />

      <ClientWrapper
        // @ts-expect-error fixme
        toc={toc.map(item => ({
          ...item,
          value: removeLinks(item.value)
        }))}
        {...props}
      >
        <SkipNavContent />
        <main
          data-pagefind-body={
            (props.metadata as any).searchable !== false || undefined
          }
        >
          {children}
        </main>
      </ClientWrapper>
    </div>
  )
}
