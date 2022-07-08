import Link from 'next/link'
import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useContext,
  ReactElement
} from 'react'
import 'intersection-observer'
import { ActiveAnchor, useActiveAnchorSet } from './active-anchor'
import { MDXProvider } from '@mdx-js/react'
import Collapse from '../components/collapse'
import { Tabs, Tab } from '../components/tabs'
import Bleed from '../bleed'
import Callout from '../callout'

let observer: IntersectionObserver
let setActiveAnchor: (
  value: ActiveAnchor | ((prevState: ActiveAnchor) => ActiveAnchor)
) => void
const slugs = new WeakMap()

if (typeof window !== 'undefined') {
  observer =
    observer! ||
    new IntersectionObserver(
      entries => {
        const headers: [string, number, boolean, boolean][] = []

        for (const entry of entries) {
          if (entry?.rootBounds && slugs.has(entry.target)) {
            const [slug, index] = slugs.get(entry.target)
            const aboveHalfViewport =
              entry.boundingClientRect.y + entry.boundingClientRect.height <=
              entry.rootBounds.y + entry.rootBounds.height
            const insideHalfViewport = entry.intersectionRatio > 0

            headers.push([slug, index, aboveHalfViewport, insideHalfViewport])
          }
        }

        setActiveAnchor(f => {
          const ret: ActiveAnchor = { ...f }

          for (const header of headers) {
            ret[header[0]] = {
              index: header[1],
              aboveHalfViewport: header[2],
              insideHalfViewport: header[3]
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
const createHeaderLink = (Tag: `h${2 | 3 | 4 | 5 | 6}`, context: { index: number }) => function HeaderLink({
  children,
  id,
  ...props
}: {
  tag: any
  children: ReactNode
  id: string
}): ReactElement {
  setActiveAnchor = useActiveAnchorSet()
  const obRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!obRef.current) return

    slugs.set(obRef.current, [id, context.index += 1])
    if (obRef.current) observer.observe(obRef.current)

    return () => {
      observer.disconnect()
      slugs.delete(obRef.current!)
      setActiveAnchor(f => {
        const ret: ActiveAnchor = { ...f }
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

const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
  )
}

const DetailsContext = React.createContext<any>(() => {})

const findSummary = (children: ReactNode) => {
  let summary: ReactNode = null
  let restChildren: ReactNode[] = []

  React.Children.forEach(children, (child, index) => {
    if (child && (child as ReactElement).type === Summary) {
      summary = summary || child
      return
    }

    let c = child
    if (
      !summary &&
      typeof child === 'object' &&
      child &&
      (child as ReactElement).type !== Details &&
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
      <DetailsContext.Provider value={setOpen}>
        {summary}
      </DetailsContext.Provider>
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

export const getComponents = (context: { index: number } = { index: 0 }) => ({
  h2: createHeaderLink('h2', context),
  h3: createHeaderLink('h3', context),
  h4: createHeaderLink('h4', context),
  h5: createHeaderLink('h5', context),
  h6: createHeaderLink('h6', context),
  a: A,
  table: Table,
  details: Details,
  summary: Summary,
  Nextra: {
    Bleed,
    Callout,
    Tabs,
    Tab,
    Collapse
  }
})

export const MDXTheme = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  return (
    <MDXProvider components={getComponents() as any}>
      {children}
    </MDXProvider>
  )
}
