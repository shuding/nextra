import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import type { MetadataRoute } from 'next'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { appDir } = findPagesDir(process.cwd())
  if (!appDir) {
    throw new Error('Unable to find `app` directory')
  }
  const result = await fg(path.join(appDir, '**/page.{js,jsx,jsx,tsx,md,mdx}'))

  return Promise.all(
    result.map(async pagePath => {
      const stats = await fs.stat(pagePath)
      const relativePath = '/' + path.relative(appDir, pagePath)
      return {
        url:
          'https://nextra.site' +
          relativePath.split('/').slice(0, -1).join('/'),
        lastModified: new Date(Math.round(stats.mtimeMs)),
        changeFrequency: 'weekly',
        priority: 0.5
      }
    })
  )
}
