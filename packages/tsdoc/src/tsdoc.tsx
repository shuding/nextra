import slugify from '@sindresorhus/slugify'
import cn from 'clsx'
import { Link } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'
import { Code } from 'nextra/components'
import { MDXRemote } from 'nextra/mdx-remote'
import type { FC, ReactNode } from 'react'
import type { BaseTypeTableProps } from './base.js'
import { generateDocumentation } from './base.js'

type TSDocProps = BaseTypeTableProps & {
  /**
   * Override the function to render markdown into JSX nodes.
   * @default compileMdx
   */
  renderMarkdown?: typeof renderMarkdownDefault
  /**
   * Type links map.
   * @default {}
   */
  typeLinkMap?: Record<string, string>
}

async function renderMarkdownDefault(description: string): Promise<ReactNode> {
  if (!description) return
  const rawJs = await compileMdx(description)
  return <MDXRemote compiledSource={rawJs} />
}

export const TSDoc: FC<TSDocProps> = async ({
  renderMarkdown = renderMarkdownDefault,
  typeLinkMap = {},
  ...props
}) => {
  // This function takes a string representing some type and attempts to turn any
  // types referenced inside into links, either internal or external.
  function linkify(type: string) {
    return (
      <Code>
        {type.match(/(\w+|\W+)/g)!.map((chunk, index) => {
          const href = typeLinkMap[chunk]
          return href ? (
            <Link key={index} href={href}>
              {chunk}
            </Link>
          ) : (
            chunk
          )
        })}
      </Code>
    )
  }
  const promises = generateDocumentation(props).entries.map(async entry => ({
    name: entry.name,
    type: entry.type,
    description: await renderMarkdown(
      entry.description || entry.tags.description || ''
    ),
    default: entry.tags.default || entry.tags.defaultValue,
    required: entry.required
  }))
  const entries = await Promise.all(promises)

  return (
    <table className="x:my-8 x:w-full x:text-sm">
      <thead className="nextra-border x:border-b x:text-left x:max-lg:hidden">
        <tr>
          <th className="x:py-1.5">Name</th>
          <th className="x:p-1.5 x:px-3">Type</th>
          <th className="x:py-1.5">Default</th>
        </tr>
      </thead>
      {entries.map(prop => {
        const id = slugify(prop.name)
        return (
          <tbody
            key={id}
            className={cn(
              'x:group nextra-border x:mb-5 x:rounded-xl x:max-lg:block x:max-lg:border',
              'x:hover:bg-primary-50 x:dark:hover:bg-primary-500/10'
            )}
          >
            <tr
              id={id}
              className="nextra-border x:max-lg:block x:lg:border-b x:lg:not-target:[&>td>a]:opacity-0"
            >
              <td className="x:relative x:py-3 x:max-lg:block x:max-lg:px-3">
                <a
                  href={`#${id}`}
                  className={cn(
                    'x:absolute x:top-0 x:right-0 x:text-lg x:font-black x:lg:top-1/2 x:lg:right-full x:lg:-translate-y-1/2',
                    'x:group-hover:opacity-100! x:before:content-["#"] x:hover:text-black x:dark:hover:text-white',
                    'x:p-3' // Increase click box
                  )}
                />
                <Code
                  // add `?` via CSS `content` property so value will be not selectable
                  className={cn(!prop.required && 'x:after:content-["?"]')}
                >
                  {prop.name}
                </Code>
              </td>
              <td
                // add `Type: ` via CSS `content` property so value will be not selectable
                className='x:p-3 x:max-lg:block x:max-lg:before:content-["Type:_"]'
              >
                {linkify(prop.type)}
                {prop.description && (
                  <div className="x:mt-2 x:text-sm">{prop.description}</div>
                )}
              </td>
              <td
                className={cn(
                  'x:max-lg:block',
                  // For the mobile view, we want to hide the default column entirely if there is no
                  // content for it. We want this because otherwise the default padding applied to
                  // table cells will add some extra blank space we don't want.
                  prop.default
                    ? // add `Default: ` via CSS `content` property so value will be not selectable
                      'x:py-3 x:max-lg:px-3 x:max-lg:before:content-["Default:_"]'
                    : 'x:lg:after:content-["–"]'
                )}
              >
                {prop.default && linkify(prop.default)}
              </td>
            </tr>
          </tbody>
        )
      })}
    </table>
  )
}
