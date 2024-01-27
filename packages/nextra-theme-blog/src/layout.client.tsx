'use client'

import { usePathname } from 'next/navigation'
import type { NextraThemeLayoutProps } from 'nextra'
import { BlogProvider } from './blog-context'
import { Nav } from './nav'
import type { BlogFrontMatter } from './types'
import { isValidDate } from './utils/date'

export function ClientLayout({
  children,
  pageOpts,
  themeConfig
}: NextraThemeLayoutProps<BlogFrontMatter>) {
  // if (date && !isValidDate(date)) {
  //   throw new Error(
  //     `Invalid date "${date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
  //   )
  // }

  return (
    <BlogProvider value={themeConfig}>
      <Nav />
      {children}
    </BlogProvider>
  )
}
