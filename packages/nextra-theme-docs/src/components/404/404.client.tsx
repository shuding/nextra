'use client'

import { usePathname } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import { ReactNode } from 'react'
import { Link } from '../../mdx-components/link'
import { useThemeConfig } from '../../stores'
import { getGitIssueUrl } from '../../utils'

export function NotFoundLink({
  children,
  labels
}: {
  children: ReactNode
  labels: string
}) {
  const config = useThemeConfig()
  const pathname = usePathname()
  const mounted = useMounted()

  return (
    <Link
      href={getGitIssueUrl({
        repository: config.docsRepositoryBase,
        title: `Found broken \`${mounted ? pathname : ''}\` link. Please fix!`,
        labels
      })}
      newWindow
    >
      {children}
    </Link>
  )
}
