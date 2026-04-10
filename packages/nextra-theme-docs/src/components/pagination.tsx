import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need `newWindow` prop
import NextLink from 'next/link'
import { ArrowRightIcon } from 'nextra/icons'
import type { FC } from 'react'
import { useConfig, useThemeConfig } from '../stores'
import { extractStringsFromReactNode } from '../utils'

export const Pagination: FC = () => {
  const { flatDocsDirectories, activeIndex } = useConfig().normalizePagesResult
  const { navigation } = useThemeConfig()

  // @ts-expect-error -- fixme
  let prev = navigation.prev && flatDocsDirectories[activeIndex - 1]
  // @ts-expect-error -- fixme
  let next = navigation.next && flatDocsDirectories[activeIndex + 1]

  if (prev && !prev.isUnderCurrentDocsTree) prev = false
  if (next && !next.isUnderCurrentDocsTree) next = false

  if (!prev && !next) return null

  return (
    <div
      className='nextra-pagination nextra-border'
    >
      {prev && (
        <NextLink
          href={prev.route}
          title={extractStringsFromReactNode(prev.title)}
          className='nextra-pagination-link nextra-pagination-prev'
          prefetch={false}
        >
          <ArrowRightIcon
            height="20"
            className='nextra-pagination-icon nextra-pagination-arrow-prev'
          />
          {prev.title}
        </NextLink>
      )}
      {next && (
        <NextLink
          href={next.route}
          title={extractStringsFromReactNode(next.title)}
          className='nextra-pagination-link nextra-pagination-next'
          prefetch={false}
        >
          {next.title}
          <ArrowRightIcon
            height="20"
            className='nextra-pagination-icon nextra-pagination-arrow-next'
          />
        </NextLink>
      )}
    </div>
  )
}
