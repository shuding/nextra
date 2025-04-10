'use client'

import cn from 'clsx'
import { Anchor } from 'nextra/components'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useActiveAnchor, useConfig, useThemeConfig, useTOC } from '../stores'
import { getGitIssueUrl, gitUrlParse } from '../utils'
import { BackToTop } from './back-to-top'

type TOCProps = {
  filePath: string
  pageTitle: string
}

const linkClassName = cn(
  'x:text-xs x:font-medium x:transition',
  'x:text-gray-600 x:dark:text-gray-400',
  'x:hover:text-gray-800 x:dark:hover:text-gray-200',
  'x:contrast-more:text-gray-700 x:contrast-more:dark:text-gray-100'
)

export const TOC: FC<TOCProps> = ({ filePath, pageTitle }) => {
  const activeSlug = useActiveAnchor()
  const tocRef = useRef<HTMLUListElement>(null)
  const themeConfig = useThemeConfig()
  const toc = useTOC()
  const hasMetaInfo =
    themeConfig.feedback.content ||
    themeConfig.editLink ||
    themeConfig.toc.extraContent ||
    themeConfig.toc.backToTop

  const { activeType } = useConfig().normalizePagesResult
  const anchors = themeConfig.toc.float || activeType === 'page' ? toc : []

  const hasHeadings = anchors.length > 0
  const activeIndex = toc.findIndex(({ id }) => id === activeSlug)

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(`a[href="#${activeSlug}"]`)
    if (!anchor) return

    scrollIntoView(anchor, {
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
      scrollMode: 'if-needed',
      boundary: tocRef.current
    })
  }, [activeSlug])

  const feedbackLink =
    themeConfig.feedback.link ??
    getGitIssueUrl({
      labels: themeConfig.feedback.labels,
      repository: themeConfig.docsRepositoryBase,
      title: `Feedback for “${pageTitle}”`
    })

  return (
    <div
      className={cn(
        'x:grid x:grid-rows-[min-content_1fr_min-content]', // 1fr: toc headings, min-content: title/footer
        'x:sticky x:top-(--nextra-navbar-height) x:text-sm',
        'x:max-h-[calc(100vh-var(--nextra-navbar-height))]'
      )}
    >
      {hasHeadings && (
        <>
          <p className="x:pt-6 x:px-4 x:font-semibold x:tracking-tight">
            {themeConfig.toc.title}
          </p>
          <ul
            ref={tocRef}
            className={cn(
              'x:p-4 nextra-scrollbar x:overscroll-y-contain x:overflow-y-auto x:hyphens-auto',
              'nextra-mask' // for title/footer shadow
            )}
          >
            {anchors.map(({ id, value, depth }) => (
              <li className="x:my-2 x:scroll-my-6 x:scroll-py-6" key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    'x:focus-visible:nextra-focus',
                    {
                      2: 'x:font-semibold',
                      3: 'x:ms-3',
                      4: 'x:ms-6',
                      5: 'x:ms-9',
                      6: 'x:ms-12'
                    }[depth],
                    'x:block x:transition-colors x:subpixel-antialiased',
                    id === activeSlug
                      ? 'x:text-primary-600 x:contrast-more:text-primary-600!'
                      : 'x:text-gray-600 x:hover:text-gray-900 x:dark:text-gray-400 x:dark:hover:text-gray-300',
                    'x:contrast-more:text-gray-900 x:contrast-more:underline x:contrast-more:dark:text-gray-50 x:break-words'
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
            'x:grid x:gap-2 x:py-4 x:mx-4',
            hasHeadings && 'x:border-t nextra-border'
          )}
        >
          {themeConfig.feedback.content && (
            <Anchor className={linkClassName} href={feedbackLink}>
              {themeConfig.feedback.content}
            </Anchor>
          )}

          {filePath && themeConfig.editLink && (
            <Anchor
              className={linkClassName}
              href={
                filePath.startsWith('http')
                  ? filePath
                  : `${gitUrlParse(themeConfig.docsRepositoryBase).href}/${filePath}`
              }
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
