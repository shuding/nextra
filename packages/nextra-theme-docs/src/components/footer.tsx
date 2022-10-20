import React, { ReactElement } from 'react'
import cn from 'clsx'
import { useConfig } from '../contexts'
import { LocaleSwitch } from './locale-switch'
import { ThemeSwitch } from './theme-switch'
import { renderComponent } from '../utils'

export function Footer({ menu }: { menu?: boolean }): ReactElement {
  const config = useConfig()
  return (
    <footer className="nx-bg-gray-100 nx-pb-[env(safe-area-inset-bottom)] dark:nx-bg-neutral-900">
      <div
        className={cn(
          'nx-mx-auto nx-max-w-[90rem] nx-py-2 nx-px-4 nx-flex nx-gap-2',
          menu ? 'nx-flex' : 'nx-hidden'
        )}
      >
        {config.i18n.length > 0 && <LocaleSwitch options={config.i18n} />}
        {config.darkMode && <ThemeSwitch />}
      </div>
      <hr className="dark:nx-border-neutral-800" />
      <div
        className={cn(
          'nx-mx-auto nx-max-w-[90rem] nx-py-12 nx-flex nx-justify-center md:nx-justify-start nx-text-gray-600 dark:nx-text-gray-400',
          'nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {renderComponent(config.footer.text)}
      </div>
    </footer>
  )
}
