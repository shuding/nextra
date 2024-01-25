import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import type { ReactElement, ReactNode } from 'react'
import { Navbar as NavbarInner } from './navbar'

type NavbarProps = {
  children?: ReactNode
  logoLink?: string | boolean
  logo?: ReactNode
}

export function Navbar({
  children,
  logoLink = true,
  logo = (
    <>
      <span className="_font-extrabold">Nextra</span>
      <span className="_ml-2 max-md:_hidden _font-normal _text-gray-600">
        The Next Docs Builder
      </span>
    </>
  )
}: NavbarProps): ReactElement {
  return (
    <div className="nextra-nav-container _sticky _top-0 _z-20 _w-full _bg-transparent print:_hidden">
      <div
        className={cn(
          'nextra-nav-container-blur',
          '_pointer-events-none _absolute _z-[-1] _size-full _bg-white dark:_bg-dark',
          '_shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:_shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]',
          'contrast-more:_shadow-[0_0_0_1px_#000] contrast-more:dark:_shadow-[0_0_0_1px_#fff]'
        )}
      />
      <nav className="_mx-auto _flex _h-[var(--nextra-navbar-height)] _max-w-[90rem] _items-center _justify-end _gap-4 _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]">
        {logoLink ? (
          <NextLink
            href={typeof logoLink === 'string' ? logoLink : '/'}
            className="_flex _items-center hover:_opacity-75 ltr:_mr-auto rtl:_ml-auto"
          >
            {logo}
          </NextLink>
        ) : (
          <div className="_flex _items-center ltr:_mr-auto rtl:_ml-auto">
            {logo}
          </div>
        )}
        <NavbarInner>{children}</NavbarInner>
      </nav>
    </div>
  )
}
