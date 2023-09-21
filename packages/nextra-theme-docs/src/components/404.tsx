import { useRouter } from 'next/router'
import { useMounted } from 'nextra/hooks'
import type { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { getGitIssueUrl, renderComponent } from '../utils'
import { Anchor } from './anchor'

export function NotFoundPage(): ReactElement | null {
  const config = useConfig()
  const mounted = useMounted()
  const { asPath } = useRouter()
  const { content, labels } = config.notFound
  if (!content) {
    return null
  }

  return (
    <p className="_text-center">
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Found broken \`${mounted ? asPath : ''}\` link. Please fix!`,
          labels
        })}
        newWindow
        className="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]"
      >
        {renderComponent(content)}
      </Anchor>
    </p>
  )
}
