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
import type { BaseArgs, GeneratedFunction, TypeField } from './types.js'

type TSDocProps = BaseArgs & {
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

async function renderMarkdownDefault(description?: string): Promise<ReactNode> {
  if (!description) return
  const rawJs = await compileMdx(description)
  return <MDXRemote compiledSource={rawJs} />
}

export const TSDoc: FC<TSDocProps> = ({
  renderMarkdown = renderMarkdownDefault,
  typeLinkMap = {},
  ...props
}) => {
  const result = generateDocumentation(props)
  if ('entries' in result) {
    return (
      <FieldsTable
        fields={result.entries}
        typeLinkMap={typeLinkMap}
        renderMarkdown={renderMarkdown}
      />
    )
  }

  const withSignatures = result.signatures.length > 1

  if (!withSignatures) {
    return (
      <FunctionSignature signature={result.signatures[0]!} tags={result.tags} />
    )
  }

  return (
    <Tabs
      items={result.signatures.map(
        (_, index) => `Function Signature ${index + 1}`
      )}
    >
      {result.signatures.map((signature, index) => (
        <Tabs.Tab key={index}>
          <FunctionSignature
            signature={signature}
            index={index + 1}
            tags={result.tags}
          />
        </Tabs.Tab>
      ))}
    </Tabs>
  )

  async function FunctionSignature({
    signature,
    index = '',
    tags
  }: Readonly<{
    signature: GeneratedFunction['signatures'][number]
    /** Signature index, will be appended to returns anchor. */
    index?: string | number
    tags: GeneratedFunction['tags']
  }>) {
    const slugger = new Slugger()
    const returns: TypeField[] = Array.isArray(signature.returns)
      ? signature.returns
      : [{ name: '', type: signature.returns.type }]
    return (
      <>
        <b className="x:mt-6 x:block">Parameters:</b>
        {signature.params.length ? (
          <FieldsTable
            fields={signature.params}
            typeLinkMap={typeLinkMap}
            renderMarkdown={renderMarkdown}
          />
        ) : (
          <Callout type="info">
            This function does not accept any parameters.
          </Callout>
        )}
        <b className="x:mt-6 x:block">Returns:</b>
        {await renderMarkdown(tags?.returns)}
        <table className="x:my-6 x:w-full x:text-sm">
          <thead className="nextra-border x:border-b x:text-left x:max-lg:hidden">
            <tr>
              <th className="x:py-1.5">Name</th>
              <th className="x:p-1.5 x:px-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(async prop => {
              const id = slugger.slug(prop.name || `returns${index}`)
              const description =
                //
                await renderMarkdown(prop.description || prop.tags?.description)
              return (
                <Row key={id} id={id}>
                  <NameCell id={id} optional={prop.optional} name={prop.name} />
                  <TypeAndDescriptionCell
                    type={prop.type}
                    description={description}
                    typeLinkMap={typeLinkMap}
                  />
                </Row>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }
}

const Row: FC<{
  children: ReactNode
  id: string
}> = ({ children, id }) => {
  return (
    <tr
      id={id}
      className={cn(
        'x:group x:mb-5 x:rounded-xl x:max-lg:block',
        'x:hover:bg-primary-50 x:dark:hover:bg-primary-500/10',
        'nextra-border x:max-lg:border x:lg:border-b',
        'x:lg:not-target:[&>td>a]:opacity-0'
      )}
    >
      {children}
    </tr>
  )
}

const NameCell: FC<{
  name: string
  id: string
  optional?: boolean
}> = ({ name, id, optional }) => {
  return (
    <td
      className={cn(
        'x:relative x:max-lg:block',
        name && 'x:py-3 x:max-lg:px-3'
      )}
    >
      <a
        href={`#${id}`}
        className={cn(
          'x:absolute x:top-0 x:right-0 x:text-lg x:font-black x:lg:top-1/2 x:lg:right-full x:lg:-translate-y-1/2',
          'x:group-hover:opacity-100! x:before:content-["#"] x:hover:text-black x:dark:hover:text-white',
          'x:p-3' // Increase click box
        )}
      />
      {name && (
        <Code
          // add `?` via CSS `content` property so value will be not selectable
          className={optional ? 'x:after:content-["?"]' : ''}
        >
          {name}
        </Code>
      )}
    </td>
  )
}

const TypeAndDescriptionCell: FC<{
  type: string
  description: ReactNode
  typeLinkMap: TSDocProps['typeLinkMap']
}> = ({ type, description, typeLinkMap }) => {
  return (
    <td
      // add `Type: ` via CSS `content` property so value will be not selectable
      className='x:p-3 x:max-lg:block x:max-lg:before:content-["Type:_"]'
    >
      {linkify(type, typeLinkMap)}
      {description && <div className="x:mt-2 x:text-sm">{description}</div>}
    </td>
  )
}

const FieldsTable: FC<
  {
    fields: TypeField[]
  } & Required<Pick<TSDocProps, 'renderMarkdown' | 'typeLinkMap'>>
> = ({ fields, typeLinkMap, renderMarkdown }) => {
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
      <tbody>
        {fields.map(async field => {
          const id = slugger.slug(field.name)
          const tags = field.tags ?? {}
          const defaultValue = tags.default || tags.defaultValue
          const description =
            //
            await renderMarkdown(field.description || tags.description)

          return (
            <Row key={id} id={id}>
              <NameCell id={id} optional={field.optional} name={field.name} />
              <TypeAndDescriptionCell
                type={field.type}
                description={description}
                typeLinkMap={typeLinkMap}
              />
              <td
                className={cn(
                  'x:max-lg:block',
                  // For the mobile view, we want to hide the default column entirely if there is no
                  // content for it. We want this because otherwise the default padding applied to
                  // table cells will add some extra blank space we don't want.
                  defaultValue
                    ? // add `Default: ` via CSS `content` property so value will be not selectable
                      'x:py-3 x:max-lg:px-3 x:max-lg:before:content-["Default:_"]'
                    : 'x:lg:after:content-["–"]'
                )}
              >
                {defaultValue && linkify(defaultValue, typeLinkMap)}
              </td>
            </Row>
          )
        })}
      </tbody>
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
