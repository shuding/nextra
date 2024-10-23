import type { FC, ReactNode } from 'react'
import { H1 } from '../../mdx-components/heading'
import { NotFoundLink } from './index.client'

type NotFoundPageProps = {
  content?: ReactNode
  labels?: string
  children?: ReactNode
}

export const NotFoundPage: FC<NotFoundPageProps> = ({
  content = 'Submit an issue about broken link',
  labels = 'bug',
  children = <H1>404: Page Not Found</H1>
}) => {
  return (
    <div className="_flex _flex-col _justify-center _items-center _gap-6 _h-[calc(100dvh-var(--nextra-navbar-height))]">
      {children}
      <NotFoundLink labels={labels}>{content}</NotFoundLink>
    </div>
  )
}
