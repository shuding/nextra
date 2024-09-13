import { ThemeProvider } from 'next-themes'
import type { NextraThemeLayoutProps } from 'nextra'
import { Search } from 'nextra/components'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Footer, MobileNav, Navbar } from './components'
import {
  ActiveAnchorProvider,
  ConfigProvider,
  ThemeConfigProvider
} from './contexts'

const element = z.custom<ReactElement>(isValidElement, {
  message: 'Must be React.ReactElement'
})

const stringOrElement = z.union([z.string(), element])

const theme = z.strictObject({
  pageMap: z.array(z.any({})),
  darkMode: z.boolean().default(true),
  docsRepositoryBase: z
    .string()
    .startsWith('https://')
    .default('https://github.com/shuding/nextra'),
  editLink: z
    .strictObject({
      content: stringOrElement.default('Edit this page')
    })
    .default({}),
  feedback: z
    .strictObject({
      labels: z.string().default('feedback'),
      content: stringOrElement.default('Question? Give us feedback →')
    })
    .default({}),
  navigation: z
    .union([
      z.boolean(),
      z.strictObject({
        next: z.boolean(),
        prev: z.boolean()
      })
    ])
    .default(true)
    .transform(v => ({ prev: v, next: v })),
  i18n: z
    .array(
      z.strictObject({
        direction: z.enum(['ltr', 'rtl']).optional(),
        locale: z.string(),
        name: z.string()
      })
    )
    .default([]),
  search: element.default(<Search />),
  sidebar: z
    .strictObject({
      autoCollapse: z.boolean().optional(),
      defaultMenuCollapseLevel: z.number().min(1).int().default(2),
      toggleButton: z.boolean().default(true)
    })
    .default({}),
  toc: z
    .strictObject({
      backToTop: z.boolean().default(true),
      extraContent: stringOrElement.optional(),
      float: z.boolean().default(true),
      title: stringOrElement.default('On This Page')
    })
    .default({}),
  themeSwitch: z
    .strictObject({
      options: z
        .strictObject({
          light: z.string().default('Light'),
          dark: z.string().default('Dark'),
          system: z.string().default('System')
        })
        .default({})
    })
    .default({}),
  nextThemes: z
    .strictObject({
      attribute: z.string().default('class'),
      disableTransitionOnChange: z.boolean().default(true),
      defaultTheme: z.string().default('system'),
      storageKey: z.string().default('theme')
    })
    .default({}),
  gitTimestamp: z.boolean().optional()
})

export type ThemeConfigProps = z.infer<typeof theme>

type ThemeProviderProps = Omit<ComponentProps<typeof ThemeProvider>, 'children'>

export function Layout({
  children,
  ...themeConfig
}: NextraThemeLayoutProps<ThemeConfigProps> & {
  nextThemes?: ThemeProviderProps
}): ReactElement {
  const { footer, navbar, restChildren } = Children.toArray(children).reduce<{
    footer: ReactNode
    navbar: ReactNode
    restChildren: ReactElement[]
  }>(
    (acc, child) => {
      if (
        child &&
        typeof child === 'object' &&
        'type' in child &&
        typeof child.type === 'function'
      ) {
        if (child.type === Footer) {
          acc.footer = child
        } else if (child.type === Navbar) {
          acc.navbar = child
        } else {
          acc.restChildren.push(child)
        }
      }
      return acc
    },
    {
      footer: <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>,
      navbar: <Navbar />,
      restChildren: []
    }
  )

  const { data, error } = theme.safeParse(themeConfig)
  if (error) {
    throw fromZodError(error)
  }

  return (
    <ThemeConfigProvider value={data}>
      <ThemeProvider {...data.nextThemes}>
        <ConfigProvider pageMap={data.pageMap} footer={footer} navbar={navbar}>
          <ActiveAnchorProvider>
            <MobileNav />
            {restChildren}
          </ActiveAnchorProvider>
        </ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
