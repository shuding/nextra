import React from 'react'
import { useConfig } from '../contexts'
import { renderComponent, useMounted, getGitIssueUrl } from '../utils'
import { useRouter } from 'next/router'
import { Anchor } from './anchor'

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
