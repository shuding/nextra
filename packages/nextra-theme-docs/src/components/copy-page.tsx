'use client'

import cn from 'clsx'
import { Anchor, Button, Select } from 'nextra/components'
import { useCopy } from 'nextra/hooks'
import {
  ArrowRightIcon,
  ChatGPTIcon,
  ClaudeIcon,
  CopyCheckIcon,
  CopyIcon,
  LinkArrowIcon
} from 'nextra/icons'
import type { FC, SVGProps } from 'react'

const Item: FC<{
  icon: FC<SVGProps<SVGElement>>
  title: string
  description: string
  isExternal?: boolean
}> = ({ icon: Icon, title, description, isExternal }) => {
  return (
    <div className="x:flex x:gap-3 x:items-center">
      <Icon width="16" />
      <div className="x:flex x:flex-col">
        <span className="x:font-medium x:flex x:gap-1">
          {title}
          {isExternal && <LinkArrowIcon height="1em" />}
        </span>
        <span className="x:text-xs">{description}</span>
      </div>
    </div>
  )
}

export const CopyPage: FC<{
  sourceCode: string
}> = ({ sourceCode }) => {
  const { copy, isCopied } = useCopy()

  function handleCopy() {
    copy(sourceCode)
  }

  return (
    <div className="x:border x:inline-flex x:rounded-md nextra-border x:overflow-hidden">
      <Button
        className={({ hover }) =>
          cn(
            'x:ps-2 x:pe-1 x:flex x:gap-2 x:text-sm x:font-medium x:items-center',
            isCopied && 'x:opacity-70',
            hover &&
              'x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/5 x:dark:text-gray-50'
          )
        }
        onClick={handleCopy}
      >
        {isCopied ? <CopyCheckIcon width="16" /> : <CopyIcon width="16" />}
        Copy page
      </Button>
      <Select
        anchor={{ to: 'bottom end', gap: 10 }}
        className="x:rounded-none"
        options={[
          {
            id: 'copy',
            name: (
              <Item
                icon={CopyIcon}
                title="Copy page"
                description="Copy page as Markdown for LLMs"
              />
            )
          },
          {
            id: 'chatgpt',
            name: (
              <Anchor
                href={(() => {
                  if (typeof window === 'undefined') return ''
                  const query = `Read from ${location.href} so I can ask questions about it.`
                  return `https://chatgpt.com/?hints=search&prompt=${encodeURIComponent(query)}`
                })()}
                target="_blank"
              >
                <Item
                  icon={ChatGPTIcon}
                  title="Open in ChatGPT"
                  description="Ask questions about this page"
                  isExternal
                />
              </Anchor>
            )
          },
          {
            id: 'claude',
            name: (
              <Anchor
                href={(() => {
                  if (typeof window === 'undefined') return ''
                  const query = `Read from ${location.href} so I can ask questions about it.`
                  return `https://claude.ai/new?q=${encodeURIComponent(query)}`
                })()}
                target="_blank"
              >
                <Item
                  icon={ClaudeIcon}
                  title="Open in Claude"
                  description="Ask questions about this page"
                  isExternal
                />
              </Anchor>
            )
          }
        ]}
        value=""
        selectedOption={<ArrowRightIcon width="12" className="x:rotate-90" />}
      />
    </div>
  )
}
