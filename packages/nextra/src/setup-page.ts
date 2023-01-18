/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import type { FC } from 'react'
import type {
  DynamicMetaDescriptor,
  NextraInternalGlobal,
  PageOpts,
  ThemeConfig
} from './types'

import get from 'lodash.get'
import { NEXTRA_INTERNAL } from './constants'

export function setupNextraPage({
  pageNextRoute,
  pageOpts,
  nextraLayout,
  themeConfig,
  Content,
  hot,
  pageOptsChecksum,
  dynamicMetaModules
}: {
  pageNextRoute: string
  pageOpts: PageOpts
  nextraLayout: FC
  themeConfig: ThemeConfig
  Content: FC
  hot: __WebpackModuleApi.Hot
  pageOptsChecksum: string
  dynamicMetaModules: [Promise<any>, DynamicMetaDescriptor][]
}) {
  if (typeof window === 'undefined') {
    globalThis.__nextra_resolvePageMap = async () => {
      const clonedPageMap = JSON.parse(JSON.stringify(pageOpts.pageMap))
      await Promise.all(
        dynamicMetaModules.map(
          async ([importMod, { metaObjectKeyPath, metaParentKeyPath }]) => {
            const mod = await importMod
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

  if (process.env.NODE_ENV !== 'production' && hot) {
    const checksum = pageOptsChecksum
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
