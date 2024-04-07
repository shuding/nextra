import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { Switchers } from './switchers'

export function Footer({
  children,
  className
}: ComponentProps<'footer'>): ReactElement {
  return (
    <div className="_bg-gray-100 _pb-[env(safe-area-inset-bottom)] dark:_bg-neutral-900 print:_bg-transparent">
      <Switchers />
      <hr className="dark:_border-neutral-800" />
      <footer
        className={cn(
          '_mx-auto _flex _max-w-[90rem] _justify-center _py-12 _text-gray-600 dark:_text-gray-400 md:_justify-start',
          '_pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]',
          className
        )}
      >
        {children}
      </footer>
    </div>
  )
}
