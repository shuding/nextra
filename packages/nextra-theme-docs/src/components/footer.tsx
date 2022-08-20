import React, { ReactElement } from 'react'
import cn from 'clsx'
import { useConfig } from '../contexts'
import { LocaleSwitch } from './locale-switch'
import { ThemeSwitch } from './theme-switch'
import { renderComponent } from '../utils'

export function Footer({ menu }: { menu?: boolean }): ReactElement {
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
            {config.i18n.length > 0 && (
              <div className="relative flex-1">
                <LocaleSwitch options={config.i18n} />
              </div>
            )}
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
            {renderComponent(config.footer.text)}
          </span>
          <div className="mt-6" />
        </div>
      </div>
    </footer>
  )
}
