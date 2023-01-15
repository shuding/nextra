/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import { FC } from 'react'
import get from 'lodash.get'
import { IS_PRODUCTION, NEXTRA_INTERNAL } from './constants'
import {
  DynamicMetaDescriptor,
  NextraInternalGlobal,
  PageOpts,
  ThemeConfig
} from './types'

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {number} [seed] optionally pass the hash of the previous chunk
 * @returns {string}
 */
function hashFnv32a(str: string, seed = 0x811c9dc5): string {
  let hval = seed

  for (let i = 0; i < str.length; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }

  // Convert to 8 digit hex string
  return ('0000000' + (hval >>> 0).toString(16)).substring(-8)
}

export function setupNextraPage({
  pageNextRoute,
  pageOpts,
  nextraLayout,
  themeConfig,
  Content,
  hot,
  dynamicMetaItems
}: {
  pageNextRoute: string
  pageOpts: PageOpts
  nextraLayout: FC
  themeConfig: ThemeConfig
  Content: FC
  hot: __WebpackModuleApi.Hot
  dynamicMetaItems: DynamicMetaDescriptor[]
}) {
  if (typeof window === 'undefined') {
    globalThis.__nextra_resolvePageMap = async () => {
      const clonedPageMap = JSON.parse(JSON.stringify(pageOpts.pageMap))
      await Promise.all(
        dynamicMetaItems.map(
          async ({ metaFilePath, metaObjectKeyPath, metaParentKeyPath }) => {
            const mod = await import(metaFilePath)
            const metaData = await mod.default()
            const meta = get(clonedPageMap, metaObjectKeyPath)
            meta.data = metaData

            const parentRoute =
              get(clonedPageMap, metaParentKeyPath.replace(/\.children$/, ''))
                .route || ''

            for (const key of Object.keys(metaData)) {
              get(clonedPageMap, metaParentKeyPath).push({
                kind: 'MdxPage',
                locale: meta.locale,
                name: key.split('/').pop(),
                route: parentRoute + '/' + key
              })
            }
          }
        )
      )
      return clonedPageMap
    }
  }

  // Make sure the same component is always returned so Next.js will render the
  // stable layout. We then put the actual content into a global store and use
  // the route to identify it.
  const __nextra_internal__ = ((globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ] ||= Object.create(null))

  __nextra_internal__.pageMap = pageOpts.pageMap
  __nextra_internal__.route = pageOpts.route
  __nextra_internal__.context ||= Object.create(null)
  __nextra_internal__.refreshListeners ||= Object.create(null)
  __nextra_internal__.Layout = nextraLayout
  __nextra_internal__.context[pageNextRoute] = {
    Content,
    pageOpts,
    themeConfig
  }

  if (!IS_PRODUCTION && hot) {
    const checksum = hashFnv32a(JSON.stringify(pageOpts))
    hot.data ||= Object.create(null)
    if (hot.data.prevPageOptsChecksum !== checksum) {
      const listeners =
        __nextra_internal__.refreshListeners[pageNextRoute] || []
      for (const listener of listeners) {
        listener()
      }
    }
    hot.dispose(data => {
      data.prevPageOptsChecksum = checksum
    })
  }
}
