import React, { ReactElement, useEffect, useRef, useMemo } from 'react'
import cn from 'clsx'
import Slugger from 'github-slugger'
import { Heading } from 'nextra'
import parseGitUrl from 'parse-git-url'
import scrollIntoView from 'scroll-into-view-if-needed'

import { renderComponent, getHeadingText, getGitIssueUrl } from '../utils'
import { useConfig, useActiveAnchor } from '../contexts'
import { Anchor } from './anchor'

const getEditUrl = (filepath?: string): string => {
  const config = useConfig()
  const repo = parseGitUrl(config.docsRepositoryBase || '')
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${repo.name}/blob/${
        repo.branch || 'main'
      }/${repo.subdir || 'pages'}${filepath}`
    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${repo.name}/-/blob/${
        repo.branch || 'main'
      }/${repo.subdir || 'pages'}${filepath}`
  }

  return '#'
}

export function TOC({
  headings,
  filepathWithName,
  className
}: {
  headings: Heading[]
  filepathWithName: string
  className: string
}): ReactElement {
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
  const hasMetaInfo =
    config.feedbackLink || config.footerEditLink || config.tocExtraContent

  const activeSlug = Object.entries(activeAnchor).find(
    ([, { isActive }]) => isActive
  )?.[0]

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(`li > a[href="#${activeSlug}"`)

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
    'text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
    'contrast-more:text-gray-800 contrast-more:dark:text-gray-50'
  )

  return (
    <div ref={tocRef} className={cn('mx-4', className)}>
      <div
        className={cn(
          'sticky top-16 overflow-y-auto pr-4 pt-8 text-sm [hyphens:auto]',
          'ltr:-mr-4 rtl:-ml-4 max-h-[calc(100vh-4rem-env(safe-area-inset-bottom))]'
        )}
      >
        {hasHeadings && (
          <>
            <p className="mb-4 font-semibold tracking-tight">On This Page</p>
            <ul>
              {items.map(({ slug, text, depth }) => (
                <li className="my-2 scroll-my-6 scroll-py-6" key={slug}>
                  <a
                    href={`#${slug}`}
                    className={cn(
                      {
                        2: 'font-semibold',
                        3: 'ltr:ml-4 rtl:mr-4',
                        4: 'ltr:ml-8 rtl:mr-8',
                        5: 'ltr:ml-12 rtl:mr-12',
                        6: 'ltr:ml-16 rtl:mr-16'
                      }[depth],
                      activeAnchor[slug]?.isActive
                        ? 'text-primary-500 subpixel-antialiased contrast-more:!text-primary-500'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300',
                      'contrast-more:text-gray-900 contrast-more:underline contrast-more:dark:text-gray-50'
                    )}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {hasMetaInfo ? (
          <div
            className={cn(
              hasHeadings &&
                'mt-8 border-t bg-white pt-8 shadow-[0_-12px_16px_white] dark:bg-dark dark:shadow-[0_-12px_16px_#111]',
              'sticky bottom-0 pb-8 dark:border-neutral-800 flex flex-col gap-2',
              'contrast-more:shadow-none contrast-more:border-t contrast-more:border-neutral-400 contrast-more:dark:border-neutral-400'
            )}
          >
            {config.feedbackLink ? (
              <Anchor
                className={linkClassName}
                href={getGitIssueUrl({
                  repository: config.docsRepositoryBase,
                  title: `Feedback for “${config.title}”`,
                  labels: config.feedbackLabels
                })}
                newWindow
              >
                {renderComponent(config.feedbackLink)}
              </Anchor>
            ) : null}

            {config.footerEditLink ? (
              <Anchor
                className={linkClassName}
                href={getEditUrl(filepathWithName)}
                newWindow
              >
                {renderComponent(config.footerEditLink)}
              </Anchor>
            ) : null}

            {config.tocExtraContent
              ? renderComponent(config.tocExtraContent)
              : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
