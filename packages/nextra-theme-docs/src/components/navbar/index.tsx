import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { Anchor } from 'nextra/components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import { element, reactNode } from 'nextra/schemas'
import type { FC } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { ClientNavbar } from './index.client'

const propsSchema = z.strictObject({
  children: reactNode,
  logoLink: z.union([z.string(), z.boolean()]).default(true),
  logo: element,
  projectLink: z.string().optional(),
  projectIcon: reactNode.default(<GitHubIcon height="24" />),
  chatLink: z.string().optional(),
  chatIcon: reactNode.default(<DiscordIcon width="24" />),
  className: z.string().optional(),
  align: z.enum(['left', 'right']).default('right')
})

type NavbarProps = z.input<typeof propsSchema>

export const Navbar: FC<NavbarProps> = props => {
  const { data, error } = propsSchema.safeParse(props)
  if (error) {
    throw fromZodError(error)
  }
  const {
    children,
    logoLink,
    logo,
    projectLink,
    projectIcon,
    chatLink,
    chatIcon,
    className,
    align
  } = data

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
