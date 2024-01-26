import Link from 'next/link'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import type { UseMDXComponents } from 'nextra/mdx'
import type { ComponentProps, ReactElement } from 'react'

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
        className === 'sr-only' ? '_sr-only' : `_not-prose subheading-${Tag}`
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
      </a>
    )
  }
  return (
    // @ts-expect-error Types of property `ref` are incompatible.
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export const useMDXComponents: UseMDXComponents = components => ({
  h2: props => <HeadingLink tag="h2" {...props} />,
  h3: props => <HeadingLink tag="h3" {...props} />,
  h4: props => <HeadingLink tag="h4" {...props} />,
  h5: props => <HeadingLink tag="h5" {...props} />,
  h6: props => <HeadingLink tag="h6" {...props} />,
  a: A,
  pre: ({ children, ...props }) => (
    <div className="_not-prose">
      <Pre {...props}>{children}</Pre>
    </div>
  ),
  tr: Tr,
  th: Th,
  td: Td,
  table: props => <Table className="_not-prose" {...props} />,
  code: Code,
  ...components
})
