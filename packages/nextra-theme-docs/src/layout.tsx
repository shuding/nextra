/* eslint sort-keys: error */
import { ThemeProvider } from 'next-themes'
import { Search, SkipNavLink } from 'nextra/components'
import type { FC, ReactElement, ReactNode } from 'react'
import { isValidElement } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { LastUpdated, MobileNav } from './components'
import { ConfigProvider, ThemeConfigProvider } from './stores'

const element = z.custom<ReactElement>(isValidElement, {
  message: 'Must be React.ReactElement'
})

const stringOrElement = z.union([z.string(), element])

const theme = z.strictObject({
  banner: element.optional(),
  darkMode: z.boolean().default(true),
  docsRepositoryBase: z
    .string()
    .startsWith('https://')
    .default('https://github.com/shuding/nextra'),
  editLink: stringOrElement.default('Edit this page'),
  feedback: z
    .strictObject({
      content: stringOrElement.default('Question? Give us feedback'),
      labels: z.string().default('feedback')
    })
    .default({}),
  footer: element,
  i18n: z
    .array(
      z.strictObject({
        locale: z.string(),
        name: z.string()
      })
    )
    .default([]),
  lastUpdated: element.default(<LastUpdated />),
  navbar: element,
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
      defaultTheme: z.string().optional(),
      disableTransitionOnChange: z.boolean().default(true),
      storageKey: z.string().optional()
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

type LayoutProps = z.input<typeof theme> & { children: ReactNode }

export const Layout: FC<LayoutProps> = ({ children, ...themeConfig }) => {
  const { data, error } = theme.safeParse(themeConfig)
  if (error) {
    throw fromZodError(error)
  }

  // if (!newChildren.some(child => hasTypeOf(child, Footer))) {
  //   newChildren.push(
  //     <Footer key={1}>MIT {new Date().getFullYear()} © Nextra.</Footer>
  //   )
  // }

  const { footer, navbar, pageMap, nextThemes, banner, ...rest } = data

  return (
    <ThemeConfigProvider value={rest}>
      <ThemeProvider {...nextThemes}>
        <ConfigProvider pageMap={pageMap} navbar={navbar} footer={footer}>
          {banner}
          {/*
           * MobileNav should be in layout and not in mdx wrapper, otherwise for non mdx pages will
           * be not rendered
           */}
          <MobileNav />
          <SkipNavLink />
          {children}
        </ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
