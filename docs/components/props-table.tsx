import slugify from '@sindresorhus/slugify'
import cn from 'clsx'
import Link from 'next/link'
import { Code } from 'nextra/components'
import type { FC } from 'react'

type PropsTableProps = {
  props: {
    name: string
    type?: string
    default?: string
    description?: string
    example?: string
    optional?: boolean
  }[]
  links?: Record<string, string>
  info?: Record<string, string>
  deeplinkPrefix?: string
}

export const PropsTable: FC<PropsTableProps> = ({
  props: data,
  links = {}
}) => {
  // We can hide the default column entirely if none of the props have a default
  // value to document.
  const showDefaultColumn = data.some(prop => prop.default)

  // This function takes a string representing some type and attempts to turn any
  // types referenced inside into links, either internal or external.
  const linkify = (type?: string) =>
    type?.match(/(\w+|\W+)/g)?.map((chunk, i) =>
      chunk in links ? (
        <Link
          key={`${chunk}-${i}`}
          href={links[chunk] ?? ''}
          className="text-primary-600"
        >
          {chunk}
        </Link>
      ) : (
        chunk
      )
    )

  return (
    <table className="my-8 w-full text-sm">
      <thead className="nextra-border border-b text-left max-lg:hidden">
        <tr>
          <th className="py-1.5">Name</th>
          <th className="p-1.5 px-3">Type</th>
          {showDefaultColumn && <th className="py-1.5">Default</th>}
        </tr>
      </thead>
      {data.map(prop => {
        const slug = slugify(prop.name)
        const isHeading = !prop.type && !prop.description && !prop.default

        return (
          <tbody
            key={slug}
            className="nextra-border x:hover:bg-gray-100 x:dark:hover:bg-primary-100/5 group mb-5 rounded-xl max-lg:block max-lg:border"
          >
            <tr
              className="nextra-border lg:not-target:[&>td>a]:opacity-0 max-lg:block lg:border-b"
              id={slug}
            >
              <td className="relative py-3 max-lg:block max-lg:px-3">
                <a
                  href={`#${slug}`}
                  className={cn(
                    'absolute right-0 top-0 text-lg font-black lg:right-full lg:top-1/2 lg:-translate-y-1/2',
                    'group-hover:opacity-100! before:content-["#"] hover:text-black dark:hover:text-white',
                    'p-3' // Increase hit box
                  )}
                />
                {prop.name &&
                  (isHeading ? (
                    <span className="px-1.5 py-0.5 font-bold">{prop.name}</span>
                  ) : (
                    <>
                      <Code>{prop.name}</Code>
                      {prop.optional && (
                        <span className="ml-1 text-gray-500">(optional)</span>
                      )}
                    </>
                  ))}
              </td>
              <td className='p-3 max-lg:block max-lg:before:content-["Type:_"]'>
                <Code>{linkify(prop.type)}</Code>
                {prop.description && (
                  <div className="mt-2 max-w-md text-sm">
                    {prop.description}
                  </div>
                )}
                {prop.example && (
                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50">
                    <pre>
                      <code>{prop.example}</code>
                    </pre>
                  </div>
                )}
              </td>
              {showDefaultColumn && (
                // For the mobile view, we want to hide the default column entirely
                // if there is no content for it. We want this because otherwise
                // the default padding applied to table cells will add some extra
                // blank space we don't want.
                <td
                  className={cn(
                    'max-lg:block',
                    prop.default &&
                      'py-3 max-lg:px-3 max-lg:before:content-["Default:_"]'
                  )}
                >
                  {prop.default && <Code>{linkify(prop.default)}</Code>}
                </td>
              )}
            </tr>
          </tbody>
        )
      })}
    </table>
  )
}
