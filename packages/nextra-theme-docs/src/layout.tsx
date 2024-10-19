/* eslint sort-keys: error */
import { ThemeProvider } from 'next-themes'
import { Search, SkipNavLink } from 'nextra/components'
import type { FC, ReactElement, ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Footer, LastUpdated, MobileNav, Navbar } from './components'
import { ConfigProvider, ThemeConfigProvider } from './stores'

const element = z.custom<ReactElement>(isValidElement, {
  message: 'Must be React.ReactElement'
})

const stringOrElement = z.union([z.string(), element])

const theme = z.strictObject({
  darkMode: z.boolean().default(true),
  docsRepositoryBase: z
    .string()
    .startsWith('https://')
    .default('https://github.com/shuding/nextra'),
  editLink: stringOrElement.default('Edit this page'),
  feedback: z
    .strictObject({
      content: stringOrElement.default('Question? Give us feedback →'),
      labels: z.string().default('feedback')
    })
    .default({}),
  i18n: z
    .array(
      z.strictObject({
        locale: z.string(),
        name: z.string()
      })
    )
    .default([]),
  lastUpdated: element.default(<LastUpdated />),
  navigation: z
    .union([
      z.boolean(),
      z.strictObject({
        next: z.boolean(),
        prev: z.boolean()
      })
    ])
    .default(true)
    .transform(v => (typeof v === 'boolean' ? { next: v, prev: v } : v)),
  nextThemes: z
    .strictObject({
      attribute: z.string().default('class'),
      defaultTheme: z.string().default('system'),
      disableTransitionOnChange: z.boolean().default(true),
      storageKey: z.string().default('theme')
    })
    .default({}),
  pageMap: z.array(z.any({})),
  search: element.default(<Search />),
  sidebar: z
    .strictObject({
      autoCollapse: z.boolean().optional(),
      defaultMenuCollapseLevel: z.number().min(1).int().default(2),
      toggleButton: z.boolean().default(true)
    })
    .default({}),
  themeSwitch: z
    .strictObject({
      dark: z.string().default('Dark'),
      light: z.string().default('Light'),
      system: z.string().default('System')
    })
    .default({}),
  toc: z
    .strictObject({
      backToTop: stringOrElement.default('Scroll to top'),
      extraContent: stringOrElement.optional(),
      float: z.boolean().default(true),
      title: stringOrElement.default('On This Page')
    })
    .default({})
})

export type ThemeConfigProps = z.infer<typeof theme>

type Props = Partial<
  Omit<ThemeConfigProps, 'sidebar' | 'nextThemes' | 'toc'>
> & {
  sidebar?: Partial<ThemeConfigProps['sidebar']>
  nextThemes?: Partial<ThemeConfigProps['nextThemes']>
  toc?: Partial<ThemeConfigProps['toc']>
  children: ReactNode
}

const hasTypeOf = (child: unknown, ComponentOf: FC) =>
  child &&
  typeof child === 'object' &&
  'type' in child &&
  child.type === ComponentOf

export const Layout: FC<Props> = ({ children, ...themeConfig }) => {
  const { data, error } = theme.safeParse(themeConfig)
  if (error) {
    throw fromZodError(error)
  }

  const newChildren = Children.toArray(children)

  if (!newChildren.some(child => hasTypeOf(child, Navbar))) {
    newChildren.unshift(<Navbar key={0} />)
  }
  if (!newChildren.some(child => hasTypeOf(child, Footer))) {
    newChildren.push(
      <Footer key={1}>MIT {new Date().getFullYear()} © Nextra.</Footer>
    )
  }

  return (
    <ThemeConfigProvider value={data}>
      <ThemeProvider {...data.nextThemes}>
        <ConfigProvider pageMap={data.pageMap}>
          {/*
           * MobileNav should be in layout and not in mdx wrapper, otherwise for non mdx pages will
           * be not rendered
           */}
          <MobileNav />
          <SkipNavLink />
          {newChildren}
        </ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
