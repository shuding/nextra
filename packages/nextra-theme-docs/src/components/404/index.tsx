import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { H1 } from '../../mdx-components/heading'
import { NotFoundLink } from './index.client'

type NotFoundPageProps = {
  /**
   * Content of the link.
   * @default 'Submit an issue about broken link'
   */
  content?: ReactNode
  /**
   * Labels that can be added to the new created issue.
   * @default 'bug'
   */
  labels?: string
  /**
   * Top content of page.
   * @default <H1>404: Page Not Found</H1>
   */
  children?: ReactNode
  /** CSS class name. */
  className?: string
}

export const NotFoundPage: FC<NotFoundPageProps> = ({
  content = 'Submit an issue about broken link',
  labels = 'bug',
  children,
  className
}) => {
  return (
    <div
      className={cn(
        'x:flex x:flex-col x:justify-center x:items-center x:h-[calc(100dvh-var(--nextra-navbar-height))]',
        className
      )}
    >
      {children || <H1>404: Page Not Found</H1>}
      <NotFoundLink labels={labels}>{content}</NotFoundLink>
    </div>
  )
}
