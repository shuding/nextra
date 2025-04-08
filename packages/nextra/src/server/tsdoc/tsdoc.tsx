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

async function renderMarkdownDefault(description?: string): Promise<ReactNode> {
  if (!description) return
  const rawJs = await compileMdx(description)
  return <MDXRemote compiledSource={rawJs} />
}

export const TSDoc: FC<TSDocProps> = async ({
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
    const slugger = new Slugger()
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
        <table className="x:my-6 x:w-full x:text-sm">
          <thead className="nextra-border x:border-b x:text-left x:max-lg:hidden">
            <tr>
              <th className="x:py-1.5">Name</th>
              <th className="x:p-1.5 x:px-3">Type</th>
            </tr>
          </thead>
          {signature.returns.map(async prop => {
            const id =
              'name' in prop
                ? slugger.slug(prop.name || `returns${index}`)
                : undefined
            const description = await renderMarkdown(
              prop.description || ('tags' in prop ? prop.tags?.description : '')
            )
            const hasName = 'name' in prop && prop.name
            return (
              <tbody
                key={id}
                className={cn(
                  'x:mb-5 x:max-lg:block',
                  hasName && [
                    'x:group x:hover:bg-primary-50 x:dark:hover:bg-primary-500/10',
                    'x:rounded-xl x:max-lg:border nextra-border'
                  ]
                )}
              >
                <tr
                  id={id}
                  className={cn(
                    'nextra-border x:max-lg:block x:lg:border-b',
                    hasName && 'x:lg:not-target:[&>td>a]:opacity-0'
                  )}
                >
                  <td
                    className={
                      hasName
                        ? 'x:relative x:py-3 x:max-lg:px-3 x:max-lg:block'
                        : 'x:max-lg:hidden'
                    }
                  >
                    {hasName && (
                      <>
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
                          className={cn(
                            prop.optional && 'x:after:content-["?"]'
                          )}
                        >
                          {prop.name}
                        </Code>
                      </>
                    )}
                  </td>
                  <TypeAndDescriptionCell
                    type={prop.type}
                    description={description}
                    typeLinkMap={typeLinkMap}
                  />
                </tr>
              </tbody>
            )
          })}
        </table>
      </>
    )
  }
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
      {fields.map(async field => {
        const id = slugger.slug(field.name)
        const tags = field.tags ?? {}
        const defaultValue = tags.default || tags.defaultValue
        const description =
          //
          await renderMarkdown(field.description || tags.description)

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
                  className={cn(field.optional && 'x:after:content-["?"]')}
                >
                  {field.name}
                </Code>
              </td>
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
