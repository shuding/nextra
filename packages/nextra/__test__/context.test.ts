import path from 'node:path'
import { CWD, NEXTRA_INTERNAL } from '../src/constants'
import {
  getAllPages,
  getCurrentLevelPages,
  getPagesUnderRoute
} from '../src/context'
import { collectFiles } from '../src/plugin'
import type { NextraInternalGlobal } from '../src/types'

describe('context', () => {
  beforeAll(async () => {
    const PAGES_DIR = path.join(
      CWD,
      '..',
      '..',
      'examples',
      'swr-site',
      'pages'
    )
    const { items } = await collectFiles({ dir: PAGES_DIR })
    // @ts-expect-error -- we don't care about missing properties
    const __nextra_internal__ = ((globalThis as NextraInternalGlobal)[
      NEXTRA_INTERNAL
    ] ||= {})
    Object.assign(__nextra_internal__, {
      pageMap: items,
      route: '/docs'
    })
  })

  describe('getAllPages()', () => {
    it('should work', () => {
      expect(getAllPages()).toMatchSnapshot()
    })
  })

  describe('getCurrentLevelPages()', () => {
    it('should work', () => {
      expect(getCurrentLevelPages()).toMatchSnapshot()
    })
  })

  describe('getPagesUnderRoute()', () => {
    it('should work', () => {
      expect(getPagesUnderRoute('/docs/advanced')).toMatchSnapshot()
    })
  })
})
