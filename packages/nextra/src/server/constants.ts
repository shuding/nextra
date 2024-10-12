/*
 * Benefit of server/constants - do not include unneeded `path` polyfill in client bundle,
 * while importing constants in client file
 */
import path from 'path'
import type { Property } from 'estree'

export { MARKDOWN_EXTENSION_REGEX, DEFAULT_LOCALE } from '../constants.js'

export const CWD = process.cwd()

export const PUBLIC_DIR = path.join(CWD, 'public')

export const CHUNKS_DIR = path.join(CWD, '.next', 'static', 'chunks')

export const MARKDOWN_URL_EXTENSION_RE = /\.mdx?(?:(?=[#?])|$)/

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const META_RE = /_meta\.[jt]sx?$/

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const

export const EXTERNAL_URL_RE = /^https?:\/\//

export const DEFAULT_LOCALES = ['']

export const DEFAULT_PROPERTY_PROPS = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
} satisfies Omit<Property, 'key' | 'value'>

export const TOC_HEADING_RE = /^h[2-6]$/
