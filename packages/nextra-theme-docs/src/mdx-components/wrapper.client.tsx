'use client'

import cn from 'clsx'
import type { MDXWrapper } from 'nextra'
import { cloneElement, useEffect } from 'react'
import { Breadcrumb, Pagination, TOC } from '../components'
import { setToc, useConfig, useThemeConfig } from '../stores'

export const ClientWrapper: MDXWrapper = ({
  toc,
  children,
  metadata,
  title
}) => {
  const {
    activeType,
    activeThemeContext: themeContext,
    activePath
  } = useConfig().normalizePagesResult
  const themeConfig = useThemeConfig()

  const date =
    themeContext.timestamp && themeConfig.lastUpdated && metadata.timestamp

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
              filePath={metadata.filePath}
              pageTitle={title}
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
        {date ? (
          <div className="_mt-12 _mb-8 _text-xs _text-gray-500 _text-end dark:_text-gray-400">
            {cloneElement(themeConfig.lastUpdated, { date: new Date(date) })}
          </div>
        ) : (
          <div className="_mt-16" />
        )}
        {themeContext.pagination && activeType !== 'page' && <Pagination />}
      </article>
    </>
  )
}
