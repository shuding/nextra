import cn from 'clsx'
import type { FC, ReactNode } from 'react'

export const Bleed: FC<{
  full: boolean
  children: ReactNode
}> = ({ full, children }) => {
  return (
    <div
      className={cn(
        'nextra-bleed x:relative x:-mx-4 x:mt-6 x:md:-mx-8 x:2xl:-mx-24',
        'x:z-1', // for firefox https://github.com/shuding/nextra/issues/2824
        full && [
          // 'md:mx:[calc(-50vw+50%+8rem)',
          'x:xl:me-[calc(50%-50vw)] x:xl:ms-[calc(50%-50vw+16rem)]'
        ]
      )}
    >
      {children}
    </div>
  )
}
