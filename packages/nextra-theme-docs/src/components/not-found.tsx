import React from 'react'
import { useConfig } from '../config'
import { renderComponent } from '../utils/render'
import useMounted from '../utils/use-mounted'
import { getGitIssueUrl } from '../utils/get-git-issue-url'
import { useRouter } from 'next/router'
import { Anchor } from './anchor'

export function NotFoundPage() {
  const config = useConfig()
  const mounted = useMounted()
  const { asPath } = useRouter()
  if (!config.notFoundLink) {
    return null
  }

  return (
    <p>
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Found broken \`${mounted ? asPath : ''}\` link. Please fix!`,
          labels: config.notFoundLabels
        })}
        newWindow
      >
        {renderComponent(config.notFoundLink)}
      </Anchor>
    </p>
  )
}
