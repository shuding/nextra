import cn from 'clsx'
import { XIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useThemeConfig } from '../contexts'
import { renderComponent } from '../utils'

export function Banner(): ReactElement | null {
  const { banner } = useThemeConfig()
  if (!banner.content) {
    return null
  }
  const hideBannerScript = `try{if(localStorage.getItem(${JSON.stringify(
    banner.key
  )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
      <div
        className={cn(
          'nextra-banner-container max-md:_sticky _top-0 _z-20 _flex _items-center',
          '_h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:_hidden',
          '_text-slate-50 dark:_text-white _bg-neutral-900 dark:_bg-[linear-gradient(1deg,#383838,#212121)]',
          '_px-2 _ps-10 print:_hidden'
        )}
      >
        <div className="_w-full _truncate _text-center _font-medium _text-sm">
          {renderComponent(banner.content)}
        </div>
        {banner.dismissible && (
          <button
            type="button"
            aria-label="Dismiss banner"
            className="_w-8 _h-8 _opacity-80 hover:_opacity-100"
            onClick={() => {
              try {
                localStorage.setItem(banner.key, '0')
              } catch {
                /* ignore */
              }
              document.body.classList.add('nextra-banner-hidden')
            }}
          >
            <XIcon className="_mx-auto _h-4 _w-4" />
          </button>
        )}
      </div>
    </>
  )
}
