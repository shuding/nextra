/*
 * Benefit of server/constants - do not include unneeded `path` polyfill in client bundle,
 * while importing constants in client file
 */
import type { Property } from 'estree'

export const MARKDOWN_EXTENSION_RE = /\.mdx?$/

export const CWD = process.cwd()

export const MARKDOWN_URL_EXTENSION_RE = /\.mdx?(?:(?=[#?])|$)/

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const META_RE = /_meta\.[jt]sx?$/

export const EXTERNAL_URL_RE = /^https?:\/\//

export const DEFAULT_PROPERTY_PROPS = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
} satisfies Omit<Property, 'key' | 'value'>

export const TOC_HEADING_RE = /^h[2-6]$/

export const GET_PAGE_MAP_PATH = '/nextra/dist/server/page-map/get.js'

export const PAGE_MAP_PLACEHOLDER_PATH =
  '/nextra/dist/server/page-map/placeholder.js'

export const IMPORT_PAGE_PATH = '/nextra/dist/client/pages.js'

export const METADATA_ONLY_RQ = '?metadata'
