import Link from 'next/link'
import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useContext
} from 'react'
import 'intersection-observer'

import { ActiveAnchor, useActiveAnchorSet } from './active-anchor'
import { MDXProvider } from '@mdx-js/react'
import Collapse from '../collapse'

// Anchor links
const HeaderLink = ({
  tag: Tag,
  children,
  context,
  id,
  withObserver = true,
  ...props
}: {
  tag: any
  children: any
  context: { index: number }
  id: string
  withObserver?: boolean
}) => {
  const setActiveAnchor = useActiveAnchorSet()
  const obRef = useRef<HTMLSpanElement>(null)

  const slug = id
  const anchor = <span className="subheading-anchor" id={slug} ref={obRef} />

  // We are pretty sure that this header link component will not be rerendered
  // separately, so we mutable this index property.
  const index = context.index++

  useEffect(() => {
    const ref = obRef
    const callback = (entries: IntersectionObserverEntry[]) => {
      let e
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].target === ref.current) {
          e = entries[i]
          break
        }
      }
      if (e) {
        const aboveHalfViewport =
          e.boundingClientRect.y + e.boundingClientRect.height <=
          // FIXME:
          // @ts-expect-error
          e.rootBounds.y + e.rootBounds.height
        const insideHalfViewport = e.intersectionRatio > 0

        setActiveAnchor(f => {
          const ret: ActiveAnchor = {
            ...f,
            [slug]: {
              index,
              aboveHalfViewport,
              insideHalfViewport
            }
          }

          let activeSlug = ''
          let smallestIndexInViewport = Infinity
          let largestIndexAboveViewport = -1
          for (let s in f) {
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
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -50%',
      threshold: [0, 1]
    })
    if (ref.current) observer.observe(ref.current)

    return () => {
      observer.disconnect()
      setActiveAnchor(f => {
        const ret: ActiveAnchor = { ...f }
        delete ret[slug]
        return ret
      })
    }
  }, [])

  // useEffect(() => {
  //   ;() => {
  //     setActiveAnchor(f => {
  //       const ret: ActiveAnchor = { ...f }
  //       delete ret[slug]
  //       return ret
  //     })
  //   }
  // }, [])

  return (
    <Tag {...props}>
      {anchor}
      <a href={'#' + slug} className="text-current no-underline no-outline">
        {children}
        <span className="anchor-icon" aria-hidden>
          #
        </span>
      </a>
    </Tag>
  )
}

interface HeadingProps {
  children?: React.ReactNode
  href?: string
  id: string
}

const H2 =
  (context: { index: number }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h2" context={context} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H3 =
  (context: { index: number }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h3" context={context} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H4 =
  (context: { index: number }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h4" context={context} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H5 =
  (context: { index: number }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h5" context={context} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H6 =
  (context: { index: number }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h6" context={context} {...props}>
        {children}
      </HeaderLink>
    )
  }

const A = ({
  children,
  ...props
}: {
  children?: React.ReactNode
  href?: string
}) => {
  const isExternal = props.href && props.href.startsWith('https://')
  if (isExternal) {
    return (
      <a target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  }
  return props.href ? (
    <Link href={props.href}>
      <a {...props}>{children}</a>
    </Link>
  ) : (
    <></>
  )
}

const Table = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
  )
}

const DetailsContext = React.createContext<any>(() => {})

const findSummary = (children: React.ReactNode) => {
  let summary: React.ReactNode = null
  let restChildren: ReactNode[] = []

  React.Children.forEach(children, (child, index) => {
    if (child && (child as React.ReactElement).type === Summary) {
      summary = summary || child
    } else {
      let c = child
      if (
        !summary &&
        typeof child === 'object' &&
        child &&
        (child as React.ReactElement).type !== Details &&
        'props' in child &&
        child.props
      ) {
        const result = findSummary(child.props.children)
        summary = summary || result[0]
        c = React.cloneElement(child, {
          ...child.props,
          children: result[1]?.length ? result[1] : undefined,
          key: index
        })
      }
      restChildren.push(c)
    }
  })

  return [summary, restChildren]
}

const Details = ({
  children,
  open,
  ...props
}: {
  children?: React.ReactNode
  open?: boolean
}) => {
  const [openState, setOpen] = useState(!!open)
  const ref = useRef<HTMLDetailsElement>(null)
  const [summary, restChildren] = findSummary(children)

  return (
    <details
      {...props}
      ref={ref}
      open
      {...(openState ? { 'data-open': '' } : null)}
    >
      <DetailsContext.Provider value={setOpen}>
        {summary}
      </DetailsContext.Provider>
      <Collapse open={openState}>{restChildren}</Collapse>
    </details>
  )
}

const Summary = ({ children, ...props }: { children?: React.ReactNode }) => {
  const setOpen = useContext(DetailsContext)
  return (
    <summary
      {...props}
      onClick={e => {
        e.preventDefault()
        setOpen((v: boolean) => !v)
      }}
    >
      {children}
    </summary>
  )
}

const getComponents = (context: { index: number }) => ({
  h2: H2(context),
  h3: H3(context),
  h4: H4(context),
  h5: H5(context),
  h6: H6(context),
  a: A,
  table: Table,
  details: Details,
  summary: Summary
})

export const MDXTheme: React.FC<{}> = ({ children }) => {
  return (
    <MDXProvider components={getComponents({ index: 0 }) as any}>
      {children}
    </MDXProvider>
  )
}
