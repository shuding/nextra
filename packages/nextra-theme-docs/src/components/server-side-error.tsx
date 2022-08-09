import React from 'react'
import { useConfig } from '../config'
import { renderComponent } from '../utils/render'
import useMounted from '../utils/use-mounted'
import { useRouter } from 'next/router'
import { Anchor } from './anchor'
import { getGitIssueUrl } from '../utils/get-git-issue-url'

export function ServerSideErrorPage() {
  const config = useConfig()
  const mounted = useMounted()
  const { asPath } = useRouter()
  if (!config.serverSideErrorLink) {
    return null
  }

  return (
    <p>
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Got server-side error in \`${
            mounted ? asPath : ''
          }\` url. Please fix!`,
          labels: config.serverSideErrorLabels
        })}
        newWindow
      >
        {renderComponent(config.serverSideErrorLink)}
      </Anchor>
    </p>
  )
}
