import cn from 'clsx'
import type { ReactElement, ReactNode } from 'react'

export function Bleed({
  full,
  children
}: {
  full: boolean
  children: ReactNode
}): ReactElement {
  return (
    <div
      className={cn(
        'nextra-bleed _relative _-mx-6 _mt-6 md:_-mx-8 2xl:_-mx-24',
        full && [
          // 'md:mx:[calc(-50vw+50%+8rem)',
          'ltr:xl:_ml-[calc(50%-50vw+16rem)] ltr:xl:_mr-[calc(50%-50vw)]',
          'rtl:xl:_ml-[calc(50%-50vw)] rtl:xl:_mr-[calc(50%-50vw+16rem)]'
        ]
      )}
    >
      {children}
    </div>
  )
}
