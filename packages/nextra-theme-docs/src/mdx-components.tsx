import React, {
  useEffect,
  useRef,
  useState,
  cloneElement,
  Children,
  ReactNode,
  ReactElement,
  ComponentProps
} from 'react'
import 'intersection-observer'
import { useSetActiveAnchor, DetailsProvider, useDetails } from './contexts'
import { Collapse, Anchor } from './components'
import { IS_BROWSER } from './constants'
import cn from 'clsx'
import { DocsThemeConfig } from './types'

let observer: IntersectionObserver
let setActiveAnchor: ReturnType<typeof useSetActiveAnchor>
const slugs = new WeakMap()

if (IS_BROWSER) {
  observer ||= new IntersectionObserver(
    entries => {
      setActiveAnchor(f => {
        const ret = { ...f }

        for (const entry of entries) {
          if (entry?.rootBounds && slugs.has(entry.target)) {
            const [slug, index] = slugs.get(entry.target)
            const aboveHalfViewport =
              entry.boundingClientRect.y + entry.boundingClientRect.height <=
              entry.rootBounds.y + entry.rootBounds.height
            const insideHalfViewport = entry.intersectionRatio > 0
            ret[slug] = {
              index,
              aboveHalfViewport,
              insideHalfViewport
            }
          }
        }

        let activeSlug = ''
        let smallestIndexInViewport = Infinity
        let largestIndexAboveViewport = -1
        for (let s in ret) {
          ret[s].isActive = false
          if (
            ret[s].insideHalfViewport &&
            ret[s].index < smallestIndexInViewport
          ) {
            smallestIndexInViewport = ret[s].index
            activeSlug = s
          }
          if (
            smallestIndexInViewport === Infinity &&
            ret[s].aboveHalfViewport &&
            ret[s].index > largestIndexAboveViewport
          ) {
            largestIndexAboveViewport = ret[s].index
            activeSlug = s
          }
        }

        if (ret[activeSlug]) ret[activeSlug].isActive = true
        return ret
      })
    },
    {
      rootMargin: '0px 0px -50%',
      threshold: [0, 1]
    }
  )
}

// Anchor links
const createHeaderLink = (
  Tag: `h${2 | 3 | 4 | 5 | 6}`,
  context: { index: number }
) =>
  function HeaderLink({
    children,
    id,
    ...props
  }: ComponentProps<'h2'>): ReactElement {
    setActiveAnchor ??= useSetActiveAnchor()
    const obRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      const heading = obRef.current
      if (!heading) return

      slugs.set(heading, [id, (context.index += 1)])
      observer.observe(heading)

      return () => {
        observer.disconnect()
        slugs.delete(heading)
        setActiveAnchor(f => {
          const ret = { ...f }
          delete ret[id!]
          return ret
        })
      }
    }, [])

    return (
      <Tag
        className={cn(
          'font-semibold tracking-tight',
          {
            h2: 'mt-10 text-3xl border-b pb-1 dark:border-primary-100/10 contrast-more:border-neutral-400 contrast-more:dark:border-neutral-400',
            h3: 'mt-8 text-2xl',
            h4: 'mt-8 text-xl',
            h5: 'mt-8 text-lg',
            h6: 'mt-8 text-base'
          }[Tag]
        )}
        {...props}
      >
        <span className="subheading-anchor -mt-20" id={id} ref={obRef} />
        <a href={`#${id}`}>{children}</a>
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

  return (
    <details
      className="my-4 rounded border border-gray-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 first:mt-0 last:mb-0"
      {...props}
      {...(openState && { open: true })}
    >
      <DetailsProvider value={setOpen}>{summary}</DetailsProvider>
      <Collapse open={openState}>{restChildren}</Collapse>
    </details>
  )
}

const Summary = (props: ComponentProps<'summary'>): ReactElement => {
  const setOpen = useDetails()
  return (
    <summary
      className={cn(
        'list-none cursor-pointer rounded p-1 outline-none transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800',
        "before:content-[''] before:inline-block before:transition-transform dark:before:invert",
        '[[open]>&]:before:rotate-90 rtl:before:rotate-180'
      )}
      {...props}
      onClick={e => {
        e.preventDefault()
        setOpen(v => !v)
      }}
    />
  )
}

const A = ({ href = '', ...props }) => (
  <Anchor href={href} newWindow={href.startsWith('https://')} {...props} />
)

export const getComponents = ({
  isRawLayout,
  components
}: {
  isRawLayout?: boolean
  components?: DocsThemeConfig['components']
}): DocsThemeConfig['components'] => {
  if (isRawLayout) {
    return { a: A }
  }

  const context = { index: 0 }
  return {
    h1: (props: ComponentProps<'h1'>) => (
      <h1 className="mt-2 text-4xl font-bold tracking-tight" {...props} />
    ),
    h2: createHeaderLink('h2', context),
    h3: createHeaderLink('h3', context),
    h4: createHeaderLink('h4', context),
    h5: createHeaderLink('h5', context),
    h6: createHeaderLink('h6', context),
    ul: (props: ComponentProps<'ul'>) => (
      <ul className="ltr:ml-6 rtl:mr-6 mt-6 list-disc first:mt-0" {...props} />
    ),
    ol: (props: ComponentProps<'ol'>) => (
      <ol className="ltr:ml-6 rtl:mr-6 mt-6 list-decimal" {...props} />
    ),
    li: (props: ComponentProps<'li'>) => <li className="my-2" {...props} />,
    blockquote: (props: ComponentProps<'blockquote'>) => (
      <blockquote
        className={cn(
          'mt-6 first:mt-0 border-gray-300 italic text-gray-700 dark:border-gray-700 dark:text-gray-400',
          'rtl:border-r-2 rtl:pr-6 ltr:border-l-2 ltr:pl-6'
        )}
        {...props}
      />
    ),
    hr: (props: ComponentProps<'hr'>) => (
      <hr className="my-8 dark:border-gray-900" {...props} />
    ),
    a: props => (
      <A
        {...props}
        className="ring-primary-500/30 focus:outline-none focus-visible:ring text-primary-500 underline decoration-from-font [text-underline-position:under]"
      />
    ),
    table: (props: ComponentProps<'table'>) => (
      <table className="mt-6 first:mt-0 p-0" {...props} />
    ),
    p: (props: ComponentProps<'p'>) => (
      <p className="mt-6 first:mt-0 leading-7" {...props} />
    ),
    tr: (props: ComponentProps<'tr'>) => (
      <tr
        className={cn(
          'm-0 border-t border-gray-300 p-0 dark:border-gray-600',
          'even:bg-gray-100 even:dark:bg-gray-600/20'
        )}
        {...props}
      />
    ),
    th: (props: ComponentProps<'th'>) => (
      <th
        className="m-0 border border-gray-300 px-4 py-2 dark:border-gray-600 font-semibold"
        {...props}
      />
    ),
    td: (props: ComponentProps<'td'>) => (
      <td
        className="m-0 border border-gray-300 px-4 py-2 dark:border-gray-600"
        {...props}
      />
    ),
    code: (props: ComponentProps<'code'>) => (
      // always show code blocks in ltr
      <code dir="ltr" {...props} />
    ),
    details: Details,
    summary: Summary,
    ...components
  }
}
