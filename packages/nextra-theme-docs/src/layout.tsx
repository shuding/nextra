/* eslint sort-keys: error */
import { ThemeProvider } from 'next-themes'
import { Search } from 'nextra/components'
import type { ReactElement, ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Footer, Navbar } from './components'
import { ConfigProvider, ThemeConfigProvider } from './contexts'

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
  editLink: z
    .strictObject({
      content: stringOrElement.default('Edit this page')
    })
    .default({}),
  feedback: z
    .strictObject({
      content: stringOrElement.default('Question? Give us feedback →'),
      labels: z.string().default('feedback')
    })
    .default({}),
  gitTimestamp: z.boolean().optional(),
  i18n: z
    .array(
      z.strictObject({
        direction: z.enum(['ltr', 'rtl']).optional(),
        locale: z.string(),
        name: z.string()
      })
    )
    .default([]),
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
      options: z
        .strictObject({
          dark: z.string().default('Dark'),
          light: z.string().default('Light'),
          system: z.string().default('System')
        })
        .default({})
    })
    .default({}),
  toc: z
    .strictObject({
      backToTop: z.boolean().default(true),
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

const hasTypeOf = (child: unknown, ComponentOf: Function) =>
  child &&
  typeof child === 'object' &&
  'type' in child &&
  typeof child.type === 'function' &&
  child.type === ComponentOf

export function Layout({ children, ...themeConfig }: Props): ReactElement {
  const { data, error } = theme.safeParse(themeConfig)
  if (error) {
    throw fromZodError(error)
  }

  const newChildren = Children.toArray(children)

  if (!newChildren.some(child => hasTypeOf(child, Navbar))) {
    newChildren.unshift(<Navbar />)
  }
  if (!newChildren.some(child => hasTypeOf(child, Footer))) {
    newChildren.push(<Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>)
  }

  return (
    <ThemeConfigProvider value={data}>
      <ThemeProvider {...data.nextThemes}>
        <ConfigProvider pageMap={data.pageMap}>{newChildren}</ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
