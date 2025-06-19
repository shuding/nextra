/* TODO: eslint typescript-sort-keys/interface: error */
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need `newWindow` prop
import NextLink from 'next/link'
import { Anchor } from 'nextra/components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import type { FC, ReactNode } from 'react'
import { ClientNavbar } from './index.client'

interface NavbarProps {
  /**
   * Extra content after the last icon.
   */
  children?: ReactNode
  /**
   * Specifies whether the logo should have a link or provides the URL for the logo's link.
   * @default true
   */
  logoLink?: string | boolean
  /**
   * Logo of the website.
   */
  logo: ReactNode
  /**
   * URL of the project homepage.
   */
  projectLink?: string
  /**
   * Icon of the project link.
   * @default <GitHubIcon />
   */
  projectIcon?: ReactNode
  /**
   * URL of the chat link.
   */
  chatLink?: string
  /**
   * Icon of the chat link.
   * @default <DiscordIcon />
   */
  chatIcon?: ReactNode
  /**
   * CSS class name.
   */
  className?: string
  /**
   * Aligns navigation links to the specified side.
   * @default 'right'
   */
  align?: 'left' | 'right'
}

// Fix compiler error
// Expression type `JSXElement` cannot be safely reordered
const defaultGitHubIcon = (
  <GitHubIcon height="24" aria-label="Project repository" />
)
const defaultChatIcon = <DiscordIcon width="24" />

export const Navbar: FC<NavbarProps> = ({
  children,
  logoLink = true,
  logo,
  projectLink,
  projectIcon = defaultGitHubIcon,
  chatLink,
  chatIcon = defaultChatIcon,
  className,
  align = 'right'
}) => {
  const logoClass = cn(
    'x:flex x:items-center',
    align === 'left' ? 'x:max-md:me-auto' : 'x:me-auto'
  )
  return (
    <header
      className={cn(
        'nextra-navbar x:sticky x:top-0 x:z-30 x:w-full x:bg-transparent x:print:hidden',
        'x:max-md:[.nextra-banner:not([class$=hidden])~&]:top-(--nextra-banner-height)'
      )}
    >
      <div
        className={cn(
          'nextra-navbar-blur',
          'x:absolute x:-z-1 x:size-full',
          'nextra-border x:border-b',
          'x:backdrop-blur-md x:bg-nextra-bg/70'
        )}
      />
      <nav
        style={{ height: 'var(--nextra-navbar-height)' }}
        className={cn(
          'x:mx-auto x:flex x:max-w-(--nextra-content-width) x:items-center x:gap-4 x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]',
          'x:justify-end',
          className
        )}
      >
        {logoLink ? (
          <NextLink
            href={typeof logoLink === 'string' ? logoLink : '/'}
            className={cn(
              logoClass,
              'x:transition-opacity x:focus-visible:nextra-focus x:hover:opacity-75'
            )}
            aria-label="Home page"
          >
            {logo}
          </NextLink>
        ) : (
          <div className={logoClass}>{logo}</div>
        )}
        <ClientNavbar className={align === 'left' ? 'x:me-auto' : ''}>
          {projectLink && <Anchor href={projectLink}>{projectIcon}</Anchor>}
          {chatLink && <Anchor href={chatLink}>{chatIcon}</Anchor>}
          {children}
        </ClientNavbar>
      </nav>
    </header>
  )
}
