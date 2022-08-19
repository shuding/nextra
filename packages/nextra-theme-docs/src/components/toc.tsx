import React, { ReactElement, useRef, useEffect } from 'react'
import cn from 'clsx'
import Slugger from 'github-slugger'
import { Heading } from 'nextra'
import parseGitUrl from 'parse-git-url'
import scrollIntoView from 'scroll-into-view-if-needed'

import { renderComponent, getHeadingText, getGitIssueUrl } from '../utils'
import { useConfig, ActiveAnchor, useActiveAnchor } from '../contexts'
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

function Item({
  heading,
  slug,
  activeAnchor
}: {
  heading: Heading
  slug: string
  activeAnchor: ActiveAnchor
}): ReactElement {
  const text = getHeadingText(heading)
  const state = activeAnchor[slug]
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const el = ref.current
    const [toc] = document.getElementsByClassName('nextra-toc')
    if (state?.isActive && el && toc) {
      scrollIntoView(el, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: toc
      })
    }
  }, [state?.isActive])

  return (
    <li
      className={cn(
        'scroll-my-6 scroll-py-6',
        {
          1: '',
          2: '',
          3: 'ml-4',
          4: 'ml-8',
          5: 'ml-12',
          6: 'ml-16'
        }[heading.depth]
      )}
      ref={ref}
    >
      <a
        href={`#${slug}`}
        className={cn(
          'inline-block',
          heading.depth === 2 && 'font-semibold',
          state?.isActive
            ? 'text-primary-500 subpixel-antialiased'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
        )}
        aria-selected={state?.isActive}
      >
        {text}
      </a>
    </li>
  )
}

export function TOC({
  headings,
  filepathWithName
}: {
  headings: Heading[]
  filepathWithName: string
}): ReactElement {
  const slugger = new Slugger()
  const activeAnchor = useActiveAnchor()
  const config = useConfig()

  headings = headings.filter(h => h.type === 'heading' && h.depth > 1)

  const hasHeadings = headings.length > 0
  const hasMetaInfo =
    config.feedbackLink || config.footerEditLink || config.tocExtraContent

  return (
    <div className="nextra-toc order-last hidden w-64 flex-shrink-0 px-4 text-sm xl:block">
      <div className="nextra-toc-content sticky top-16 -mr-4 max-h-[calc(100vh-4rem-env(safe-area-inset-bottom))] overflow-y-auto pr-4 pt-8">
        {hasHeadings && (
          <ul>
            <p className="mb-4 font-semibold tracking-tight">On This Page</p>
            {headings.map(heading => {
              const text = getHeadingText(heading)
              const slug = slugger.slug(text)

              return (
                <Item
                  heading={heading}
                  activeAnchor={activeAnchor}
                  slug={slug}
                  key={slug}
                />
              )
            })}
          </ul>
        )}

        {hasMetaInfo ? (
          <div
            className={cn(
              'nextra-toc-meta',
              hasHeadings &&
                'mt-8 border-t bg-white pt-8 shadow-[0_-12px_16px_white] dark:bg-dark dark:shadow-[0_-12px_16px_#111]',
              'sticky bottom-0 pb-8 dark:border-neutral-800'
            )}
          >
            {config.feedbackLink ? (
              <Anchor
                className="mb-2 block text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
                className="mb-2 block text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                href={getEditUrl(filepathWithName)}
                newWindow
              >
                {renderComponent(config.footerEditLink)}
              </Anchor>
            ) : null}

            {config.tocExtraContent ? (
              <div className="pt-4 leading-4">
                {renderComponent(config.tocExtraContent)}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
