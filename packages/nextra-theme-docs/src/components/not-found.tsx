import React from 'react'
import { useConfig } from '../contexts'
import { renderComponent, useMounted, getGitIssueUrl } from '../utils'
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
        className="ring-primary-500/30 focus:outline-none focus-visible:ring text-primary-500 underline decoration-from-font [text-underline-position:under]"
      >
        {renderComponent(config.notFoundLink)}
      </Anchor>
    </p>
  )
}
