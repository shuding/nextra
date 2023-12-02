/*
 * Benefit of server/constants - do not include unneeded `path` polyfill in client bundle,
 * while importing constants in client file
 */
import path from 'path'
import type { Property } from 'estree'
import type { NextraConfig } from '../types'

export {
  MARKDOWN_EXTENSION_REGEX,
  ERROR_ROUTES,
  DEFAULT_LOCALE
} from '../constants.js'

export const CWD = process.cwd()

export const PUBLIC_DIR = path.join(CWD, 'public')

export const CHUNKS_DIR = path.join(CWD, '.next', 'static', 'chunks')

export const MARKDOWN_URL_EXTENSION_REGEX = /\.mdx?(?:(?=[#?])|$)/

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const DEFAULT_CONFIG = {
  staticImage: true,
  search: {
    codeblocks: true
  },
  codeHighlight: true
} satisfies Partial<NextraConfig>

export const OFFICIAL_THEMES = ['nextra-theme-docs', 'nextra-theme-blog']

export const META_REGEX = /_meta\.[jt]sx?$/

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const

export const EXTERNAL_URL_REGEX = /^https?:\/\//

export const DEFAULT_LOCALES = ['']

// Experimental, need to deep dive why bundle becomes bigger and there is full
// reload while navigating between pages every time
export const IMPORT_FRONTMATTER = false

export const DEFAULT_PROPERTY_PROPS = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
} satisfies Omit<Property, 'key' | 'value'>

export const TOC_HEADING_REGEX = /^h[2-6]$/
