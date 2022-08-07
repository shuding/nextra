import React, { ReactElement } from 'react'
import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import { useConfig } from '../config'
import { Item } from '../utils/normalize-pages'
import { Anchor } from './anchor'

interface NavLinkProps {
  isRTL?: boolean | null
  currentIndex: number
  flatDirectories: Item[]
}

export const NavLinks = ({
  flatDirectories,
  currentIndex,
  isRTL
}: NavLinkProps): ReactElement | null => {
  const config = useConfig()
  const prev = config.prevLinks ? flatDirectories[currentIndex - 1] : null
  const next = config.nextLinks ? flatDirectories[currentIndex + 1] : null

  if (!prev && !next) return null

  return (
    <div className="nextra-navigation-links mb-8 flex flex-row items-center justify-between border-t pt-8 dark:border-neutral-800">
      <div className="flex min-w-0 flex-1 justify-start">
        {prev ? (
          <Anchor
            href={prev.route}
            title={prev.title}
            className={cn(
              '-m-4 flex items-center rounded p-4 text-base font-medium text-gray-600 no-underline transition-colors hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500 md:text-lg',
              isRTL ? 'ml-2' : 'mr-2'
            )}
          >
            <ArrowRightIcon
              height={20}
              className={cn(
                'inline flex-shrink-0 transform',
                isRTL ? 'ml-1' : 'mr-1 rotate-180'
              )}
            />
            {prev.title}
          </Anchor>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        {next ? (
          <Anchor
            href={next.route}
            title={next.title}
            className={cn(
              '-m-4 inline-flex items-center justify-end rounded p-4 text-base font-medium text-gray-600 no-underline transition-colors hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500 md:text-lg',
              isRTL ? 'mr-2' : 'ml-2'
            )}
          >
            {next.title}
            <ArrowRightIcon
              height={20}
              className={cn(
                'inline flex-shrink-0 transform',
                isRTL ? 'mr-1 rotate-180' : 'ml-1'
              )}
            />
          </Anchor>
        ) : null}
      </div>
    </div>
  )
}
