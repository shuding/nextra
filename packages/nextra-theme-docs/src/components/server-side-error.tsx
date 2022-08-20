import React, { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { renderComponent, useMounted, getGitIssueUrl } from '../utils'
import { useRouter } from 'next/router'
import { Anchor } from './anchor'

export function ServerSideErrorPage(): ReactElement | null {
  const config = useConfig()
  const mounted = useMounted()
  const { asPath } = useRouter()
  const { link, labels } = config.serverSideError
  if (!link) {
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
          labels
        })}
        newWindow
        className="ring-primary-500/30 focus:outline-none focus-visible:ring text-primary-500 underline decoration-from-font [text-underline-position:under]"
      >
        {renderComponent(link)}
      </Anchor>
    </p>
  )
}
