import cn from 'clsx'
import { XIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { renderComponent } from '../utils'

export function Banner(): ReactElement | null {
  const { banner } = useConfig()
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
          'nextra-banner-container x-sticky x-top-0 x-z-20 x-flex nx-items-center md:x-relative',
          'nx-h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:nx-hidden',
          'nx-text-slate-50 dark:nx-text-white nx-bg-neutral-900 dark:nx-bg-[linear-gradient(1deg,#383838,#212121)]',
          'nx-px-2 ltr:nx-pl-10 rtl:nx-pr-10 print:nx-hidden'
        )}
      >
        <div className="nx-w-full nx-truncate nx-px-4 nx-text-center nx-font-medium nx-text-sm">
          {renderComponent(banner.content)}
        </div>
        {banner.dismissible && (
          <button
            type="button"
            aria-label="Dismiss banner"
            className="nx-w-8 nx-h-8 nx-opacity-80 hover:nx-opacity-100"
            onClick={() => {
              try {
                localStorage.setItem(banner.key, '0')
              } catch {
                /* ignore */
              }
              document.body.classList.add('nextra-banner-hidden')
            }}
          >
            <XIcon className="nx-mx-auto nx-h-4 nx-w-4" />
          </button>
        )}
      </div>
    </>
  )
}
