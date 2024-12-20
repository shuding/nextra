import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
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
        'nextra-steps x:ms-4 x:mb-12 x:border-s x:border-gray-200 x:ps-6',
        'x:dark:border-neutral-800',
        className
      )}
      style={{
        ...style,
        // @ts-expect-error -- fixme
        '--counter-id': id
      }}
      {...props}
    >
      {children}
    </div>
  )
}
