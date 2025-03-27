import slugify from '@sindresorhus/slugify'
import cn from 'clsx'
import { Link } from 'nextra-theme-docs'
import { Code } from 'nextra/components'
import type { FC, ReactNode } from 'react'

interface ObjectType {
  /**
   * Additional description of the field
   */
  description: ReactNode
  type: string
  typeDescription: ReactNode
  /**
   * Optional link to the type
   */
  typeDescriptionLink?: string
  default?: string
  required?: boolean
}

export const PropsTable: FC<{
  type: Record<string, ObjectType>
  typeLinkMap: Record<string, string>
}> = ({ type, typeLinkMap }) => {
  // We can hide the default column entirely if none of the props have a default
  // value to document.
  const showDefaultColumn = true as any // data.some(prop => prop.default)

  // This function takes a string representing some type and attempts to turn any
  // types referenced inside into links, either internal or external.
  const linkify = (type: string) => {
    const [rootType, ...rest] = type.split('.')
    if (rest.length) rest.unshift('')
    const href = typeLinkMap[rootType!]
    return (
      <Code>
        {href ? <Link href={href}>{rootType}</Link> : type}
        {rest.join('.')}
      </Code>
    )
  }

  return (
    <table className="x:my-8 x:w-full x:text-sm">
      <thead className="nextra-border x:border-b x:text-left x:max-lg:hidden">
        <tr>
          <th className="x:py-1.5">Name</th>
          <th className="x:p-1.5 x:px-3">Type</th>
          {showDefaultColumn && <th className="x:py-1.5">Default</th>}
        </tr>
      </thead>
      {Object.entries(type).map(([key, prop]) => {
        const id = slugify(key)
        return (
          <tbody
            key={id}
            className="x:group nextra-border x:dark:hover:bg-primary-100/5 x:mb-5 x:rounded-xl x:hover:bg-gray-100 x:max-lg:block x:max-lg:border"
          >
            <tr
              className="nextra-border x:max-lg:block x:lg:border-b x:lg:not-target:[&>td>a]:opacity-0"
              id={id}
            >
              <td className="x:relative x:py-3 x:max-lg:block x:max-lg:px-3">
                <a
                  href={`#${id}`}
                  className={cn(
                    'x:absolute x:top-0 x:right-0 x:text-lg x:font-black x:lg:top-1/2 x:lg:right-full x:lg:-translate-y-1/2',
                    'x:group-hover:opacity-100! x:before:content-["#"] x:hover:text-black x:dark:hover:text-white',
                    'x:p-3' // Increase hit box
                  )}
                />
                <Code>
                  {key}
                  {!prop.required && '?'}
                </Code>
              </td>
              <td className='x:p-3 x:max-lg:block x:max-lg:before:content-["Type:_"]'>
                {linkify(prop.type)}
                {prop.description && (
                  <div className="x:mt-2 x:text-sm">{prop.description}</div>
                )}
              </td>
              {showDefaultColumn && (
                // For the mobile view, we want to hide the default column entirely
                // if there is no content for it. We want this because otherwise
                // the default padding applied to table cells will add some extra
                // blank space we don't want.
                <td
                  className={cn(
                    'x:max-lg:block',
                    prop.default
                      ? 'x:py-3 x:max-lg:px-3 x:max-lg:before:content-["Default:_"]'
                      : 'x:lg:after:content-["–"]'
                  )}
                >
                  {prop.default && linkify(prop.default)}
                </td>
              )}
            </tr>
          </tbody>
        )
      })}
    </table>
  )
}
