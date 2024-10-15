import {
  Callout,
  Code,
  Details,
  Pre,
  Summary,
  Table,
  Td,
  Th,
  Tr,
  withGitHubAlert,
  withIcons
} from 'nextra/components'
import { useMDXComponents as useNextraMDXComponents } from 'nextra/mdx'
import type { MDXComponents } from 'nextra/mdx'
import type { ComponentProps, FC } from 'react'
import { Meta } from './components/meta'
import { isValidDate } from './is-valid-date'
import type { BlogMetadata } from './types'

const createHeading = (Tag: `h${2 | 3 | 4 | 5 | 6}`) =>
  function HeadingLink({
    children,
    id,
    className,
    ...props
  }: ComponentProps<typeof Tag>) {
    return (
      <Tag
        id={id}
        // can be added by footnotes
        className={className === 'sr-only' ? '_sr-only' : ''}
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
const Blockquote = withGitHubAlert(({ type, ...props }) => {
  const calloutType = (
    {
      caution: 'error',
      important: 'error', // TODO
      note: 'info',
      tip: 'default',
      warning: 'warning'
    } as const
  )[type]

  return <Callout type={calloutType} {...props} />
})

type BlogMDXComponents = MDXComponents & {
  DateFormatter?: FC<{ date: Date }>
}

/* eslint sort-keys: error */
export const useMDXComponents: typeof useNextraMDXComponents = (
  components: BlogMDXComponents = {}
) =>
  useNextraMDXComponents({
    // @ts-expect-error -- fixme
    blockquote: Blockquote,
    code: Code,
    details: Details,
    h2: createHeading('h2'),
    h3: createHeading('h3'),
    h4: createHeading('h4'),
    h5: createHeading('h5'),
    h6: createHeading('h6'),
    pre: withIcons(Pre),
    summary: Summary,
    table: Table,
    td: Td,
    th: Th,
    tr: Tr,
    wrapper({ children, metadata, title }) {
      const date = (metadata as any).date as string
      if (date && !isValidDate(date)) {
        throw new Error(
          `Invalid date "${date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
        )
      }
      const dateObj = date && new Date(date)
      const { DateFormatter } = components

      return (
        <>
          <h1>{title}</h1>
          <Meta {...(metadata as BlogMetadata)}>
            {dateObj && (
              <time dateTime={dateObj.toISOString()}>
                {(DateFormatter && <DateFormatter date={dateObj} />) ||
                  dateObj.toLocaleDateString()}
              </time>
            )}
          </Meta>
          {children}
        </>
      )
    },
    ...components
  })
