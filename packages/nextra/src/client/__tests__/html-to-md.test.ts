import { describe } from 'vitest'
import { htmlToMarkdown } from '../html-to-md'
// @ts-expect-error
import metaPage from './fixtures/meta-page.txt?raw'

describe('html-to-md', () => {
  it.only('should work', async () => {
    const md = await htmlToMarkdown(metaPage)
    expect(md).toMatchFileSnapshot('./fixtures/meta-page.md')
  })
})
