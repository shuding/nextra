'use client'

import { usePathname } from 'next/navigation'
import type { ReactElement, ReactNode } from 'react'
import { useThemeConfig } from '../contexts'
import { H1 } from '../mdx-components/h1'
import { getGitIssueUrl, renderComponent } from '../utils'
import { Link } from './link'

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

  return (
    <div className="_flex _flex-col _justify-center _items-center _gap-6 _h-screen">
      {children}
      <Link
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Found broken \`${pathname}\` link. Please fix!`,
          labels
        })}
        newWindow
      >
        {renderComponent(content)}
      </Link>
    </div>
  )
}
