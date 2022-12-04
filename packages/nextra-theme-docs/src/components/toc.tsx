import React, { ReactElement, useEffect, useRef, useMemo } from 'react'
import cn from 'clsx'
import Slugger from 'github-slugger'
import { Heading } from 'nextra'
import scrollIntoView from 'scroll-into-view-if-needed'

import { renderComponent, getHeadingText, getGitIssueUrl } from '../utils'
import { useConfig, useActiveAnchor } from '../contexts'
import { Anchor } from './anchor'

export type TOCProps = {
  headings: Heading[]
  filePath: string
}

export function TOC({ headings, filePath }: TOCProps): ReactElement {
  const slugger = new Slugger()
  const activeAnchor = useActiveAnchor()
  const config = useConfig()
  const tocRef = useRef<HTMLDivElement>(null)

  const items = useMemo<
    { text: string; slug: string; depth: 2 | 3 | 4 | 5 | 6 }[]
  >(
    () =>
      headings
        .filter(heading => heading.type === 'heading' && heading.depth > 1)
        .map(heading => {
          const text = getHeadingText(heading)
          return {
            text,
            slug: slugger.slug(text),
            depth: heading.depth as any
          }
        }),
    [headings]
  )

  const hasHeadings = items.length > 0
  const hasMetaInfo = Boolean(
    config.feedback.content ||
      config.editLink.component ||
      config.toc.extraContent
  )

  const activeSlug = Object.entries(activeAnchor).find(
    ([, { isActive }]) => isActive
  )?.[0]

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(
      `li > a[href="#${activeSlug}"]`
    )

    if (anchor) {
      scrollIntoView(anchor, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: tocRef.current
      })
    }
  }, [activeSlug])

  const linkClassName = cn(
    'nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100',
    'contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50'
  )

  return (
    <div
      ref={tocRef}
      className={cn(
        'nextra-scrollbar nx-sticky nx-top-16 nx-overflow-y-auto nx-pr-4 nx-pt-8 nx-text-sm [hyphens:auto]',
        'nx-max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:-nx-mr-4 rtl:-nx-ml-4'
      )}
    >
      {hasHeadings && (
        <>
          <p className="nx-mb-4 nx-font-semibold nx-tracking-tight">
            {renderComponent(config.toc.title)}
          </p>
          <ul>
            {items.map(({ slug, text, depth }) => (
              <li className="nx-my-2 nx-scroll-my-6 nx-scroll-py-6" key={slug}>
                <a
                  href={`#${slug}`}
                  className={cn(
                    {
                      2: 'nx-font-semibold',
                      3: 'ltr:nx-ml-4 rtl:nx-mr-4',
                      4: 'ltr:nx-ml-8 rtl:nx-mr-8',
                      5: 'ltr:nx-ml-12 rtl:nx-mr-12',
                      6: 'ltr:nx-ml-16 rtl:nx-mr-16'
                    }[depth],
                    'nx-inline-block',
                    activeAnchor[slug]?.isActive
                      ? 'nx-text-primary-600 nx-subpixel-antialiased contrast-more:!nx-text-primary-600'
                      : 'nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-300',
                    'contrast-more:nx-text-gray-900 contrast-more:nx-underline contrast-more:dark:nx-text-gray-50'
                  )}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasMetaInfo && (
        <div
          className={cn(
            hasHeadings &&
              'nx-mt-8 nx-border-t nx-bg-white nx-pt-8 nx-shadow-[0_-12px_16px_white] dark:nx-bg-dark dark:nx-shadow-[0_-12px_16px_#111]',
            'nx-sticky nx-bottom-0 nx-flex nx-flex-col nx-items-start nx-gap-2 nx-pb-8 dark:nx-border-neutral-800',
            'contrast-more:nx-border-t contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-border-neutral-400'
          )}
        >
          {config.feedback.content ? (
            <Anchor
              className={linkClassName}
              href={getGitIssueUrl({
                repository: config.docsRepositoryBase,
                title: `Feedback for “${config.title}”`,
                labels: config.feedback.labels
              })}
              newWindow
            >
              {renderComponent(config.feedback.content)}
            </Anchor>
          ) : null}

          {renderComponent(config.editLink.component, {
            filePath,
            className: linkClassName,
            children: renderComponent(config.editLink.text)
          })}

          {renderComponent(config.toc.extraContent)}
        </div>
      )}
    </div>
  )
}
