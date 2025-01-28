import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { LocaleSwitch } from '../locale-switch'
import { ThemeSwitch } from '../theme-switch'
import { Switchers } from './switchers'

export const Footer: FC<ComponentProps<'footer'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className="x:bg-gray-100 x:pb-[env(safe-area-inset-bottom)] x:dark:bg-neutral-900 x:print:bg-transparent">
      <Switchers>
        <div className="x:mx-auto x:flex x:max-w-(--nextra-content-width) x:gap-2 x:py-2 x:px-4">
          <LocaleSwitch />
          <ThemeSwitch />
        </div>
      </Switchers>
      <hr className="nextra-border" />
      {children && (
        <footer
          className={cn(
            'x:mx-auto x:flex x:max-w-(--nextra-content-width) x:justify-center x:py-12 x:text-gray-600 x:dark:text-gray-400 x:md:justify-start',
            'x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]',
            className
          )}
          {...props}
        >
          {children}
        </footer>
      )}
    </div>
  )
}
