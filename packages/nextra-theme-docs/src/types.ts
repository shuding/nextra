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
  /**
   * A subset of configurations for https://github.com/pacocoursey/next-themes#themeprovider
   * - defaultTheme
   * - storageKey
   * - forcedTheme
   */
  nextThemes?: object
  defaultMenuCollapsed?: boolean
  font?: boolean
  footer?: boolean
  footerText?: string
  footerEditLink?: string
  feedbackLink?: string
  feedbackLabels?: string
  head?:
    | React.ReactNode
    | React.FC<{
        locale: string
        config: DocsThemeConfig
        title: string
        meta: Record<string, any>
      }>
  metaDescription?: string;
  logo?: React.ReactNode
  direction?: string
  i18n?: { locale: string; text: string; direction: string }[]
  customSearch?: boolean
  searchPlaceholder?: string | ((props: { locale?: string }) => string)
  projectLink?: string
  github?: string
  projectLinkIcon?: React.FC<{ locale: string }>
  projectChatLink?: string
  projectChatLinkIcon?: React.FC<{ locale: string }>
  sidebarSubtitle?: React.FC<{ title: string }>
  floatTOC?: boolean
  banner?: React.FC<{ locale: string }>
  bannerKey?: string
  gitTimestamp?: string | React.FC<{ locale: string; timestamp: Date }>
  tocExtraContent?: React.FC<{ locale: string }>
  unstable_faviconGlyph?: string
  unstable_flexsearch?: boolean
  unstable_searchResultEmpty?:
    | React.ReactNode
    | React.FC<{
        locale: string
        config: DocsThemeConfig
        title: string
        meta: Record<string, any>
      }>
}
