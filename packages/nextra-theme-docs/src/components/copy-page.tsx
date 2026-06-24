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
import { useThemeConfig } from '../stores'

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
  const { copyPage } = useThemeConfig()

  function handleCopy() {
    copy(sourceCode)
  }

  return (
    <div className="x:border x:inline-flex x:rounded-md x:items-stretch nextra-border x:float-end x:overflow-hidden">
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
        <CopyIcon width="16" />
        {isCopied ? copyPage.copied : copyPage.button}
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
                title={copyPage.menuTitle}
                description={copyPage.menuDescription}
              />
            )
          },
          {
            id: 'chatgpt',
            name: (
              <Item
                icon={ChatGPTIcon}
                title={copyPage.chatgptTitle}
                description={copyPage.askDescription}
                isExternal
              />
            )
          },
          {
            id: 'claude',
            name: (
              <Item
                icon={ClaudeIcon}
                title={copyPage.claudeTitle}
                description={copyPage.askDescription}
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
            return
          }
          const url =
            value === 'chatgpt'
              ? 'chatgpt.com/?hints=search&prompt'
              : 'claude.ai/new?q'
          const query = `Read from ${location.href} so I can ask questions about it.`
          window.open(`https://${url}=${encodeURIComponent(query)}`, '_blank')
        }}
      />
    </div>
  )
}
