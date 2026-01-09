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
    <div className="nextra-footer">
      <Switchers>
        <div className="nextra-footer-switchers">
          <LocaleSwitch />
          <ThemeSwitch />
        </div>
      </Switchers>
      <hr className="nextra-border" />
      {children && (
        <footer
          className={cn(
            'nextra-footer-footer',
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
