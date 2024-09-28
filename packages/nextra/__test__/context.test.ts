import path from 'node:path'
import {
  getAllPages,
  getCurrentLevelPages,
  getPagesUnderRoute
} from '../src/client/context.js'
import { NEXTRA_INTERNAL } from '../src/constants.js'
import { CWD } from '../src/server/constants.js'
import type { NextraInternalGlobal } from '../src/types'

describe('context', () => {
  beforeAll(async () => {
    const chunksPath = path.join(
      CWD,
      '..',
      '..',
      'examples',
      'swr-site',
      '.next',
      'static',
      'chunks'
    )
    const { pageMap: enPageMap } = await import(
      chunksPath + '/nextra-page-map-en.mjs'
    )

    // @ts-expect-error -- we don't care about missing properties
    const __nextra_internal__ = ((globalThis as NextraInternalGlobal)[
      NEXTRA_INTERNAL
    ] ||= {})

    Object.assign(__nextra_internal__, {
      pageMap: enPageMap,
      // TODO: add here '/en/...'
      route: '/docs'
    })
  })

  describe('getAllPages()', () => {
    it.skip('should work', () => {
      expect(getAllPages()).toMatchSnapshot()
    })
  })

  describe('getCurrentLevelPages()', () => {
    it.skip('should work', () => {
      expect(getCurrentLevelPages()).toMatchSnapshot()
    })
  })

  describe('getPagesUnderRoute()', () => {
    it.skip('should work', () => {
      expect(getPagesUnderRoute('/en/docs/advanced')).toMatchSnapshot()
    })
  })
})
