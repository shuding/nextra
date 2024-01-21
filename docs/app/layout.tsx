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
  await fs.writeFile(
    path.join(
      process.cwd(),
      '.next',
      'static',
      'chunks',
      'nextra-page-map.mjs'
    ),
    rawJs
  )
  const { pageMap } = await import('.next/static/chunks/nextra-page-map.mjs')

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
