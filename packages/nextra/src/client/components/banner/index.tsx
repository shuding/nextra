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
  const hideBannerScript = `try{if(localStorage.getItem(${JSON.stringify(storageKey)})){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`

  return (
    <div
      className={cn(
        'nextra-banner-container max-md:_sticky _top-0 _z-20 _flex _items-center',
        '_h-[--nextra-banner-height] [.nextra-banner-hidden_&]:_hidden',
        '_text-slate-50 dark:_text-white _bg-neutral-900 dark:_bg-[linear-gradient(1deg,#383838,#212121)]',
        '_px-2 print:_hidden'
      )}
    >
      <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
      <div className="_w-full _whitespace-nowrap _overflow-x-auto _text-center _font-medium _text-sm">
        {children}
      </div>
      {dismissible && (
        <CloseBannerButton storageKey={storageKey}>
          <XIcon height="16" />
        </CloseBannerButton>
      )}
    </div>
  )
}
