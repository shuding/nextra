import cn from 'clsx'
import type { ComponentProps, CSSProperties, FC } from 'react'
import { useId } from 'react'

export const Steps: FC<ComponentProps<'div'>> = ({
  children,
  className,
  style,
  ...props
}) => {
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
