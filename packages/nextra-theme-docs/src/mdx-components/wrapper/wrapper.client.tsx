'use client'

import cn from 'clsx'
import type { MDXWrapper } from 'nextra'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect } from 'react'
import { Breadcrumb, Pagination, Sidebar, TOC } from '../../components'
import { useConfig, useThemeConfig } from '../../contexts'

const classes = {
  toc: cn(
    'nextra-toc _order-last max-xl:_hidden _w-64 _shrink-0 print:_hidden'
  ),
  main: cn(
    '_w-full _break-words _min-h-[calc(100vh-var(--nextra-navbar-height))]'
  )
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
  const { normalizePagesResult, setTOC } = useConfig()
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

  const content = (
    <>
      {children}
      {gitTimestampEl}
      {activeType !== 'page' && themeContext.pagination && (
        <Pagination
          flatDocsDirectories={flatDocsDirectories}
          currentIndex={activeIndex}
        />
      )}
    </>
  )

  const searchProps =
    (metadata as any).searchable === false
      ? null
      : { 'data-pagefind-body': true }

  const mainEl =
    themeContext.layout === 'full' ? (
      <article
        {...searchProps}
        className={cn(
          classes.main,
          'nextra-content _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {content}
      </article>
    ) : (
      <article
        className={cn(
          classes.main,
          'nextra-content _flex _min-w-0 _justify-center _pb-8 _pr-[calc(env(safe-area-inset-right)-1.5rem)]',
          themeContext.typesetting === 'article' &&
            'nextra-body-typesetting-article'
        )}
      >
        <main
          {...searchProps}
          className="_w-full _min-w-0 _max-w-6xl _px-6 _pt-4 md:_px-12"
        >
          {activeType !== 'page' && themeContext.breadcrumb && (
            <Breadcrumb activePath={activePath} />
          )}
          {content}
        </main>
      </article>
    )

  useEffect(() => {
    // I didn't find other way to pass toc to src/layout
    setTOC(toc)
  }, [setTOC, toc])

  return (
    <>
      <Sidebar toc={toc} />
      {tocEl}
      {skipNavContent}
      {mainEl}
    </>
  )
}
