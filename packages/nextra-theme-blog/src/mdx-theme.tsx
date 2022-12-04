import React, {
  RefObject,
  createRef,
  ComponentProps,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { MDXProvider } from '@mdx-js/react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
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
  }, [])
  return <>{showHeading && createPortal(children, ref.current!)}</>
}

const createHeaderLink =
  (Tag: `h${2 | 3 | 4 | 5 | 6}`) =>
  ({ children, id, ...props }: ComponentProps<'h2'>): ReactElement => {
    return (
      <Tag className={`subheading-${Tag}`} {...props}>
        {children}
        <span className="nx-absolute -nx-mt-7" id={id} />
        <a
          href={`#${id}`}
          className="subheading-anchor"
          aria-label="Permalink for this section"
        />
      </Tag>
    )
  }

const A = ({ children, ...props }: ComponentProps<'a'>) => {
  const isExternal = props.href?.startsWith('https://')
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
  ) : (
    <></>
  )
}

const components = {
  h1: H1,
  h2: createHeaderLink('h2'),
  h3: createHeaderLink('h3'),
  h4: createHeaderLink('h4'),
  h5: createHeaderLink('h5'),
  h6: createHeaderLink('h6'),
  a: A,
  pre: ({ children, ...props }: ComponentProps<'pre'>) => (
    <div className="nx-not-prose">
      <Pre {...props}>{children}</Pre>
    </div>
  ),
  tr: Tr,
  th: Th,
  td: Td,
  table: (props: ComponentProps<'table'>) => (
    <Table className="nx-not-prose" {...props} />
  ),
  code: Code
}

export const MDXTheme = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
