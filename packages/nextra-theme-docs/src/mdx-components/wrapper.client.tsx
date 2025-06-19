'use client'

import cn from 'clsx'
import type { MDXWrapper } from 'nextra'
import type { ComponentProps, FC } from 'react'
import { cloneElement } from 'react'
import { Breadcrumb, Pagination, TOC } from '../components'
import { useConfig, useThemeConfig } from '../stores'

export const ClientWrapper: FC<Omit<ComponentProps<MDXWrapper>, 'toc'>> = ({
  children,
  metadata,
  bottomContent
}) => {
  const {
    activeType,
    activeThemeContext: themeContext,
    activePath
  } = useConfig().normalizePagesResult
  const themeConfig = useThemeConfig()
  const date = themeContext.timestamp && metadata.timestamp

  return (
    <>
      {(themeContext.layout === 'default' || themeContext.toc) && (
        <nav
          className="nextra-toc x:order-last x:max-xl:hidden x:w-64 x:shrink-0 x:print:hidden"
          aria-label="table of contents"
        >
          {themeContext.toc && (
            <TOC filePath={metadata.filePath} pageTitle={metadata.title} />
          )}
        </nav>
      )}
      <article
        className={cn(
          'x:w-full x:min-w-0 x:break-words x:min-h-[calc(100vh-var(--nextra-navbar-height))]',
          'x:text-slate-700 x:dark:text-slate-200 x:pb-8 x:px-4 x:pt-4 x:md:px-12',
          themeContext.typesetting === 'article' &&
            'nextra-body-typesetting-article'
        )}
      >
        {themeContext.breadcrumb && activeType !== 'page' && (
          <Breadcrumb activePath={activePath} />
        )}
        {children}
        {date ? (
          <div className="x:mt-12 x:mb-8 x:text-xs x:text-gray-600 x:text-end x:dark:text-gray-400">
            {/* @ts-expect-error -- fixme */}
            {cloneElement(themeConfig.lastUpdated, { date: new Date(date) })}
          </div>
        ) : (
          <div className="x:mt-16" />
        )}
        {themeContext.pagination && activeType !== 'page' && <Pagination />}
        {bottomContent}
      </article>
    </>
  )
}
