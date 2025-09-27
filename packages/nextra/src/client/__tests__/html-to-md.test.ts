import { htmlToMarkdown } from '../html-to-md'
import metaPage from './fixtures/meta-page.txt?raw'
import pagePage from './fixtures/page-page.txt?raw'

describe('html-to-md', () => {
  it('meta page', async () => {
    const md = await htmlToMarkdown(metaPage)
    await expect(md).toMatchFileSnapshot('./fixtures/meta-page.md')
  })
  it('page page', async () => {
    const md = await htmlToMarkdown(pagePage)
    await expect(md).toMatchFileSnapshot('./fixtures/page-page.md')
  })
})
