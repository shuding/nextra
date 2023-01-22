import type { ReactElement, ReactNode } from 'react'
import cn from 'clsx'

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
        'nextra-bleed nx-relative -nx-mx-6 nx-mt-6 md:-nx-mx-8 2xl:-nx-mx-24',
        full && [
          // 'md:mx:[calc(-50vw+50%+8rem)',
          'ltr:xl:nx-ml-[calc(50%-50vw+16rem)] ltr:xl:nx-mr-[calc(50%-50vw)]',
          'rtl:xl:nx-ml-[calc(50%-50vw)] rtl:xl:nx-mr-[calc(50%-50vw+16rem)]'
        ]
      )}
    >
      {children}
    </div>
  )
}
