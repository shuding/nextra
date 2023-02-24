import type { RefObject, ComponentProps, ReactElement, ReactNode } from 'react'
import {
  createRef,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { MDXProvider } from 'nextra/mdx'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import { useBlogContext } from './blog-context'
import type { Components } from 'nextra/mdx'

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
  ...props
}: ComponentProps<'h2'> & { tag: `h${2 | 3 | 4 | 5 | 6}` }): ReactElement {
  return (
    <Tag className={`subheading-${Tag}`} {...props}>
      {children}
      <span className="nx-absolute -nx-mt-7" id={id} />
      <a
        href={id && `#${id}`}
        className="subheading-anchor"
        aria-label="Permalink for this section"
      />
    </Tag>
  )
}

const A = ({ children, ...props }: ComponentProps<'a'>) => {
  const isExternal =
    props.href?.startsWith('https://') || props.href?.startsWith('http://')
  if (isExternal) {
    return (
      <a target="_blank" rel="noreferrer" {...props}>
        {children}
        <span className="nx-sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return props.href ? (
    <Link href={props.href} passHref legacyBehavior>
      <a {...props}>{children}</a>
    </Link>
  ) : null
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
