import { describe, it, expect } from 'vitest'
import path from 'path'
import { getPageMap } from '../src/page-map'

const pagesDir = () => '../../examples/swr-site/pages'
const filePath = (name: string) => path.join(process.cwd(), pagesDir(), name)
const locales = ['en-US', 'zh-CN', 'es-ES', 'ja', 'ko', 'ru']
const defaultLocale = 'en-US'

describe('Page Process', () => {
  it('pageMap en-US', async () => {
    const indexData = await getPageMap(
      filePath('docs/data-fetching.en-US.mdx'),
      locales,
      defaultLocale,
      pagesDir()
    )
    expect(indexData).toMatchSnapshot()

    const gettingStartData = await getPageMap(
      filePath('docs/getting-started.en-US.mdx'),
      locales,
      defaultLocale,
      pagesDir()
    )
    expect(gettingStartData[0]).toEqual(indexData[0])
  })

  it('pageMap zh-CN', async () => {
    const indexData = await getPageMap(
      filePath('docs/data-fetching.zh-CN.mdx'),
      locales,
      defaultLocale,
      pagesDir()
    )
    expect(indexData).toMatchSnapshot()

    const gettingStartData = await getPageMap(
      filePath('docs/getting-started.zh-CN.mdx'),
      locales,
      defaultLocale,
      pagesDir()
    )
    expect(gettingStartData[0]).toEqual(indexData[0])
  })
})
