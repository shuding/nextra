import slugify from '@sindresorhus/slugify'
import cn from 'clsx'
import Link from 'next/link'
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
      <thead className="hidden border-b border-gray-200 text-left lg:table-header-group">
        <tr className="[&>th]:p-1.5">
          <th>Name</th>
          <th>Type</th>
          {showDefaultColumn && <th>Default</th>}
        </tr>
      </thead>
      {data.map(prop => {
        const slug = slugify(prop.name)
        const isHeading = !prop.type && !prop.description && !prop.default

        return (
          <tbody
            key={slug}
            id={slug}
            className="group mb-5 rounded-xl border border-gray-200 bg-gray-100 hover:bg-gray-50 max-lg:block lg:border-none lg:bg-transparent max-lg:[&>tr]:block"
          >
            <tr className="border-b border-gray-200 [&>td]:p-3 max-lg:[&>td]:block">
              <td className="lg:!pl-0">
                <div className="relative">
                  <a
                    href={`#${slug}`}
                    className="absolute right-0 flex items-center text-lg font-black group-hover:opacity-100 lg:top-1/2 lg:right-auto lg:left-0 lg:w-[25px] lg:-translate-x-[22px] lg:-translate-y-1/2 lg:opacity-0"
                  >
                    #
                  </a>
                  {prop.name &&
                    (isHeading ? (
                      <span className="px-1.5 py-0.5 font-bold">
                        {prop.name}
                      </span>
                    ) : (
                      <>
                        <code className="rounded-sm border border-gray-200 bg-gray-50 px-1.5 py-0.5">
                          {prop.name}
                        </code>
                        {prop.optional && (
                          <span className="ml-1 text-gray-500">(optional)</span>
                        )}
                      </>
                    ))}
                </div>
              </td>
              <td>
                <div>
                  <code className="break-all">{linkify(prop.type)}</code>
                </div>
                {prop.description && (
                  <div className="mt-2 max-w-md">{prop.description}</div>
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
                    '!px-0',
                    !prop.default && '!hidden lg:table-cell'
                  )}
                >
                  <pre className="inline-block rounded-sm border border-gray-200 bg-gray-50 !px-1.5 py-0.5">
                    <code className="text-xs">{linkify(prop.default)}</code>
                  </pre>
                </td>
              )}
            </tr>
          </tbody>
        )
      })}
    </table>
  )
}
