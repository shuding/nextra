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

  describe('_app', () => {
    it('ensure zod is removed from production build with /* @__PURE__ */ comments', async () => {
      const appFile = await fs.readFile(
        path.join(
          pageChunksDirPath,
          pageChunkFileNames.find(name => name.startsWith('_app-'))!
        ),
        'utf8'
      )
      expect(appFile.includes('Zod')).toBe(false)
    })
  })

  describe('index page', async () => {
    const testPage = await fs.readFile(
      path.join(
        pageChunksDirPath,
        pageChunkFileNames.find(name => name.startsWith('en-'))!
      ),
      'utf8'
    )
    it('should not include `nextraLayout`', () => {
      expect(testPage.includes('nextraLayout:')).toBe(false)
    })
    it('should not include `pageOpts.pageMap`', () => {
      expect(testPage.includes('pageMap:')).toBe(true)
    })
    it('should not include default `pageOpts.frontMatter: {}`', () => {
      expect(testPage.includes('frontMatter:')).toBe(true)
    })
    it('should not include `pageOpts.search`', () => {
      expect(testPage.includes('search:')).toBe(false)
    })
    it('should not include `themeConfig`', () => {
      expect(testPage.includes('themeConfig:')).toBe(false)
    })
    it('should not include `hot`', () => {
      expect(testPage.includes('hot:')).toBe(false)
    })
    it('should not include `pageOptsChecksum`', () => {
      expect(testPage.includes('pageOptsChecksum:')).toBe(false)
    })
    it('should not include `dynamicMetaModules`', () => {
      expect(testPage.includes('dynamicMetaModules:')).toBe(false)
    })
    it('should not include injected theme config', () => {
      expect(testPage.includes('docsRepositoryBase:')).toBe(false)
      expect(testPage.includes('i18n:')).toBe(false)
    })
  })
})
