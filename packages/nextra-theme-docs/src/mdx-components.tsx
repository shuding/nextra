import cn from 'clsx'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import { ArrowRightIcon } from 'nextra/icons'
import type { Components } from 'nextra/mdx'
import type { ComponentProps, ReactElement } from 'react'
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Anchor, Collapse } from './components'
import type { AnchorProps } from './components/anchor'
import type { DocsThemeConfig } from './constants'
import { useSetActiveAnchor } from './contexts'
import { useIntersectionObserver, useSlugs } from './contexts/active-anchor'

// Anchor links
const createHeading = (
  Tag: `h${2 | 3 | 4 | 5 | 6}`,
  context: { index: number }
) =>
  function Heading({
    children,
    id,
    className,
    ...props
  }: ComponentProps<'h2'>): ReactElement {
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
    }, [id, slugs, observer, setActiveAnchor])

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

function Details({
  children,
  open,
  ...props
}: ComponentProps<'details'>): ReactElement {
  const [openState, setOpen] = useState(!!open)
  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(openState)

  useEffect(() => {
    if (!openState) {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500)
      return () => clearTimeout(timeout)
    }
    setDelayedOpenState(true)
  }, [openState])

  const [summary, restChildren] = useMemo(() => {
    let summary: ReactElement | undefined
    const restChildren = Children.map(children, child => {
      const isSummary =
        child &&
        typeof child === 'object' &&
        'type' in child &&
        child.type === Summary

      if (!isSummary) return child

      summary ||= cloneElement(child, {
        onClick(event: MouseEvent) {
          event.preventDefault()
          setOpen(v => !v)
        }
      })
    })
    return [summary, restChildren]
  }, [children])

  return (
    <details
      className="_my-4 _rounded _border _border-gray-200 _bg-white _p-2 _shadow-sm first:_mt-0 dark:_border-neutral-800 dark:_bg-neutral-900"
      {...props}
      open={delayedOpenState}
      data-expanded={openState ? '' : undefined}
    >
      {summary}
      <Collapse isOpen={openState}>{restChildren}</Collapse>
    </details>
  )
}

function Summary({
  children,
  ...props
}: ComponentProps<'summary'>): ReactElement {
  return (
    <summary
      className="_flex _items-center _cursor-pointer _p-1 _transition-colors hover:_bg-gray-100 dark:hover:_bg-neutral-800"
      {...props}
    >
      {children}
      <ArrowRightIcon
        className={cn(
          '_order-first', // if prettier formats `summary` it will have unexpected margin-top
          '_w-4 _h-4 _shrink-0 _mx-1.5',
          'rtl:_rotate-180 [[data-expanded]>summary>&]:_rotate-90 _transition'
        )}
        pathClassName="_stroke-[3px]"
      />
    </summary>
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
    h2: createHeading('h2', context),
    h3: createHeading('h3', context),
    h4: createHeading('h4', context),
    h5: createHeading('h5', context),
    h6: createHeading('h6', context),
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
        className="_my-8 _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400"
        {...props}
      />
    ),
    a: Link,
    table: props => (
      <Table className="nextra-scrollbar _mt-6 _p-0 first:_mt-0" {...props} />
    ),
    p: props => <p className="_mt-6 _leading-7 first:_mt-0" {...props} />,
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
