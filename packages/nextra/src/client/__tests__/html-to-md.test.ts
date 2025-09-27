import { describe } from 'vitest'
import { htmlToMarkdown } from '../html-to-md'
// @ts-expect-error
import metaPage from './fixtures/meta-page.txt?raw'
// @ts-expect-error
import pagePage from './fixtures/page-page.txt?raw'

describe('html-to-md', () => {
  it.only('meta page', async () => {
    const md = await htmlToMarkdown(metaPage)
    await expect(md).toMatchFileSnapshot('./fixtures/meta-page.md')
  })
  it.only('page page', async () => {
    const md = await htmlToMarkdown(pagePage)
    await expect(md).toMatchFileSnapshot('./fixtures/page-page.md')
  })
})
