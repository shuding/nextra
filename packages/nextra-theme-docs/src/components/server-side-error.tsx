import type { ReactElement } from 'react'
import { useMounted } from 'nextra/hooks'
import { useConfig } from '../contexts'
import { renderComponent, getGitIssueUrl } from '../utils'
import { useRouter } from 'next/router'
import { Anchor } from './anchor'

export function ServerSideErrorPage(): ReactElement | null {
  const config = useConfig()
  const mounted = useMounted()
  const { asPath } = useRouter()
  const { content, labels } = config.serverSideError
  if (!content) {
    return null
  }

  return (
    <p className="nx-text-center">
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Got server-side error in \`${
            mounted ? asPath : ''
          }\` url. Please fix!`,
          labels
        })}
        newWindow
        className="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
      >
        {renderComponent(content)}
      </Anchor>
    </p>
  )
}
