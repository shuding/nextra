import cn from 'clsx'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import type { Components } from 'nextra/mdx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Children, cloneElement, useEffect, useRef, useState } from 'react'
import { Anchor, Collapse } from './components'
import type { AnchorProps } from './components/anchor'
import type { DocsThemeConfig } from './constants'
import { DetailsProvider, useDetails, useSetActiveAnchor } from './contexts'
import { useIntersectionObserver, useSlugs } from './contexts/active-anchor'

// Anchor links
function HeadingLink({
  tag: Tag,
  context,
  children,
  id,
  className,
  ...props
}: ComponentProps<'h2'> & {
  tag: `h${2 | 3 | 4 | 5 | 6}`
  context: { index: number }
}): ReactElement {
  const setActiveAnchor = useSetActiveAnchor()
  const slugs = useSlugs()
  const observer = useIntersectionObserver()
  const obRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!id) return
    const heading = obRef.current
    if (!heading) return
    slugs.set(heading, [id, (context.index += 1)])
    observer?.observe(heading)

    return () => {
      observer?.disconnect()
      slugs.delete(heading)
      setActiveAnchor(f => {
        const ret = { ...f }
        delete ret[id]
        return ret
      })
    }
  }, [id, context, slugs, observer, setActiveAnchor])

  return (
    <Tag
      className={
        // can be added by footnotes
        className === 'sr-only'
          ? '_sr-only'
          : cn(
              '_font-semibold _tracking-tight _text-slate-900 dark:_text-slate-100',
              {
                h2: '_mt-10 _border-b _pb-1 _text-3xl _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400',
                h3: '_mt-8 _text-2xl',
                h4: '_mt-8 _text-xl',
                h5: '_mt-8 _text-lg',
                h6: '_mt-8 _text-base'
              }[Tag]
            )
      }
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          id={id}
          className="subheading-anchor"
          aria-label="Permalink for this section"
          ref={obRef}
        />
      )}
    </Tag>
  )
}

const findSummary = (children: ReactNode) => {
  let summary: ReactNode = null
  const restChildren: ReactNode[] = []

  Children.forEach(children, (child, index) => {
    if (child && (child as ReactElement).type === Summary) {
      summary ||= child
      return
    }

    let c = child
    if (
      !summary &&
      child &&
      typeof child === 'object' &&
      (child as ReactElement).type !== Details &&
      'props' in child &&
      child.props
    ) {
      const result = findSummary(child.props.children)
      summary = result[0]
      c = cloneElement(child, {
        ...child.props,
        children: result[1]?.length ? result[1] : undefined,
        key: index
      })
    }
    restChildren.push(c)
  })

  return [summary, restChildren]
}

const Details = ({
  children,
  open,
  ...props
}: ComponentProps<'details'>): ReactElement => {
  const [openState, setOpen] = useState(!!open)
  const [summary, restChildren] = findSummary(children)

  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(openState)
  useEffect(() => {
    if (openState) {
      setDelayedOpenState(true)
    } else {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500)
      return () => clearTimeout(timeout)
    }
  }, [openState])

  return (
    <details
      className="_my-4 _rounded _border _border-gray-200 _bg-white _p-2 _shadow-sm first:_mt-0 dark:_border-neutral-800 dark:_bg-neutral-900"
      {...props}
      open={delayedOpenState}
      {...(openState && { 'data-expanded': true })}
    >
      <DetailsProvider value={setOpen}>{summary}</DetailsProvider>
      <Collapse isOpen={openState}>{restChildren}</Collapse>
    </details>
  )
}

const Summary = (props: ComponentProps<'summary'>): ReactElement => {
  const setOpen = useDetails()
  return (
    <summary
      className={cn(
        '_flex _items-center _cursor-pointer _list-none _p-1 _transition-colors hover:_bg-gray-100 dark:hover:_bg-neutral-800',
        "before:_mr-1 before:_inline-block before:_transition-transform before:_content-[''] dark:before:_invert before:_shrink-0",
        'rtl:before:_rotate-180 [[data-expanded]>&]:before:_rotate-90'
      )}
      {...props}
      onClick={e => {
        e.preventDefault()
        setOpen(v => !v)
      }}
    />
  )
}

const EXTERNAL_HREF_REGEX = /https?:\/\//

export const Link = ({ href = '', className, ...props }: AnchorProps) => (
  <Anchor
    href={href}
    newWindow={EXTERNAL_HREF_REGEX.test(href)}
    className={cn(
      '_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]',
      className
    )}
    {...props}
  />
)

const A = ({ href = '', ...props }) => (
  <Anchor href={href} newWindow={EXTERNAL_HREF_REGEX.test(href)} {...props} />
)

export function getComponents({
  isRawLayout,
  components
}: {
  isRawLayout?: boolean
  components?: DocsThemeConfig['components']
}): Components {
  if (isRawLayout) {
    return { a: A }
  }

  const context = { index: 0 }
  return {
    h1: props => (
      <h1
        className="_mt-2 _text-4xl _font-bold _tracking-tight _text-slate-900 dark:_text-slate-100"
        {...props}
      />
    ),
    h2: props => <HeadingLink tag="h2" context={context} {...props} />,
    h3: props => <HeadingLink tag="h3" context={context} {...props} />,
    h4: props => <HeadingLink tag="h4" context={context} {...props} />,
    h5: props => <HeadingLink tag="h5" context={context} {...props} />,
    h6: props => <HeadingLink tag="h6" context={context} {...props} />,
    ul: props => (
      <ul
        className="_mt-6 _list-disc first:_mt-0 ltr:_ml-6 rtl:_mr-6"
        {...props}
      />
    ),
    ol: props => (
      <ol
        className="_mt-6 _list-decimal first:_mt-0 ltr:_ml-6 rtl:_mr-6"
        {...props}
      />
    ),
    li: props => <li className="_my-2" {...props} />,
    blockquote: props => (
      <blockquote
        className={cn(
          '_mt-6 _border-gray-300 _italic _text-gray-700 dark:_border-gray-700 dark:_text-gray-400',
          'first:_mt-0 ltr:_border-l-2 ltr:_pl-6 rtl:_border-r-2 rtl:_pr-6'
        )}
        {...props}
      />
    ),
    hr: props => (
      <hr
        className="nx-my-8 nx-border-neutral-200/70 contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400"
        {...props}
      />
    ),
    a: Link,
    table: props => (
      <Table
        className="nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0"
        {...props}
      />
    ),
    p: props => <p className="nx-mt-6 nx-leading-7 first:nx-mt-0" {...props} />,
    tr: Tr,
    th: Th,
    td: Td,
    details: Details,
    summary: Summary,
    pre: Pre,
    code: Code,
    ...components
  }
}
