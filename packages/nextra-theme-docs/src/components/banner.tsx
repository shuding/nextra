import React from 'react'
import { useRouter } from 'next/router'
import { XIcon } from 'nextra/icons'
import { useConfig } from '../config'
import renderComponent from '../utils/render-component'

const Banner = () => {
  const { bannerKey, banner } = useConfig()
  const { locale = 'en-US' } = useRouter()

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem(${JSON.stringify(
            bannerKey
          )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`
        }}
      />
      {banner && bannerKey ? (
        <div className="nextra-banner-container sticky top-0 z-20 flex h-10 items-center bg-neutral-900 pl-10 text-sm text-slate-50  dark:bg-[linear-gradient(1deg,#383838,#212121)] dark:text-white md:relative">
          <div className="mx-auto w-full max-w-[90rem] truncate whitespace-nowrap py-1 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] text-center font-medium">
            {renderComponent(banner, { locale })}
          </div>
          <button
            className="mr-2 w-8 opacity-80 hover:opacity-100"
            onClick={() => {
              try {
                localStorage.setItem(bannerKey, '0')
              } catch {}
              document.body.classList.add('nextra-banner-hidden')
            }}
          >
            <XIcon className="h4 mx-auto w-4" />
          </button>
        </div>
      ) : null}
    </>
  )
}

export default Banner
