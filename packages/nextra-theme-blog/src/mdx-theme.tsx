import Link from 'next/link'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import { MDXProvider } from 'nextra/mdx'
import type { Components } from 'nextra/mdx'
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

export const HeadingContext = createContext<
  RefObject<HTMLHeadingElement | null>
>(createRef())

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
      className={
        // can be added by footnotes
        className === 'sr-only'
          ? 'nx-sr-only'
          : `nx-not-prose subheading-${Tag}`
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
        <span className="nx-sr-only nx-select-none"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} passHref legacyBehavior>
      <a {...props}>{children}</a>
    </Link>
  )
}

const useComponents = (): Components => {
  const { config } = useBlogContext()
  return {
    h1: H1,
    h2: props => <HeadingLink tag="h2" {...props} />,
    h3: props => <HeadingLink tag="h3" {...props} />,
    h4: props => <HeadingLink tag="h4" {...props} />,
    h5: props => <HeadingLink tag="h5" {...props} />,
    h6: props => <HeadingLink tag="h6" {...props} />,
    a: A,
    pre: ({ children, ...props }) => (
      <div className="nx-not-prose">
        <Pre {...props}>{children}</Pre>
      </div>
    ),
    tr: Tr,
    th: Th,
    td: Td,
    table: props => <Table className="nx-not-prose" {...props} />,
    code: Code,
    ...config.components
  }
}

export const MDXTheme = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  return <MDXProvider components={useComponents()}>{children}</MDXProvider>
}
