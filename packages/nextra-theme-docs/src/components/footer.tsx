import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useConfig } from '../config'
import { LocaleSwitch } from './locale-switch'
import { ThemeSwitch } from './theme-switch'
import renderComponent from '../utils/render-component'

export function Footer({ menu }: { menu?: boolean }): ReactElement {
  const { locale = 'en-US' } = useRouter()
  const config = useConfig()

  return (
    <footer className="bg-gray-100 pb-[env(safe-area-inset-bottom)] dark:bg-neutral-900">
      <div
        className={cn(
          'hidden border-b py-2 dark:border-neutral-800 md:block',
          !menu && 'md:hidden'
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
