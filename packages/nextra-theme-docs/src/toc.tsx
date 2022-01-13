import React from 'react'
import cn from 'classnames'
import Slugger from 'github-slugger'
import { Heading } from 'nextra'
import parseGitUrl from 'parse-git-url'
import { useRouter } from 'next/router'

import renderComponent from './utils/render-component'
import getHeadingText from './utils/get-heading-text'
import { useActiveAnchor } from './misc/active-anchor'
import { useConfig } from './config'
import useMounted from './utils/use-mounted'

const createEditUrl = (repository?: string, filepath?: string) => {
  const repo = parseGitUrl(repository || '')
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${repo.name}/blob/${
        repo.branch || 'main'
      }/${repo.subdir || 'pages'}${filepath}`
    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${repo.name}/-/blob/${
        repo.branch || 'master'
      }/${repo.subdir || 'pages'}${filepath}`
  }

  return '#'
}

const createFeedbackUrl = (
  repository?: string,
  filepath?: string,
  labels?: string
) => {
  const mounted = useMounted()
  if (!mounted) return '#'

  const repo = parseGitUrl(repository || '')
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  const pageTitle = document.title

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${
        repo.name
      }/issues/new?title=${encodeURIComponent(
        `Feedback for “${pageTitle}”`
      )}&labels=${labels || ''}`
    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${repo.name}/-/blob/${
        repo.branch || 'master'
      }/${repo.subdir || 'pages'}${filepath}`
  }

  return '#'
}

const EditPageLink = ({
  repository,
  text,
  filepath
}: {
  repository?: string
  text: string
  filepath: string
}) => {
  const url = createEditUrl(repository, filepath)
  const { locale } = useRouter()
  return (
    <a
      className="text-xs font-medium no-underline block text-gray-500 mb-2 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {text
        ? renderComponent(text, {
            locale
          })
        : 'Edit this page'}
    </a>
  )
}

const FeedbackLink = ({
  repository,
  text,
  filepath,
  labels
}: {
  repository?: string
  text: string
  filepath: string
  labels?: string
}) => {
  const url = createFeedbackUrl(repository, filepath, labels)
  const { locale } = useRouter()
  return (
    <a
      className="text-xs font-medium no-underline block text-gray-500 mb-2 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {text
        ? renderComponent(text, {
            locale
          })
        : 'Feedback'}
    </a>
  )
}

const indent = (level: number) => {
  switch (level) {
    case 3:
      return { marginLeft: '1rem ' }
    case 4:
      return { marginLeft: '2rem ' }
    case 5:
      return { marginLeft: '3rem ' }
    case 6:
      return { marginLeft: '4rem ' }
  }
  return {}
}

const emptyHeader: any[] = []

export default function ToC({
  headings = emptyHeader,
  filepathWithName
}: {
  headings: Heading[] | null
  filepathWithName: string
}) {
  const slugger = new Slugger()
  const activeAnchor = useActiveAnchor()
  const config = useConfig()
  const hasMetaInfo = config.feedbackLink || config.footerEditLink

  return (
    <div className="w-64 hidden xl:block text-sm px-4">
      <div className="overflow-y-auto sticky max-h-[calc(var(--vh)-4rem)] top-16 pt-8 pb-10">
        {headings ? (
          <ul className="m-0 list-none">
            <p className="font-semibold tracking-tight mb-4">On This Page</p>
            {headings
              .filter(
                heading => heading.type === 'heading' && heading.depth > 1
              )
              .map(heading => {
                const text = getHeadingText(heading)
                const slug = slugger.slug(text)
                const state = activeAnchor[slug]
                return (
                  <li key={slug} style={indent(heading.depth)}>
                    <a
                      href={`#${slug}`}
                      className={cn(
                        'no-underline inline-block',
                        heading.depth === 2 ? 'font-semibold' : '',
                        state && state.isActive
                          ? 'text-prime-500 subpixel-antialiased'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                      )}
                      aria-selected={state?.isActive}
                    >
                      {text}
                    </a>
                  </li>
                )
              })}
          </ul>
        ) : null}

        {hasMetaInfo ? (
          <hr className="dark:border-prime-100 dark:border-opacity-10" />
        ) : null}

        {config.feedbackLink ? (
          <FeedbackLink
            filepath={filepathWithName}
            repository={config.docsRepositoryBase}
            labels={config.feedbackLabels}
            text={config.feedbackLink}
          />
        ) : null}

        {config.footerEditLink ? (
          <EditPageLink
            filepath={filepathWithName}
            repository={config.docsRepositoryBase}
            text={config.footerEditLink}
          />
        ) : null}
      </div>
    </div>
  )
}
