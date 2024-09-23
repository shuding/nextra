import { Link } from 'next-view-transitions'
import {
  Code,
  Details,
  Pre,
  Summary,
  Table,
  Td,
  Th,
  Tr,
  withIcons
} from 'nextra/components'
import type { UseMDXComponents } from 'nextra/mdx'
import { DEFAULT_COMPONENTS } from 'nextra/mdx'
import type { ComponentProps, FC } from 'react'
import { Meta } from './components/meta'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?(:\d{2}\.\d{3}Z)?$/
const DATE_REGEX_WITH_SLASH = /^\d{4}\/\d{1,2}\/\d{1,2}( \d{1,2}:\d{1,2})?$/

export const isValidDate = (date: string): boolean =>
  DATE_REGEX.test(date) || DATE_REGEX_WITH_SLASH.test(date)

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

const EXTERNAL_HREF_REGEX = /^https?:\/\//

/* eslint sort-keys: error */
export const useMDXComponents: UseMDXComponents = components => ({
  ...DEFAULT_COMPONENTS,
  a({ href = '', ...props }) {
    if (EXTERNAL_HREF_REGEX.test(href)) {
      return <a href={href} target="_blank" rel="noreferrer" {...props} />
    }
    return <Link href={href} {...props} />
  },
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
    if (metadata.date && !isValidDate(metadata.date)) {
      throw new Error(
        `Invalid date "${metadata.date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
      )
    }
    const dateObj = metadata.date && new Date(metadata.date)

    // @ts-expect-error
    const DateFormatter = components?.DateFormatter

    return (
      <>
        <h1>{title}</h1>
        <Meta {...metadata}>
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
