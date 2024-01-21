import fs from 'fs/promises'
import path from 'path'
import { Layout } from 'nextra-theme-docs'
import { collectPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'
import 'nextra-theme-docs/style.css'
import '../style.css'

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  const rawJs = await collectPageMap({
    dir: path.join(process.cwd(), 'docs'),
    route: '/'
  })
  const pageMapPath = path.join(process.cwd(), 'nextra-page-map.mjs')
  await fs.writeFile(pageMapPath, rawJs)
  const { pageMap } = await import('../nextra-page-map.mjs')

  return (
    <html lang="en">
      <body>
        {/* @ts-expect-error todo: remove it */}
        <Layout themeConfig={{}} pageOpts={{ pageMap, frontMatter: {} }}>
          {children}
        </Layout>
      </body>
    </html>
  )
}
