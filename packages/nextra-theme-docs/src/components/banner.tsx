import React, { ReactElement } from 'react'
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
          'nx-relative nx-z-20 nx-flex nx-items-center nx-justify-center',
          'nx-bg-neutral-900 nx-text-sm nx-font-medium nx-text-slate-50',
          'nx-h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:nx-hidden',
          'dark:nx-bg-[linear-gradient(1deg,#383838,#212121)] dark:nx-text-white',
          'nx-py-1 nx-pl-[max(env(safe-area-inset-left),2.5rem)] nx-pr-[max(env(safe-area-inset-right),2.5rem)]'
        )}
      >
        <div className="nx-max-w-[90rem] nx-truncate">
          {renderComponent(banner.text)}
        </div>
        {banner.dismissible && (
          <button
            className="nx-absolute nx-opacity-80 hover:nx-opacity-100 ltr:nx-right-0 rtl:nx-left-0"
            onClick={() => {
              try {
                localStorage.setItem(banner.key, '0')
              } catch {}
              document.body.classList.add('nextra-banner-hidden')
            }}
          >
            <XIcon className="nx-mx-4 nx-h-4 nx-w-4" />
          </button>
        )}
      </div>
    </>
  )
}
