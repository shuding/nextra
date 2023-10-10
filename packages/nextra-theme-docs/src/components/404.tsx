import { useRouter } from 'next/router'
import { useMounted } from 'nextra/hooks'
import type { ReactElement } from 'react'
import { getGitIssueUrl, renderComponent } from '../utils'
import { Anchor } from './anchor'
import { useThemeConfigStore } from '../stores'

export function NotFoundPage(): ReactElement | null {
  const themeConfig = useThemeConfigStore()

  const mounted = useMounted()
  const { asPath } = useRouter()
  const { content, labels } = themeConfig.notFound
  if (!content) {
    return null
  }

  return (
    <p className="_text-center">
      <Anchor
        href={getGitIssueUrl({
          repository: themeConfig.docsRepositoryBase,
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
