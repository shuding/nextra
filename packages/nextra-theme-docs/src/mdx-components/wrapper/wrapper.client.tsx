'use client'

import cn from 'clsx'
import type { MDXWrapper } from 'nextra'
import { useEffect } from 'react'
import { Breadcrumb, Pagination, TOC } from '../../components'
import { setToc, useConfig, useThemeConfig } from '../../stores'

export const ClientWrapper: MDXWrapper = ({ toc, children, ...props }) => {
  const { normalizePagesResult } = useConfig()
  const themeConfig = useThemeConfig()
  const {
    activeType,
    activeThemeContext: themeContext,
    activePath,
    flatDocsDirectories,
    activeIndex
  } = normalizePagesResult

  const date =
    themeContext.timestamp &&
    themeConfig.gitTimestamp &&
    props.timestamp &&
    new Date(props.timestamp)

  const gitTimestampEl = date ? (
    <div
      // Because a user's time zone may be different from the server page
      suppressHydrationWarning
      className="_mt-12 _mb-8 _text-xs _text-gray-500 _text-end dark:_text-gray-400"
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
  // We can't update store in server component so doing it in client component
  useEffect(() => {
    setToc(toc)
  }, [toc])

  return (
    <>
      {themeContext.layout !== 'full' && (
        <nav
          className="nextra-toc _order-last max-xl:_hidden _w-64 _shrink-0 print:_hidden"
          aria-label="table of contents"
        >
          {themeContext.toc && activeType !== 'page' && (
            <TOC
              toc={themeConfig.toc.float ? toc : []}
              filePath={props.filePath}
              pageTitle={props.title}
            />
          )}
        </nav>
      )}
      <article
        className={cn(
          '_w-full _min-w-0 _break-words _min-h-[calc(100vh-var(--nextra-navbar-height))]',
          '_text-slate-700 dark:_text-slate-200 _pb-8 _px-6 _pt-4 md:_px-12',
          themeContext.typesetting === 'article' &&
            'nextra-body-typesetting-article'
        )}
      >
        {themeContext.breadcrumb && activeType !== 'page' && (
          <Breadcrumb activePath={activePath} />
        )}
        {children}
        {gitTimestampEl}
        {themeContext.pagination && activeType !== 'page' && (
          <Pagination
            flatDocsDirectories={flatDocsDirectories}
            currentIndex={activeIndex}
          />
        )}
      </article>
    </>
  )
}
