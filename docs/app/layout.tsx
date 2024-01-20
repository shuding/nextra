import { Layout } from 'nextra-theme-docs'
import type { ReactNode } from 'react'
import 'nextra-theme-docs/style.css'
import '../style.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* @ts-expect-error todo: remove it */}
        <Layout themeConfig={{}} pageOpts={{ pageMap: [], frontMatter: {} }}>
          {children}
        </Layout>
      </body>
    </html>
  )
}
