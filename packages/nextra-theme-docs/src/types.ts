export interface DocsThemeConfig {
  docsRepositoryBase?: string
  titleSuffix?:
    | string
    | React.FC<{
        locale: string
        config: DocsThemeConfig
        title: string
        meta: Record<string, any>
      }>
  nextLinks?: boolean
  prevLinks?: boolean
  search?: boolean
  darkMode?: boolean
  defaultMenuCollapsed?: boolean
  font?: boolean
  footer?: boolean
  footerText?: string
  footerEditLink?: string
  head?:
    | React.ReactNode
    | React.FC<{
        locale: string
        config: DocsThemeConfig
        title: string
        meta: Record<string, any>
      }>
  logo?: React.ReactNode
  direction?: string
  i18n?: { locale: string; text: string; direction: string }[]
  unstable_faviconGlyph?: string
  customSearch?: boolean
  unstable_stork?: boolean
  projectLink?: string
  github?: string
  projectLinkIcon?: React.FC<{ locale: string }>
  projectChatLink?: string
  projectChatLinkIcon?: React.FC<{ locale: string }>
  floatTOC?: boolean
}
