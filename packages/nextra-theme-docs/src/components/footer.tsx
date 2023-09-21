import cn from 'clsx'
import type { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { renderComponent } from '../utils'
import { LocaleSwitch } from './locale-switch'

export function Footer({ menu }: { menu?: boolean }): ReactElement {
  const config = useConfig()
  return (
    <footer className="_bg-gray-100 _pb-[env(safe-area-inset-bottom)] dark:_bg-neutral-900 print:_bg-transparent">
      <div
        className={cn(
          '_mx-auto _flex _max-w-[90rem] _gap-2 _py-2 _px-4',
          menu && (config.i18n.length > 0 || config.darkMode)
            ? '_flex'
            : '_hidden'
        )}
      >
        <LocaleSwitch />
        {config.darkMode && renderComponent(config.themeSwitch.component)}
      </div>
      <hr className="dark:_border-neutral-800" />
      <div
        className={cn(
          '_mx-auto _flex _max-w-[90rem] _justify-center _py-12 _text-gray-600 dark:_text-gray-400 md:_justify-start',
          '_pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {renderComponent(config.footer.content)}
      </div>
    </footer>
  )
}
