/*
 * Benefit of server/constants - do not include unneeded `path` polyfill in client bundle,
 * while importing constants in client file
 */
import type { Property } from 'estree'

export const MARKDOWN_EXTENSION_RE = /\.mdx?$/

export const CWD = process.cwd()

export const MARKDOWN_URL_EXTENSION_RE = /\.mdx?(?:(?=[#?])|$)/

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const EXTERNAL_URL_RE = /^https?:\/\//

export const DEFAULT_PROPERTY_PROPS = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
} satisfies Omit<Property, 'key' | 'value'>

export const METADATA_ONLY_RQ = '?metadata'
