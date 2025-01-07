import fs from 'node:fs/promises'
import path from 'node:path'
import { CWD } from '../constants.js'

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
    it('ensure `path` polyfill is removed', () => {
      expect(appFile.includes('basename:')).toBe(false)
    })
    // I think he is false positive
    it('ensure `process` polyfill is removed', () => {
      expect(appFile.includes('process)')).toBe(false)
    })
  })
})
