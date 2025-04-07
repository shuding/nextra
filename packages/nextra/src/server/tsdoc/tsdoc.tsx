import cn from 'clsx'
import Slugger from 'github-slugger'
import type { FC, ReactNode } from 'react'
import { Callout } from '../../client/components/callout.js'
import { Tabs } from '../../client/components/tabs/index.js'
import { Anchor } from '../../client/mdx-components/anchor.js'
import { Code } from '../../client/mdx-components/code.js'
import { MDXRemote } from '../../client/mdx-remote.js'
import { compileMdx } from '../compile.js'
import { generateDocumentation } from './base.js'
import type {
  BaseTypeTableProps,
  GeneratedFunction,
  TypeField
} from './types.js'

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

// copied from nextra-theme-docs
const Link: typeof Anchor = ({ className, ...props }) => {
  return (
    <Anchor
      className={cn(
        'x:text-primary-600 x:underline x:hover:no-underline x:decoration-from-font x:[text-underline-position:from-font]',
        className
      )}
      {...props}
    />
  )
}

async function renderMarkdownDefault(description: string): Promise<ReactNode> {
  if (!description) return
  const rawJs = await compileMdx(description)
  return <MDXRemote compiledSource={rawJs} />
}

type Entry = {
  name: string
  type: string
  description?: ReactNode
  default?: string
  optional?: boolean
}

export const TSDoc: FC<TSDocProps> = async ({
  renderMarkdown = renderMarkdownDefault,
  typeLinkMap = {},
  ...props
}) => {
  const result = generateDocumentation(props)
  const mapEntry = async (entry: TypeField): Promise<Entry> => {
    const tags = entry.tags ?? {}
    return {
      name: entry.name,
      type: entry.type,
      description: await renderMarkdown(
        entry.description || tags.description || ''
      ),
      default: tags.default || tags.defaultValue,
      optional: entry.optional
    }
  }
  if ('entries' in result) {
    const promises = result.entries.map(entry => mapEntry(entry))
    const entries = await Promise.all(promises)
    return <FieldsTable fields={entries} typeLinkMap={typeLinkMap} />
  }

  const withSignatures = result.signatures.length > 1

  if (!withSignatures) {
    return <FunctionSignature signature={result.signatures[0]!} />
  }

  return (
    <Tabs
      items={result.signatures.map(
        (_, index) => `Function Signature ${index + 1}`
      )}
    >
      {result.signatures.map((signature, index) => (
        <Tabs.Tab key={index}>
          <FunctionSignature signature={signature} index={index + 1} />
        </Tabs.Tab>
      ))}
    </Tabs>
  )

  async function FunctionSignature({
    signature,
    index = ''
  }: Readonly<{
    signature: GeneratedFunction['signatures'][number]
    /** Signature index, will be appended to returns anchor. */
    index?: string | number
  }>) {
    const promises = signature.params.map(entry => mapEntry(entry))
    const entries = await Promise.all(promises)
    const slugger = new Slugger()

    const promises2 = signature.returns.map(entry =>
      mapEntry(
        // @ts-expect-error -- fixme
        entry
      )
    )
    const returns = await Promise.all(promises2)

    return (
      <>
        <b className="x:mt-6 x:block">Parameters:</b>
        {entries.length ? (
          <FieldsTable fields={entries} typeLinkMap={typeLinkMap} />
        ) : (
          <Callout type="info">
            This function does not accept any parameters.
          </Callout>
        )}
        <b className="x:mt-6 x:block">Returns:</b>
        <table className="x:my-8 x:w-full x:text-sm">
          <thead className="nextra-border x:border-b x:text-left x:max-lg:hidden">
            <tr>
              <th className="x:py-1.5">Name</th>
              <th className="x:p-1.5 x:px-3">Type</th>
            </tr>
          </thead>
          {returns.map(prop => {
            const id = slugger.slug(prop.name || `returns${index}`)
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
                    {prop.name && (
                      <Code
                        // add `?` via CSS `content` property so value will be not selectable
                        className={cn(prop.optional && 'x:after:content-["?"]')}
                      >
                        {prop.name}
                      </Code>
                    )}
                  </td>
                  <td
                    // add `Type: ` via CSS `content` property so value will be not selectable
                    className='x:p-3 x:max-lg:block x:max-lg:before:content-["Type:_"]'
                  >
                    {linkify(prop.type, typeLinkMap)}
                    {prop.description && (
                      <div className="x:mt-2 x:text-sm">{prop.description}</div>
                    )}
                  </td>
                </tr>
              </tbody>
            )
          })}
        </table>
      </>
    )
  }
}

const FieldsTable: FC<{
  fields: Entry[]
  typeLinkMap: TSDocProps['typeLinkMap']
}> = ({ fields, typeLinkMap }) => {
  const slugger = new Slugger()
  return (
    <table className="x:my-8 x:w-full x:text-sm">
      <thead className="nextra-border x:border-b x:text-left x:max-lg:hidden">
        <tr>
          <th className="x:py-1.5">Name</th>
          <th className="x:p-1.5 x:px-3">Type</th>
          <th className="x:py-1.5">Default</th>
        </tr>
      </thead>
      {fields.map(prop => {
        const id = slugger.slug(prop.name)
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
                  className={cn(prop.optional && 'x:after:content-["?"]')}
                >
                  {prop.name}
                </Code>
              </td>
              <td
                // add `Type: ` via CSS `content` property so value will be not selectable
                className='x:p-3 x:max-lg:block x:max-lg:before:content-["Type:_"]'
              >
                {linkify(prop.type, typeLinkMap)}
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
                {prop.default && linkify(prop.default, typeLinkMap)}
              </td>
            </tr>
          </tbody>
        )
      })}
    </table>
  )
}

// This function takes a string representing some type and attempts to turn any
// types referenced inside into links, either internal or external.
function linkify(type: string, typeLinkMap: TSDocProps['typeLinkMap'] = {}) {
  return (
    <Code>
      {type.match(/(\w+|\W+)/g)!.map((chunk, index) => {
        const href = typeLinkMap[chunk]
        return href ? (
          <Link key={index} href={href}>
            {/* use React fragment to avoid rendering external link icon */}
            <>{chunk}</>
          </Link>
        ) : (
          chunk
        )
      })}
    </Code>
  )
}
