import type { MDXWrapper } from 'nextra'
import { SkipNavContent } from 'nextra/components'
import { removeLinks } from 'nextra/remove-links'
import { Sidebar } from '../../components'
import { ClientWrapper } from './wrapper.client'

export const Wrapper: MDXWrapper = ({ toc, children, ...props }) => {
  // @ts-expect-error fixme
  toc = toc.map(item => ({
    ...item,
    value: removeLinks(item.value)
  }))
  return (
    <div className="_mx-auto _flex _max-w-[90rem]">
      <Sidebar toc={toc} />

      <ClientWrapper toc={toc} {...props}>
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
