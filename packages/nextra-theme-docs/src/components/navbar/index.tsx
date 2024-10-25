import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import type { FC, ReactNode } from 'react'
import { Anchor } from '../anchor'
import { ClientNavbar } from './index.client'

type NavbarProps = {
  children?: ReactNode
  logoLink?: string | boolean
  logo?: ReactNode
  projectLink?: string
  projectIcon?: ReactNode
  chatLink?: string
  chatIcon?: ReactNode
}

export const Navbar: FC<NavbarProps> = ({
  children,
  logoLink = true,
  logo = (
    <>
      <span className="_font-extrabold">Nextra</span>
      <span className="_ms-2 max-md:_hidden _font-normal _text-gray-600">
        The Next Docs Builder
      </span>
    </>
  ),
  projectLink,
  projectIcon = <GitHubIcon height="24" />,
  chatLink,
  chatIcon = <DiscordIcon width="24" />
}) => {
  return (
    <header
      className={cn(
        'nextra-navbar _sticky _top-0 _z-20 _w-full _bg-transparent print:_hidden',
        'max-md:[.nextra-banner:not(.\\_hidden)~&]:_top-10'
      )}
    >
      <div
        className={cn(
          'nextra-navbar-blur',
          '_pointer-events-none _absolute _z-[-1] _size-full',
          '_shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)]',
          'dark:_shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]',
          'contrast-more:_shadow-[0_0_0_1px_#000]',
          'contrast-more:dark:_shadow-[0_0_0_1px_#fff]',
          '_backdrop-blur-md _bg-[rgba(var(--nextra-bg),.7)]'
        )}
      />
      <nav
        style={{ height: 'var(--nextra-navbar-height)' }}
        className="_mx-auto _flex _max-w-[90rem] _items-center _justify-end _gap-4 _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]"
      >
        {logoLink ? (
          <NextLink
            href={typeof logoLink === 'string' ? logoLink : '/'}
            className="focus-visible:nextra-focus _flex _items-center hover:_opacity-75 _me-auto"
          >
            {logo}
          </NextLink>
        ) : (
          <div className="_flex _items-center _me-auto">{logo}</div>
        )}
        <ClientNavbar>
          {projectLink && (
            <Anchor href={projectLink} newWindow>
              {projectIcon}
            </Anchor>
          )}
          {chatLink && (
            <Anchor href={chatLink} newWindow>
              {chatIcon}
            </Anchor>
          )}
          {children}
        </ClientNavbar>
      </nav>
    </header>
  )
}
