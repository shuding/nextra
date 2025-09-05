import cn from 'clsx'
import type { FC, HTMLAttributes } from 'react'
import { XIcon } from '../../icons/index.js'
import { CloseBannerButton } from './close-banner-button.js'
import { ClientBanner } from './index.client'

const BANNER_CLASS_NAME = 'nextra-banner'

type BannerProps = HTMLAttributes<HTMLDivElement> & {
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
}

/**
 * A built-in component to show a banner on the top of the website. It can be used to show a warning
 * or a notice.
 *
 * @example
 * ### Banner key
 *
 * A banner can be dismissed. By default, it's used by
 * [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
 * to keep the banner state on the client.
 *
 * If you have updated your banner text, you should change the key to make sure the banner is shown
 * again. The best practice is to always use a descriptive key for the current text, for example:
 *
 * ![Banner](https://nextra.site/assets/docs/banner.png)
 *
 * ```jsx filename="app/layout.jsx" {7-11}
 * import { Layout } from 'my-nextra-theme'
 * import { Banner } from 'nextra/components'
 *
 * export default function MyLayout({ children, ...props }) {
 *   return (
 *     <Layout>
 *       <Banner storageKey="2.0-release">
 *         <a href="https://nextra.site" target="_blank">
 *           🎉 Nextra 2.0 is released. Read more →
 *         </a>
 *       </Banner>
 *       {children}
 *     </Layout>
 *   )
 * }
 * ```
 */
export const Banner: FC<BannerProps> = ({
  dismissible = true,
  storageKey = BANNER_CLASS_NAME,
  className,
  ...props
}) => {
  if (!props.children) {
    return null
  }
  const hideBannerScript = `try{document.querySelector('.${BANNER_CLASS_NAME}').classList.toggle('x:hidden',localStorage.getItem(${JSON.stringify(storageKey)}))}catch(e){}`

  return (
    <ClientBanner
      className={cn(
        BANNER_CLASS_NAME,
        'x:max-md:sticky x:top-0 x:z-30 x:flex x:items-center x:px-2',
        'x:text-slate-50 x:dark:text-white x:bg-neutral-900 x:dark:bg-[linear-gradient(1deg,#383838,#212121)]',
        'x:print:[display:none]' // to not match `x:[.nextra-banner:not([class$=hidden])~&]` class
      )}
      // Because we update class in `<script>`
      suppressHydrationWarning
    >
      <div
        className={cn(
          'x:w-full x:text-center x:font-medium x:text-sm x:py-2.5',
          className
        )}
        {...props}
      />
      {dismissible && (
        <CloseBannerButton storageKey={storageKey}>
          <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
          <XIcon height="1em" />
        </CloseBannerButton>
      )}
    </ClientBanner>
  )
}
