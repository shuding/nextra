import type { Metadata } from 'next'

export { normalizePageMap } from './normalize.js'
export { convertToPageMap } from './to-page-map.js'
export { mergeMetaWithPageMap } from './merge-meta-with-page-map.js'
export { getPageMap } from './get.js'
export { createIndexPage, getIndexPageMap } from './index-page.js'

export function getMetadata(
  page:
    | { metadata: Metadata }
    | { generateMetadata?: (props: object) => Promise<Metadata> }
): Promise<Metadata> | Metadata {
  if (
    'generateMetadata' in page &&
    // `@sentry/nextjs` makes `generateMetadata` getter function which can be `undefined`
    page.generateMetadata
  ) {
    return page.generateMetadata({})
  }
  if ('metadata' in page) {
    return page.metadata
  }
  return {}
}
