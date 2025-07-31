import { Button, Select } from 'nextra/components'
import { ArrowRightIcon, ChatGPTIcon, ClaudeIcon, CopyIcon } from 'nextra/icons'
import { FC } from 'react'

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
              <div className="x:flex x:gap-2">
                <CopyIcon width="16" />
                Copy page
              </div>
            )
          },
          {
            id: 'dark',
            name: (
              <div className="x:flex x:gap-2">
                <ChatGPTIcon width="16" />
                Open in ChatGPT
              </div>
            )
          },
          {
            id: 'system',
            name: (
              <div className="x:flex x:gap-2">
                <ClaudeIcon width="16" />
                Open in Claude
              </div>
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
