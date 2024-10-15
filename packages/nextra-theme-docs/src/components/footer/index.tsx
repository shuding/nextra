import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { LocaleSwitch } from '../locale-switch'
import { ThemeSwitch } from '../theme-switch'
import { Switchers } from './switchers'

export const Footer: FC<ComponentProps<'footer'>> = ({
  className,
  ...props
}) => {
  return (
    <div className="_bg-gray-100 _pb-[env(safe-area-inset-bottom)] dark:_bg-neutral-900 print:_bg-transparent">
      <Switchers>
        <div className="_mx-auto _flex _max-w-[90rem] _gap-2 _py-2 _px-4">
          <LocaleSwitch />
          <ThemeSwitch />
        </div>
      </Switchers>
      <hr className="dark:_border-neutral-800" />
      <footer
        className={cn(
          '_mx-auto _flex _max-w-[90rem] _justify-center _py-12 _text-gray-600 dark:_text-gray-400 md:_justify-start',
          '_pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]',
          className
        )}
        {...props}
      />
    </div>
  )
}
