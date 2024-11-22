import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { Anchor } from 'nextra/components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import { element } from 'nextra/schemas'
import type { FC } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { ClientNavbar } from './index.client'

const propsSchema = z.strictObject({
  children: element.optional(),
  logoLink: z.union([z.string(), z.boolean()]).default(true),
  logo: element,
  projectLink: z.string().optional(),
  projectIcon: element.default(<GitHubIcon height="24" />),
  chatLink: z.string().optional(),
  chatIcon: element.default(<DiscordIcon width="24" />)
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
    chatIcon
  } = data
  return (
    <header
      className={cn(
        'nextra-navbar x:sticky x:top-0 x:z-20 x:w-full x:bg-transparent x:print:hidden',
        'x:max-md:[.nextra-banner:not([class$=hidden])~&]:top-(--nextra-banner-height)'
      )}
    >
      <div
        className={cn(
          'nextra-navbar-blur',
          'x:pointer-events-none x:absolute x:z-[-1] x:size-full',
          'x:shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)]',
          'x:dark:shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]',
          'x:contrast-more:shadow-[0_0_0_1px_#000]',
          'x:contrast-more:dark:shadow-[0_0_0_1px_#fff]',
          'x:backdrop-blur-md x:bg-nextra-bg/70'
        )}
      />
      <nav
        style={{ height: 'var(--nextra-navbar-height)' }}
        className="x:mx-auto x:flex x:max-w-[90rem] x:items-center x:justify-end x:gap-4 x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]"
      >
        {logoLink ? (
          <NextLink
            href={typeof logoLink === 'string' ? logoLink : '/'}
            className="focus-visible:nextra-focus x:flex x:items-center x:hover:opacity-75 x:me-auto"
          >
            {logo}
          </NextLink>
        ) : (
          <div className="x:flex x:items-center x:me-auto">{logo}</div>
        )}
        <ClientNavbar>
          {projectLink && <Anchor href={projectLink}>{projectIcon}</Anchor>}
          {chatLink && <Anchor href={chatLink}>{chatIcon}</Anchor>}
          {children}
        </ClientNavbar>
      </nav>
    </header>
  )
}
