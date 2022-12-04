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
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'

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
    const obRef = useRef<HTMLAnchorElement>(null)

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
          'nx-font-semibold nx-tracking-tight',
          {
            h2: 'nx-mt-10 nx-border-b nx-pb-1 nx-text-3xl contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400',
            h3: 'nx-mt-8 nx-text-2xl',
            h4: 'nx-mt-8 nx-text-xl',
            h5: 'nx-mt-8 nx-text-lg',
            h6: 'nx-mt-8 nx-text-base'
          }[Tag]
        )}
        {...props}
      >
        {children}
        <span className="nx-absolute -nx-mt-20" id={id} ref={obRef} />
        <a
          href={`#${id}`}
          className="subheading-anchor"
          aria-label="Permalink for this section"
        />
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
      className="nx-my-4 nx-rounded nx-border nx-border-gray-200 nx-bg-white nx-p-2 nx-shadow-sm first:nx-mt-0 dark:nx-border-neutral-800 dark:nx-bg-neutral-900"
      {...props}
      open={delayedOpenState}
      {...(openState && { 'data-expanded': true })}
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
        'nx-cursor-pointer nx-list-none nx-p-1 nx-transition-colors hover:nx-bg-gray-100 dark:hover:nx-bg-neutral-800',
        "before:nx-mr-1 before:nx-inline-block before:nx-transition-transform before:nx-content-[''] dark:before:nx-invert",
        'rtl:before:nx-rotate-180 [[data-expanded]>&]:before:nx-rotate-90'
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
      <h1
        className="nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight"
        {...props}
      />
    ),
    h2: createHeaderLink('h2', context),
    h3: createHeaderLink('h3', context),
    h4: createHeaderLink('h4', context),
    h5: createHeaderLink('h5', context),
    h6: createHeaderLink('h6', context),
    ul: (props: ComponentProps<'ul'>) => (
      <ul
        className="nx-mt-6 nx-list-disc first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6"
        {...props}
      />
    ),
    ol: (props: ComponentProps<'ol'>) => (
      <ol
        className="nx-mt-6 nx-list-decimal first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6"
        {...props}
      />
    ),
    li: (props: ComponentProps<'li'>) => <li className="nx-my-2" {...props} />,
    blockquote: (props: ComponentProps<'blockquote'>) => (
      <blockquote
        className={cn(
          'nx-mt-6 nx-border-gray-300 nx-italic nx-text-gray-700 dark:nx-border-gray-700 dark:nx-text-gray-400',
          'first:nx-mt-0 ltr:nx-border-l-2 ltr:nx-pl-6 rtl:nx-border-r-2 rtl:nx-pr-6'
        )}
        {...props}
      />
    ),
    hr: (props: ComponentProps<'hr'>) => (
      <hr className="nx-my-8 dark:nx-border-gray-900" {...props} />
    ),
    a: props => (
      <A
        {...props}
        className="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:under]"
      />
    ),
    table: (props: ComponentProps<'table'>) => (
      <Table
        className="nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0"
        {...props}
      />
    ),
    p: (props: ComponentProps<'p'>) => (
      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0" {...props} />
    ),
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
