import Link from 'next/link'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import type { MDXComponents } from 'nextra/mdx'
import type { ComponentProps, ReactElement, ReactNode, RefObject } from 'react'
import {
  createContext,
  createRef,
  useContext,
  useEffect,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import { useBlogContext } from './blog-context'

export const HeadingContext =
  createContext<RefObject<HTMLHeadingElement | null>>(createRef())

const H1 = ({ children }: { children?: ReactNode }): ReactElement => {
  const ref = useContext(HeadingContext)
  const { opts } = useBlogContext()
  const [showHeading, setShowHeading] = useState(false)
  useEffect(() => {
    if (ref.current && opts.hasJsxInH1) {
      setShowHeading(true)
    }
  }, [opts.hasJsxInH1, ref])
  return <>{showHeading && createPortal(children, ref.current!)}</>
}

function HeadingLink({
  tag: Tag,
  children,
  id,
  className,
  ...props
}: ComponentProps<'h2'> & { tag: `h${2 | 3 | 4 | 5 | 6}` }): ReactElement {
  return (
    <Tag
      id={id}
      className={
        // can be added by footnotes
        className === 'sr-only' ? '_sr-only' : `subheading-${Tag}`
      }
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="_not-prose subheading-anchor"
          aria-label="Permalink for this section"
        />
      )}
    </Tag>
  )
}

const EXTERNAL_HREF_REGEX = /https?:\/\//

const A = ({ children, href = '', ...props }: ComponentProps<'a'>) => {
  if (EXTERNAL_HREF_REGEX.test(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  }
  const ComponentToUse = href.startsWith('#') ? 'a' : Link
  return (
    <ComponentToUse href={href} {...props}>
      {children}
    </ComponentToUse>
  )
}

export const components: MDXComponents = {
  h1: H1,
  h2: props => <HeadingLink tag="h2" {...props} />,
  h3: props => <HeadingLink tag="h3" {...props} />,
  h4: props => <HeadingLink tag="h4" {...props} />,
  h5: props => <HeadingLink tag="h5" {...props} />,
  h6: props => <HeadingLink tag="h6" {...props} />,
  a: A,
  pre: ({ children, ...props }) => (
    <Pre className="_not-prose" {...props}>
      {children}
    </Pre>
  ),
  tr: Tr,
  th: Th,
  td: Td,
  table: props => <Table className="_not-prose" {...props} />,
  code: Code
}
