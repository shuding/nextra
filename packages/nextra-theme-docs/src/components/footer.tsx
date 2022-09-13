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
          'mx-auto max-w-[90rem] py-2 px-4 flex gap-2',
          menu ? 'flex' : 'hidden'
        )}
      >
        {config.i18n.length > 0 && <LocaleSwitch options={config.i18n} />}
        {config.darkMode && <ThemeSwitch />}
      </div>
      <hr className="dark:border-neutral-800" />
      <div
        className={cn(
          'mx-auto max-w-[90rem] py-12 flex justify-center md:justify-start text-gray-600 dark:text-gray-400',
          'pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {renderComponent(config.footer.text)}
      </div>
    </footer>
  )
}
