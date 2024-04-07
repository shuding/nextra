'use client'

import { usePathname } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import type { ReactElement, ReactNode } from 'react'
import { useThemeConfig } from '../contexts'
import { H1, Link } from '../mdx-components'
import { getGitIssueUrl } from '../utils'

type NotFoundPageProps = {
  content?: ReactNode
  labels?: string
  children?: ReactNode
}

export function NotFoundPage({
  content = 'Submit an issue about broken link →',
  labels = 'bug',
  children = <H1>404: Page Not Found</H1>
}: NotFoundPageProps): ReactElement {
  const config = useThemeConfig()
  const pathname = usePathname()
  const mounted = useMounted()

  return (
    <div className="_flex _flex-col _justify-center _items-center _gap-6 _h-[calc(100dvh-var(--nextra-navbar-height))]">
      {children}
      <Link
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Found broken \`${
            mounted ? pathname : ''
          }\` link. Please fix!`,
          labels
        })}
        newWindow
      >
        {content}
      </Link>
    </div>
  )
}
