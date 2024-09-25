import cn from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { XIcon } from '../../icons/index.js'
import { CloseBannerButton } from './close-banner-button.js'

export function Banner({
  children,
  dismissible = true,
  storageKey = 'nextra-banner'
}: {
  children: ReactNode
  dismissible?: boolean
  storageKey?: string
}): ReactElement | null {
  if (!children) {
    return null
  }
  const hideBannerScript = `try{document.querySelector('.nextra-banner').classList.toggle('_hidden',localStorage.getItem(${JSON.stringify(storageKey)}))}catch(e){}`

  return (
    <div
      suppressHydrationWarning
      style={{ height: 'var(--nextra-banner-height)' }}
      className={cn(
        'nextra-banner max-md:_sticky _top-0 _z-20 _flex _items-center',
        '_text-slate-50 dark:_text-white _bg-neutral-900 dark:_bg-[linear-gradient(1deg,#383838,#212121)]',
        '_px-2 print:_hidden'
      )}
    >
      <div className="_w-full _whitespace-nowrap _overflow-x-auto _text-center _font-medium _text-sm">
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
