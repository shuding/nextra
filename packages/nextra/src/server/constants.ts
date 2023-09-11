/*
 * Benefit of server/constants - do not include unneeded `path` polyfill in client bundle,
 * while importing constants in client file
 */
import path from 'node:path'
import type { NextraConfig } from '../types'

export {
  DEFAULT_LOCALE,
  ERROR_ROUTES,
  MARKDOWN_EXTENSION_REGEX
} from '../client/constants.js'

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

export const META_FILENAME = '_meta.json'

export const META_REGEX = /_meta\.[jt]sx?$/

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const

export const EXTERNAL_URL_REGEX = /^https?:\/\//

export const CODE_BLOCK_FILENAME_REGEX = /filename="([^"]+)"/

export const DEFAULT_LOCALES = ['']
