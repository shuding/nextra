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
        'nextra-navbar _sticky _top-0 _z-20 _w-full _bg-transparent print:_hidden',
        String.raw`max-md:[.nextra-banner:not(.\_hidden)~&]:_top-[--nextra-banner-height]`
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
          {projectLink && <Anchor href={projectLink}>{projectIcon}</Anchor>}
          {chatLink && <Anchor href={chatLink}>{chatIcon}</Anchor>}
          {children}
        </ClientNavbar>
      </nav>
    </header>
  )
}
