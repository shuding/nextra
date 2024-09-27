'use client'

import cn from 'clsx'
import type { Heading } from 'nextra'
import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useActiveAnchor, useThemeConfig } from '../stores'
import { getGitIssueUrl, gitUrlParse } from '../utils'
import { Anchor } from './anchor'
import { BackToTop } from './back-to-top'

type TOCProps = {
  toc: Heading[]
  filePath: string
  pageTitle: string
}

const linkClassName = cn(
  '_text-xs _font-medium',
  '_text-gray-600 dark:_text-gray-400',
  'hover:_text-gray-800 dark:hover:_text-gray-200',
  'contrast-more:_text-gray-700 contrast-more:dark:_text-gray-100'
)

export function TOC({ toc, filePath, pageTitle }: TOCProps): ReactElement {
  const activeSlug = useActiveAnchor()
  const tocRef = useRef<HTMLUListElement>(null!)
  const themeConfig = useThemeConfig()

  const hasHeadings = toc.length > 0
  const hasMetaInfo = Boolean(
    themeConfig.feedback.content ||
      themeConfig.editLink.content ||
      themeConfig.toc.extraContent ||
      themeConfig.toc.backToTop
  )

  const activeIndex = toc.findIndex(({ id }) => id === activeSlug)

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(`a[href="#${activeSlug}"]`)

    if (anchor) {
      scrollIntoView(anchor, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: tocRef.current.parentElement
      })
    }
  }, [activeSlug])

  return (
    <div
      className={cn(
        'nextra-scrollbar _sticky _top-[--nextra-navbar-height] _overflow-y-auto _px-4 _pt-6 _text-sm [hyphens:auto]',
        '_max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] _-me-4'
      )}
    >
      {hasHeadings && (
        <>
          <p className="_mb-4 _font-semibold _tracking-tight">
            {themeConfig.toc.title}
          </p>
          <ul ref={tocRef}>
            {toc.map(({ id, value, depth }) => (
              <li className="_my-2 _scroll-my-6 _scroll-py-6" key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    'focus-visible:nextra-focus',
                    {
                      2: '_font-semibold',
                      3: '_ms-4',
                      4: '_ms-8',
                      5: '_ms-12',
                      6: '_ms-16'
                    }[depth],
                    '_block _transition-colors _subpixel-antialiased',
                    id === activeSlug
                      ? '_text-primary-600 contrast-more:!_text-primary-600'
                      : '_text-gray-500 hover:_text-gray-900 dark:_text-gray-400 dark:hover:_text-gray-300',
                    'contrast-more:_text-gray-900 contrast-more:_underline contrast-more:dark:_text-gray-50 _break-words'
                  )}
                >
                  {value}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasMetaInfo && (
        <div
          className={cn(
            hasHeadings && 'nextra-toc-footer _mt-8 _pt-8',
            '_sticky _bottom-0 _flex _flex-col _items-start _gap-2 _pb-8',
            '_-mx-1 _px-1' // to hide focused toc links
          )}
        >
          {themeConfig.feedback.content && (
            <Anchor
              className={linkClassName}
              href={getGitIssueUrl({
                labels: themeConfig.feedback.labels,
                repository: themeConfig.docsRepositoryBase,
                title: `Feedback for “${pageTitle}”`
              })}
              newWindow
            >
              {themeConfig.feedback.content}
            </Anchor>
          )}

          {themeConfig.editLink.content && (
            <Anchor
              className={linkClassName}
              href={`${gitUrlParse(themeConfig.docsRepositoryBase).href}/${filePath}`}
            >
              {themeConfig.editLink.content}
            </Anchor>
          )}

          {themeConfig.toc.extraContent}

          {themeConfig.toc.backToTop && (
            <BackToTop className={linkClassName} hidden={activeIndex < 2}>
              {themeConfig.toc.backToTop}
            </BackToTop>
          )}
        </div>
      )}
    </div>
  )
}
