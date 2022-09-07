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
          'relative z-20 flex justify-center items-center',
          'bg-neutral-900 text-sm text-slate-50 font-medium',
          'h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:hidden',
          'dark:bg-[linear-gradient(1deg,#383838,#212121)] dark:text-white',
          'py-1 pl-[max(env(safe-area-inset-left),2.5rem)] pr-[max(env(safe-area-inset-right),2.5rem)]'
        )}
      >
        <div className="max-w-[90rem] truncate">
          {renderComponent(banner.text)}
        </div>
        <button
          className="opacity-80 absolute ltr:right-0 rtl:left-0 hover:opacity-100"
          onClick={() => {
            try {
              localStorage.setItem(banner.key, '0')
            } catch {}
            document.body.classList.add('nextra-banner-hidden')
          }}
        >
          <XIcon className="h4 w-4 mx-4" />
        </button>
      </div>
    </>
  )
}
