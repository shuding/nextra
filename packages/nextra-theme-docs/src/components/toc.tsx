'use client'

import cn from 'clsx'
import type { Heading } from 'nextra'
import type { FC } from 'react'
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

export const TOC: FC<TOCProps> = ({ toc, filePath, pageTitle }) => {
  const activeSlug = useActiveAnchor()
  const tocRef = useRef<HTMLUListElement>(null!)
  const themeConfig = useThemeConfig()

  const hasHeadings = toc.length > 0
  const hasMetaInfo = Boolean(
    themeConfig.feedback.content ||
      themeConfig.editLink ||
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
        scrollMode: 'if-needed',
        boundary: tocRef.current
      })
    }
  }, [activeSlug])

  return (
    <div
      className={cn(
        hasHeadings && '_grid _grid-rows-[min-content_1fr_min-content]', // 1fr: toc headings, min-content: title/footer
        '_sticky _top-[--nextra-navbar-height] _text-sm',
        '_max-h-[calc(100vh-var(--nextra-navbar-height))]'
      )}
    >
      {hasHeadings && (
        <>
          <p className="_pt-6 _px-4 _font-semibold _tracking-tight">
            {themeConfig.toc.title}
          </p>
          <ul
            ref={tocRef}
            className={cn(
              '_p-4 nextra-scrollbar _overscroll-y-contain _overflow-y-auto _hyphens-auto',
              'mask' // for title/footer shadow
            )}
          >
            {toc.map(({ id, value, depth }) => (
              <li className="_my-2 _scroll-my-6 _scroll-py-6" key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    'focus-visible:nextra-focus',
                    {
                      2: '_font-semibold',
                      3: '_ms-3',
                      4: '_ms-6',
                      5: '_ms-9',
                      6: '_ms-12'
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
          className={cn(hasHeadings && 'bordered', '_grid _gap-2 _py-4 _mx-4')}
        >
          {themeConfig.feedback.content && (
            <Anchor
              className={linkClassName}
              href={getGitIssueUrl({
                labels: themeConfig.feedback.labels,
                repository: themeConfig.docsRepositoryBase,
                title: `Feedback for “${pageTitle}”`
              })}
            >
              {themeConfig.feedback.content}
            </Anchor>
          )}

          {themeConfig.editLink && (
            <Anchor
              className={linkClassName}
              href={`${gitUrlParse(themeConfig.docsRepositoryBase).href}/${filePath}`}
            >
              {themeConfig.editLink}
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
