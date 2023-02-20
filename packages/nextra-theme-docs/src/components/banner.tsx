import type { ReactElement } from 'react'
import { XIcon } from 'nextra/icons'
import cn from 'clsx'
import { useConfig } from '../contexts'
import { renderComponent } from '../utils'

export function Banner(): ReactElement | null {
  const { banner } = useConfig()
  if (!banner.text) {
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
          'nextra-banner-container nx-sticky nx-top-0 nx-z-20 nx-flex nx-items-center md:nx-relative',
          'nx-h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:nx-hidden',
          'nx-text-slate-50 dark:nx-text-white nx-bg-neutral-900 dark:nx-bg-[linear-gradient(1deg,#383838,#212121)]',
          'nx-px-2 ltr:nx-pl-10 rtl:nx-pr-10 print:nx-hidden'
        )}
      >
        <div className="nx-w-full nx-truncate nx-px-4 nx-text-center nx-font-medium nx-text-sm">
          {renderComponent(banner.text)}
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
