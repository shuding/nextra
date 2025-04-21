/* eslint sort-keys: error */
import { ThemeProvider } from 'next-themes'
import { SkipNavLink } from 'nextra/components'
import type { FC } from 'react'
import { z } from 'zod'
import { MobileNav } from './components/sidebar'
import { LayoutPropsSchema } from './schemas'
import { ConfigProvider, ThemeConfigProvider } from './stores'
import type { LayoutProps } from './types.generated'

export type ThemeConfigProps = z.infer<typeof LayoutPropsSchema>

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
