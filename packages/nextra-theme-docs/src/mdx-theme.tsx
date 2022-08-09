import React, {
  useEffect,
  useRef,
  useState,
  cloneElement,
  Children,
  ReactNode,
  ReactElement
} from 'react'
import 'intersection-observer'
import { useSetActiveAnchor, DetailsProvider, useDetails } from './contexts'
import { MDXProvider } from '@mdx-js/react'
import { Collapse, Anchor } from './components'
import { IS_BROWSER } from './constants'

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
  }: {
    tag: any
    children: ReactNode
    id: string
  }): ReactElement {
    setActiveAnchor = useSetActiveAnchor()
    const obRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      if (!obRef.current) return

      slugs.set(obRef.current, [id, (context.index += 1)])
      if (obRef.current) observer.observe(obRef.current)

      return () => {
        observer.disconnect()
        slugs.delete(obRef.current!)
        setActiveAnchor(f => {
          const ret = { ...f }
          delete ret[id]
          return ret
        })
      }
    }, [])

    return (
      <Tag {...props}>
        <span className="subheading-anchor -mt-20" id={id} ref={obRef} />
        <a href={`#${id}`}>{children}</a>
      </Tag>
    )
  }

const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
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
}: {
  children: ReactNode
  open?: boolean
}): ReactElement => {
  const [openState, setOpen] = useState(!!open)
  const ref = useRef<HTMLDetailsElement>(null)
  const [summary, restChildren] = findSummary(children)

  return (
    <details {...props} ref={ref} open {...(openState && { 'data-open': '' })}>
      <DetailsProvider value={setOpen}>{summary}</DetailsProvider>
      <Collapse open={openState}>{restChildren}</Collapse>
    </details>
  )
}

const Summary = ({
  children,
  ...props
}: {
  children: ReactNode
}): ReactElement => {
  const setOpen = useDetails()
  return (
    <summary
      {...props}
      onClick={e => {
        e.preventDefault()
        setOpen(v => !v)
      }}
    >
      {children}
    </summary>
  )
}

export const getComponents = () => {
  const context = { index: 0 }
  return {
    h2: createHeaderLink('h2', context),
    h3: createHeaderLink('h3', context),
    h4: createHeaderLink('h4', context),
    h5: createHeaderLink('h5', context),
    h6: createHeaderLink('h6', context),
    a: ({ href = '', ...props }): ReactElement => (
      <Anchor href={href} newWindow={href.startsWith('https://')} {...props} />
    ),
    table: Table,
    details: Details,
    summary: Summary
  }
}

export const MDXTheme = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  return (
    <MDXProvider components={getComponents() as any}>{children}</MDXProvider>
  )
}
