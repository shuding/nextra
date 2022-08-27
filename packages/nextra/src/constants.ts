export const MARKDOWN_EXTENSION_REGEX = /\.mdx?$/

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const LOCALE_REGEX = /\.([a-z]{2}(-[A-Z]{2})?)$/

export const DEFAULT_LOCALE = 'en-US'

export const OFFICIAL_THEMES = [
  'nextra-theme-docs',
  'nextra-theme-blog'
] as const

export const META_FILENAME = '_meta.json'

export const CWD = process.cwd()

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const
