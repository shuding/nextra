import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { ArrowRightIcon } from 'nextra/icons'
import renderComponent from './utils/render-component'
import { useConfig } from './config'
import { Item } from './utils/normalize-pages'
import LocaleSwitch from './locale-switch'
import ThemeSwitch from './theme-switch'

interface LinkProps {
  route: string
  title: string
  isRTL?: boolean | null
}

const NextLink = ({ route, title, isRTL }: LinkProps) => {
  return (
    <Link href={route}>
      <a
        className={cn(
          '-m-4 inline-flex items-center justify-end rounded p-4 text-base font-medium text-gray-600 no-underline transition-colors hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500 md:text-lg',
          { 'ml-2': !isRTL, 'mr-2': isRTL }
        )}
        title={title}
      >
        {title}
        <ArrowRightIcon
          height={20}
          className={cn('inline flex-shrink-0 transform', {
            'mr-1 rotate-180': isRTL,
            'ml-1': !isRTL
          })}
        />
      </a>
    </Link>
  )
}

const PrevLink = ({ route, title, isRTL }: LinkProps) => {
  return (
    <Link href={route}>
      <a
        className={cn(
          '-m-4 flex items-center rounded p-4 text-base font-medium text-gray-600 no-underline transition-colors hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500 md:text-lg',
          { 'mr-2': !isRTL, 'ml-2': isRTL }
        )}
        title={title}
      >
        <ArrowRightIcon
          height={20}
          className={cn('inline flex-shrink-0 transform', {
            'mr-1 rotate-180': !isRTL,
            'ml-1': isRTL
          })}
        />
        {title}
      </a>
    </Link>
  )
}

interface NavLinkProps {
  isRTL?: boolean | null
  currentIndex: number
  flatDirectories: Item[]
}
export const NavLinks = ({
  flatDirectories,
  currentIndex,
  isRTL
}: NavLinkProps) => {
  const config = useConfig()
  const prev = config.prevLinks ? flatDirectories[currentIndex - 1] : null
  const next = config.nextLinks ? flatDirectories[currentIndex + 1] : null

  if (!prev && !next) return null

  return (
    <div className="nextra-navigation-links mb-8 flex flex-row items-center justify-between border-t pt-8 dark:border-neutral-800">
      <div className="flex min-w-0 flex-1 justify-start">
        {prev ? (
          <PrevLink route={prev.route} title={prev.title} isRTL={isRTL} />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        {next ? (
          <NextLink route={next.route} title={next.title} isRTL={isRTL} />
        ) : null}
      </div>
    </div>
  )
}

const Footer: React.FC<PropsWithChildren<{ menu?: boolean }>> = ({ menu }) => {
  const { locale = 'en-US' } = useRouter()
  const config = useConfig()

  return (
    <footer className="bg-gray-100 pb-[env(safe-area-inset-bottom)] dark:bg-neutral-900">
      <div
        className={cn(
          'hidden border-b py-2 dark:border-neutral-800 md:block',
          menu ? '' : 'md:hidden'
        )}
      >
        <div className="mx-auto max-w-[90rem]">
          <div className="inline-flex px-4">
            {config.i18n ? (
              <div className="relative flex-1">
                <LocaleSwitch options={config.i18n} />
              </div>
            ) : null}
            {config.darkMode ? (
              <div className="relative grow-0">
                <ThemeSwitch lite={false} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[90rem] py-12 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        <div className="flex flex-col-reverse items-center justify-between md:flex-row md:items-end">
          <span className="text-gray-600 dark:text-gray-400">
            {renderComponent(config.footerText, { locale })}
          </span>
          <div className="mt-6" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
