import fs from 'node:fs/promises'
import path from 'node:path'
import { CWD } from '../src/constants'

describe('tree shaking', async () => {
  const pageChunksDirPath = path.join(
    CWD,
    '..',
    '..',
    'examples',
    'swr-site',
    '.next',
    'static',
    'chunks',
    'pages'
  )
  const pageChunkFileNames = await fs.readdir(pageChunksDirPath)
  const testPage = await fs.readFile(
    path.join(
      pageChunksDirPath,
      pageChunkFileNames.find(name => name.startsWith('404'))!
    ),
    'utf-8'
  )
  it('should not includes `nextraLayout`', () => {
    expect(testPage.includes('nextraLayout:')).toBe(false)
  })
  it('should not includes `pageOpts.pageMap`', () => {
    expect(testPage.includes('pageMap:')).toBe(false)
  })
  it('should not includes default `pageOpts.frontMatter: {}`', () => {
    expect(testPage.includes('frontMatter:')).toBe(false)
  })
  it('should not includes `pageOpts.flexsearch`', () => {
    expect(testPage.includes('flexsearch:')).toBe(false)
  })
  it('should not includes `themeConfig`', () => {
    expect(testPage.includes('themeConfig:')).toBe(false)
  })
  it('should not includes `hot`', () => {
    expect(testPage.includes('hot:')).toBe(false)
  })
  it('should not includes `pageOptsChecksum`', () => {
    expect(testPage.includes('pageOptsChecksum:')).toBe(false)
  })
  it('should not includes `dynamicMetaModules`', () => {
    expect(testPage.includes('dynamicMetaModules:')).toBe(false)
  })
  it('should not includes injected theme config', () => {
    expect(testPage.includes('docsRepositoryBase:')).toBe(false)
    expect(testPage.includes('i18n:')).toBe(false)
  })
})
