import fs from 'node:fs/promises'
import path from 'node:path'
import { CWD } from '../src/server/constants.js'

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

  describe('_app', async () => {
    const appFile = await fs.readFile(
      path.join(
        pageChunksDirPath,
        pageChunkFileNames.find(name => name.startsWith('_app-'))!
      ),
      'utf8'
    )
    it('ensure `zod` is removed from production build with /* @__PURE__ */ comments', async () => {
      expect(appFile.includes('Zod')).toBe(false)
    })
    it('ensure `title` is removed', () => {
      expect(appFile.includes('ZEIT Inc.')).toBe(false)
    })
    it('ensure nextra logger is removed', () => {
      expect(appFile.includes('[nextra]')).toBe(false)
    })
    it('ensure `slash` is removed', () => {
      expect(appFile.includes('\\\\?\\')).toBe(false)
    })
    it('ensure `constants.ts#CWD` is removed', () => {
      expect(appFile.includes('cwd()')).toBe(false)
    })
    it('ensure `constants.ts#CHUNKS_DIR` is removed', () => {
      expect(/"\.next",\s*"static",\s*"chunks"\)/.test(appFile)).toBe(false)
    })
    it('ensure `constants.ts#PUBLIC_DIR` is removed', () => {
      expect(appFile.includes('"public")')).toBe(false)
    })
    it('ensure `path` polyfill is removed', () => {
      expect(appFile.includes('basename:')).toBe(false)
    })
    it('ensure `process` polyfill is removed', () => {
      expect(appFile.includes('process)')).toBe(false)
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
    it('should not include `pageOpts.search`', () => {
      expect(testPage.includes('search:')).toBe(false)
    })
    it('should not include `themeConfig`', () => {
      expect(testPage.includes('themeConfig:')).toBe(false)
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
