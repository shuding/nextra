import Slugger from 'github-slugger'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import innerText from 'react-innertext'
import 'intersection-observer'

import { ActiveAnchor, useActiveAnchorSet } from './active-anchor'
import { MDXProvider } from '@mdx-js/react'

const ob: Record<string, IntersectionObserver> = {}
const obCallback: Record<string, ((e: IntersectionObserverEntry[]) => void)[]> =
  {}
const createOrGetObserver = (rootMargin: string) => {
  // Only create 1 instance for performance reasons
  if (!ob[rootMargin]) {
    obCallback[rootMargin] = []
    ob[rootMargin] = new IntersectionObserver(
      e => {
        obCallback[rootMargin].forEach(cb => cb(e))
      },
      {
        rootMargin,
        threshold: [0, 1]
      }
    )
  }
  return ob[rootMargin]
}

function useIntersect(
  margin: string,
  ref: React.RefObject<HTMLSpanElement>,
  cb: (e: IntersectionObserverEntry) => void
) {
  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      let e
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].target === ref.current) {
          e = entries[i]
          break
        }
      }
      if (e) cb(e)
    }

    const observer = createOrGetObserver(margin)
    obCallback[margin].push(callback)
    if (ref.current) observer.observe(ref.current)

    return () => {
      const idx = obCallback[margin].indexOf(callback)
      if (idx >= 0) obCallback[margin].splice(idx, 1)
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])
}

// Anchor links
const HeaderLink = ({
  tag: Tag,
  children,
  slugger,
  withObserver = true,
  ...props
}: {
  tag: any
  children: any
  slugger: Slugger
  withObserver?: boolean
}) => {
  const setActiveAnchor = useActiveAnchorSet()
  const obRef = useRef<HTMLSpanElement>(null)

  const slug = slugger.slug(innerText(children))
  const anchor = <span className="subheading-anchor" id={slug} ref={obRef} />

  // We are pretty sure that this header link component will not be rerendered
  // separately, so we attach a mutable index property to slugger.
  // @ts-expect-error
  const index = slugger.index++

  useIntersect('0px 0px -50%', obRef, e => {
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
  })

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
}

const H2 =
  ({ slugger }: { slugger: Slugger }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h2" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H3 =
  ({ slugger }: { slugger: Slugger }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h3" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H4 =
  ({ slugger }: { slugger: Slugger }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h4" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H5 =
  ({ slugger }: { slugger: Slugger }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h5" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    )
  }

const H6 =
  ({ slugger }: { slugger: Slugger }) =>
  ({ children, ...props }: HeadingProps) => {
    return (
      <HeaderLink tag="h6" slugger={slugger} {...props}>
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

const getComponents = (args: { slugger: Slugger }) => ({
  h2: H2(args),
  h3: H3(args),
  h4: H4(args),
  h5: H5(args),
  h6: H6(args),
  a: A,
  table: Table
})

export const MDXTheme: React.FC<{}> = ({ children }) => {
  const slugger = new Slugger()
  // @ts-expect-error
  slugger.index = 0
  return (
    <MDXProvider components={getComponents({ slugger })}>
      {children}
    </MDXProvider>
  )
}
