'use client'

import cn from 'clsx'
import type { MDXWrapper } from 'nextra'
import type { ComponentProps, ReactNode } from 'react'
import { Breadcrumb, Pagination, TOC } from '../../components'
import { useConfig, useThemeConfig } from '../../contexts'

const classes = {
  toc: cn('nextra-toc _order-last max-xl:_hidden _w-64 _shrink-0 print:_hidden')
}

export function ClientWrapper({
  toc,
  children,
  skipNavContent,
  metadata,
  ...props
}: ComponentProps<MDXWrapper> & {
  skipNavContent: ReactNode
}) {
  const { normalizePagesResult } = useConfig()
  const themeConfig = useThemeConfig()
  const {
    activeType,
    activeThemeContext: themeContext,
    activePath,
    flatDocsDirectories,
    activeIndex
  } = normalizePagesResult

  const tocEl =
    activeType === 'page' ||
    !themeContext.toc ||
    themeContext.layout !== 'default' ? (
      themeContext.layout !== 'full' && (
        <nav className={classes.toc} aria-label="table of contents" />
      )
    ) : (
      <nav className={classes.toc} aria-label="table of contents">
        <TOC
          toc={themeConfig.toc.float ? toc : []}
          filePath={props.filePath}
          pageTitle={props.title}
        />
      </nav>
    )

  const date =
    themeContext.timestamp && themeConfig.gitTimestamp && props.timestamp
      ? new Date(props.timestamp)
      : null

  const gitTimestampEl = date ? (
    <div
      // Because a user's time zone may be different from the server page
      suppressHydrationWarning
      className="_mt-12 _mb-8 _block _text-xs _text-gray-500 ltr:_text-right rtl:_text-left dark:_text-gray-400"
    >
      Last updated on{' '}
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString('en', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </time>
    </div>
  ) : (
    <div className="_mt-16" />
  )

  return (
    <>
      {tocEl}
      {skipNavContent}
      <article
        data-pagefind-body={(metadata as any).searchable !== false || undefined}
        className={cn(
          '_w-full _break-words _min-h-[calc(100vh-var(--nextra-navbar-height))]',
          '_text-slate-700 dark:_text-slate-200 _pb-8 _px-6 _pt-4 md:_px-12',
          themeContext.layout !== 'full' && '_max-w-6xl',
          themeContext.typesetting === 'article' &&
            'nextra-body-typesetting-article'
        )}
      >
        {activeType !== 'page' && themeContext.breadcrumb && (
          <Breadcrumb activePath={activePath} />
        )}
        {children}
        {gitTimestampEl}
        {activeType !== 'page' && themeContext.pagination && (
          <Pagination
            flatDocsDirectories={flatDocsDirectories}
            currentIndex={activeIndex}
          />
        )}
      </article>
    </>
  )
}
