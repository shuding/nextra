import cn from 'clsx'
import { Button, Select } from 'nextra/components'
import { useCopy } from 'nextra/hooks'
import {
  ArrowRightIcon,
  ChatGPTIcon,
  ClaudeIcon,
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

export const CopyPage: FC<{ sourceCode: string }> = ({ sourceCode }) => {
  const { copy, isCopied } = useCopy()

  function handleCopy() {
    copy(sourceCode)
  }

  return (
    <div className="x:border x:inline-flex x:rounded-md x:items-center nextra-border x:float-end">
      <Button
        className={cn(
          'x:ps-2 x:pe-1 x:flex x:gap-2 x:text-sm x:font-medium',
          isCopied && 'x:opacity-70'
        )}
        onClick={handleCopy}
      >
        <CopyIcon width="16" />
        {isCopied ? 'Copied' : 'Copy page'}
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
              <Item
                icon={ChatGPTIcon}
                title="Open in ChatGPT"
                description="Ask questions about this page"
                isExternal
              />
            )
          },
          {
            id: 'claude',
            name: (
              <Item
                icon={ClaudeIcon}
                title="Open in Claude"
                description="Ask questions about this page"
                isExternal
              />
            )
          }
        ]}
        value=""
        selectedOption={<ArrowRightIcon width="12" className="x:rotate-90" />}
        onChange={value => {
          if (value === 'copy') {
            handleCopy()
          }
        }}
      />
    </div>
  )
}
