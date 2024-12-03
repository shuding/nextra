import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { XIcon } from '../../icons/index.js'
import { CloseBannerButton } from './index.client.js'

const CLASS_NAME = 'nextra-banner'

export const Banner: FC<{
  children: ReactNode
  dismissible?: boolean
  storageKey?: string
}> = ({ children, dismissible = true, storageKey = 'nextra-banner' }) => {
  if (!children) {
    return null
  }
  const hideBannerScript = `try{document.querySelector('.${CLASS_NAME}').classList.toggle('x:hidden',localStorage.getItem(${JSON.stringify(storageKey)}))}catch(e){}`

  return (
    <div
      // Because we update class in `<script>`
      suppressHydrationWarning
      style={{ height: 'var(--nextra-banner-height)' }}
      className={cn(
        CLASS_NAME,
        'x:max-md:sticky x:top-0 x:z-20 x:flex x:items-center',
        'x:text-slate-50 x:dark:text-white x:bg-neutral-900 x:dark:bg-[linear-gradient(1deg,#383838,#212121)]',
        'x:px-2 x:print:hidden'
      )}
    >
      <div className="x:w-full x:whitespace-nowrap x:overflow-x-auto x:text-center x:font-medium x:text-sm">
        {children}
      </div>
      {dismissible && (
        <CloseBannerButton storageKey={storageKey}>
          <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
          <XIcon height="16" />
        </CloseBannerButton>
      )}
    </div>
  )
}
