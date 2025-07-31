import { Button, Select } from 'nextra/components'
import { ArrowRightIcon, ChatGPTIcon, ClaudeIcon, CopyIcon } from 'nextra/icons'
import type { FC, SVGProps } from 'react'

const Item: FC<{
  icon: FC<SVGProps<SVGElement>>
  title: string
  description: string
}> = ({ icon: Icon, title, description }) => {
  return (
    <div className="x:flex x:gap-2">
      <Icon width="16" />
      <div>
        <span>{title}</span>
        <span>{description}</span>
      </div>
    </div>
  )
}

export const CopyPage: FC = () => {
  return (
    <div className="x:border x:inline-flex x:rounded-md x:items-center nextra-border x:float-end">
      <Button className="x:ps-2 x:pe-1 x:flex x:gap-2">
        <CopyIcon width="16" />
        Copy page
      </Button>
      <Select
        anchor={{ to: 'bottom end', gap: 10 }}
        options={[
          {
            id: 'light',
            name: (
              <Item
                icon={CopyIcon}
                title="Copy page"
                description="Copy page as Markdown for LLMs"
              />
            )
          },
          {
            id: 'dark',
            name: (
              <Item
                icon={ChatGPTIcon}
                title="Open in ChatGPT"
                description="Ask questions about this page"
              />
            )
          },
          {
            id: 'system',
            name: (
              <Item
                icon={ClaudeIcon}
                title="Open in Claude"
                description="Ask questions about this page"
              />
            )
          }
        ]}
        value=""
        selectedOption={<ArrowRightIcon width="12" className="x:rotate-90" />}
        onChange={console.log}
      />
    </div>
  )
}
