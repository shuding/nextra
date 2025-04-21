/* eslint sort-keys: error */
import { ThemeProvider } from 'next-themes'
import { SkipNavLink } from 'nextra/components'
import type { FC } from 'react'
import { z } from 'zod'
import { MobileNav } from './components/sidebar'
import { ConfigProvider, ThemeConfigProvider } from './stores'
import { LayoutPropsSchema } from './schemas'

export type ThemeConfigProps = z.infer<typeof LayoutPropsSchema>

type $LayoutProps = z.input<typeof LayoutPropsSchema>

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// This is probably a bug in zod v4, `navigation` must be provided,
// but should be optional since we provided default value
type LayoutProps = MakeOptional<$LayoutProps, 'navigation'>

export const Layout: FC<LayoutProps> = ({ children, ...themeConfig }) => {
  const { data, error } = LayoutPropsSchema.safeParse(themeConfig)
  if (error) {
    throw z.prettifyError(error)
  }
  const { footer, navbar, pageMap, nextThemes, banner, ...rest } = data

  return (
    <ThemeConfigProvider value={rest}>
      <ThemeProvider {...nextThemes}>
        <SkipNavLink />
        {banner}
        <ConfigProvider pageMap={pageMap} navbar={navbar} footer={footer}>
          {/*
           * MobileNav should be in layout and not in mdx wrapper, otherwise for non mdx pages will
           * be not rendered
           */}
          <MobileNav />
          {children}
        </ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
