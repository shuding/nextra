import cn from 'clsx'
import type { ComponentPropsWithoutRef, FC } from 'react'

export const Tree: FC<ComponentPropsWithoutRef<'ul'>> = ({
  className,
  ...props
}) => {
  return (
    <ul
      className={cn(
        'nextra-filetree x:mt-6 x:select-none x:text-sm x:text-gray-800 x:dark:text-gray-300',
        'not-prose', // for nextra-theme-blog
        'x:rounded-lg x:border x:px-4 x:py-3 x:inline-flex x:flex-col x:gap-2',
        'nextra-border',
        className
      )}
      {...props}
    />
  )
}
