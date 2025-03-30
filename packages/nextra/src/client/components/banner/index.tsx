import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { XIcon } from '../../icons/index.js'
import { CloseBannerButton } from './close-banner-button.js'
import { ClientBanner } from './index.client'

const BANNER_CLASS_NAME = 'nextra-banner'

type BannerProps = {
  /** Content of the banner. */
  children: ReactNode
  /**
   * Closable banner or not.
   * @default true
   */
  dismissible?: boolean
  /**
   * Storage key to keep the banner state.
   * @default 'nextra-banner'
   */
  storageKey?: string
  /**
   * Theme of the banner.
   * @default 'auto'
   */
  theme?: 'dark' | 'light'
}

export const Banner: FC<BannerProps> = ({
  children,
  dismissible = true,
  storageKey = BANNER_CLASS_NAME,
  theme = 'auto'
}) => {
  if (!children) {
    return null
  }
  const hideBannerScript = `try{document.querySelector('.${BANNER_CLASS_NAME}').classList.toggle('x:hidden',localStorage.getItem(${JSON.stringify(storageKey)}))}catch(e){}`
  let themeClass

  switch (theme) {
    case 'dark':
      themeClass =
        'x:text-slate-50 x:bg-neutral-900 x:bg-[linear-gradient(1deg,#383838,#212121)]'
      break

    case 'light':
      themeClass = 'x:text-slate-700 x:bg-neutral-100'
      break

    default:
      themeClass =
        'x:text-slate-700 x:dark:text-slate-50 x:bg-neutral-100 dark:x:bg-neutral-900 x:dark:bg-[linear-gradient(1deg,#383838,#212121)]'
      break
  }

  return (
    <ClientBanner
      className={cn(
        BANNER_CLASS_NAME,
        'x:max-md:sticky x:top-0 x:z-30 x:flex x:items-center x:px-2 x:border-b nextra-border',
        themeClass,
        'x:print:[display:none]' // to not match `x:[.nextra-banner:not([class$=hidden])~&]` class
      )}
      // Because we update class in `<script>`
      suppressHydrationWarning
    >
      <div className="x:w-full x:text-center x:font-medium x:text-sm x:py-2.5">
        {children}
      </div>
      {dismissible && (
        <CloseBannerButton storageKey={storageKey}>
          <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
          <XIcon height="1em" />
        </CloseBannerButton>
      )}
    </ClientBanner>
  )
}
