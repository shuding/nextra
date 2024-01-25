import cn from 'clsx'
import { XIcon } from 'nextra/icons'
import type { ReactElement, ReactNode } from 'react'
import { renderComponent } from '../../utils'
import { CloseBannerButton } from './close-banner-button'

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
  const hideBannerScript = `try{if(localStorage.getItem(${JSON.stringify(
    storageKey
  )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
      <div
        className={cn(
          'nextra-banner-container max-md:_sticky _top-0 _z-20 _flex _items-center',
          '_h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:_hidden',
          '_text-slate-50 dark:_text-white _bg-neutral-900 dark:_bg-[linear-gradient(1deg,#383838,#212121)]',
          '_px-2 ltr:_pl-10 rtl:_pr-10 print:_hidden'
        )}
      >
        <div className="_w-full _truncate _text-center _font-medium _text-sm">
          {renderComponent(children)}
        </div>
        {dismissible && (
          <CloseBannerButton storageKey={storageKey}>
            <XIcon className="_mx-auto _h-4 _w-4" />
          </CloseBannerButton>
        )}
      </div>
    </>
  )
}
