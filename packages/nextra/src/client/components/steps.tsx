import cn from 'clsx'
import type { ComponentProps, CSSProperties, ReactElement } from 'react'
import { useId } from 'react'

export function Steps({
  children,
  className,
  style,
  ...props
}: ComponentProps<'div'>): ReactElement {
  const id = useId().replaceAll(':', '')
  return (
    <div
      className={cn(
        'nextra-steps _ms-4 _mb-12 _border-s _border-gray-200 _ps-6',
        'dark:_border-neutral-800',
        className
      )}
      style={
        {
          ...style,
          '--counter-id': id
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}
