'use client'

import cn from 'clsx'
import type { NextraMDXContent } from 'nextra'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Breadcrumb, NavLinks, Sidebar, TOC } from '../../components'
import { useConfig, useThemeConfig } from '../../contexts'
import { renderComponent } from '../../utils'

const classes = {
  toc: cn(
    'nextra-toc _order-last max-xl:_hidden _w-64 _shrink-0 print:_hidden'
  ),
  main: cn('_w-full _break-words')
}

function Body({ children }: { children: ReactNode }): ReactElement {
  const config = useConfig()
  const themeConfig = useThemeConfig()
  const {
    activeThemeContext: themeContext,
    activeType,
    activeIndex,
    flatDocsDirectories,
    activePath
  } = config.normalizePagesResult

  const date =
    themeContext.timestamp && themeConfig.gitTimestamp && config.timestamp
      ? new Date(config.timestamp)
      : null

  const gitTimestampEl = date ? (
    <div
      // Because a user's time zone may be different from the server page
      suppressHydrationWarning
      className="_mt-12 _mb-8 _block _text-xs _text-gray-500 ltr:_text-right rtl:_text-left dark:_text-gray-400"
    >
      {renderComponent(themeConfig.gitTimestamp, { timestamp: date })}
    </div>
  ) : (
    <div className="_mt-16" />
  )

  const content = (
    <>
      {children}
      {gitTimestampEl}
      {activeType !== 'page' && themeContext.pagination && (
        <NavLinks
          flatDocsDirectories={flatDocsDirectories}
          currentIndex={activeIndex}
        />
      )}
    </>
  )

  if (themeContext.layout === 'full') {
    return (
      <article
        className={cn(
          classes.main,
          'nextra-content _min-h-[calc(100vh-var(--nextra-navbar-height))] _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {content}
      </article>
    )
  }

  return (
    <article
      className={cn(
        classes.main,
        'nextra-content _flex _min-h-[calc(100vh-var(--nextra-navbar-height))] _min-w-0 _justify-center _pb-8 _pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        themeContext.typesetting === 'article' &&
          'nextra-body-typesetting-article'
      )}
    >
      <main className="_w-full _min-w-0 _max-w-6xl _px-6 _pt-4 md:_px-12">
        {activeType !== 'page' && themeContext.breadcrumb && (
          <Breadcrumb activePath={activePath} />
        )}
        {content}
      </main>
    </article>
  )
}

export function ClientWrapper({
  toc,
  children,
  skipNavContent
}: ComponentProps<NextraMDXContent> & {
  skipNavContent: ReactNode
}) {
  const config = useConfig()
  const themeConfig = useThemeConfig()
  const {
    activeType,
    activeThemeContext: themeContext,
    docsDirectories,
    directories
  } = config.normalizePagesResult

  const tocEl =
    activeType === 'page' ||
    !themeContext.toc ||
    themeContext.layout !== 'default' ? (
      themeContext.layout !== 'full' && (
        <nav className={classes.toc} aria-label="table of contents" />
      )
    ) : (
      <nav className={cn(classes.toc, '_px-4')} aria-label="table of contents">
        <TOC
          toc={themeConfig.toc.float ? toc : []}
          filePath={config.filePath}
        />
      </nav>
    )
  return (
    <>
      <Sidebar
        docsDirectories={docsDirectories}
        fullDirectories={directories}
        toc={toc}
        asPopover={config.hideSidebar}
        includePlaceholder={themeContext.layout === 'default'}
      />
      {tocEl}
      {skipNavContent}
      <Body>{children}</Body>
    </>
  )
}
