export interface LayoutProps {
  /**
   * Rendered [`<Banner>` component](/docs/built-ins/banner). E.g. `<Banner {...bannerProps} />`
   */
  banner?: React.ReactNode

  children: React.ReactNode

  /**
   * Show or hide the dark mode select button.
   * @default true
   */
  darkMode?: boolean

  /**
   * URL of the documentation repository.
   * @default "https://github.com/shuding/nextra"
   */
  docsRepositoryBase?: string

  /**
   * Content of the edit link.
   * @default "Edit this page"
   */
  editLink?: React.ReactNode

  /**
   * @default {
   *   "content": "Question? Give us feedback",
   *   "labels": "feedback"
   * }
   */
  feedback?: {
    /**
     * Content of the feedback link.
     * @default "Question? Give us feedback"
     */
    content?: React.ReactNode

    /**
     * Labels that can be added to the new created issue.
     * @default "feedback"
     */
    labels?: string

    /**
     * Feedback link URL.
     * 
     * By default, it's a link to the issue creation form of the docs repository, with the current page title prefilled:
     * [example](https://github.com/shuding/nextra/issues/new?title=Feedback%20for%20%E2%80%9CTheme%20Configuration%E2%80%9D&labels=feedback).
     */
    link?: string
  }

  /**
   * Rendered [`<Footer>` component](/docs/docs-theme/built-ins/footer). E.g. `<Footer {...footerProps} />`
   */
  footer?: React.ReactNode

  /**
   * Options to configure the language dropdown for [the i18n docs website](/docs/guide/i18n).
   * @default []
   */
  i18n?: {
    /**
     * Locale from `i18n.locales` field in `next.config` file.
     */
    locale: string

    /**
     * Locale name in dropdown.
     */
    name: string
  }[]

  /**
   * Component to render the last updated info.
   * @default <LastUpdated />
   */
  lastUpdated?: React.ReactElement

  /**
   * Rendered [`<Navbar>` component](/docs/docs-theme/built-ins/navbar). E.g. `<Navbar {...navbarProps} />`
   */
  navbar?: React.ReactNode

  /**
   * Enable or disable navigation link.
   * @default true
   */
  navigation?: boolean | {
    next: boolean

    prev: boolean
  }

  /**
   * Configuration for the [next-themes](https://github.com/pacocoursey/next-themes#themeprovider) package.
   * @default {
   *   "attribute": "class",
   *   "defaultTheme": "system",
   *   "disableTransitionOnChange": true,
   *   "storageKey": "theme"
   * }
   */
  nextThemes?: {
    /**
     * @default "class"
     */
    attribute?: 'class' | `data-${string}` | ('class' | `data-${string}`)[]

    /**
     * @default "system"
     */
    defaultTheme?: string

    /**
     * @default true
     */
    disableTransitionOnChange?: boolean

    forcedTheme?: string

    /**
     * @default "theme"
     */
    storageKey?: string
  }

  /**
   * Page map list. Result of `getPageMap(route = '/')` call.
   */
  pageMap: import("nextra").PageMapItem[]

  /**
   * Rendered [`<Search>` component](/docs/built-ins/search). E.g. `<Search {...searchProps} />`
   * @default <Search />
   */
  search?: React.ReactNode

  /**
   * @default {
   *   "defaultMenuCollapseLevel": 2,
   *   "defaultOpen": true,
   *   "toggleButton": true
   * }
   */
  sidebar?: {
    /**
     * If `true`, automatically collapse inactive folders above `defaultMenuCollapseLevel`.
     */
    autoCollapse?: boolean

    /**
     * Specifies the folder level at which the menu on the left is collapsed by default.
     * @default 2
     */
    defaultMenuCollapseLevel?: number

    /**
     * Hide/show sidebar by default.
     * @default true
     */
    defaultOpen?: boolean

    /**
     * Hide/show sidebar toggle button.
     * @default true
     */
    toggleButton?: boolean
  }

  /**
   * Translation of options in the theme switch.
   * @default {
   *   "dark": "Dark",
   *   "light": "Light",
   *   "system": "System"
   * }
   */
  themeSwitch?: {
    /**
     * @default "Dark"
     */
    dark?: string

    /**
     * @default "Light"
     */
    light?: string

    /**
     * @default "System"
     */
    system?: string
  }

  /**
   * @default {
   *   "backToTop": "Scroll to top",
   *   "float": true,
   *   "title": "On This Page"
   * }
   */
  toc?: {
    /**
     * Text of back to top button.
     * @default "Scroll to top"
     */
    backToTop?: React.ReactNode

    /**
     * Display extra content below the TOC content.
     */
    extraContent?: React.ReactNode

    /**
     * Float the TOC next to the content.
     * @default true
     */
    float?: boolean

    /**
     * Title of the TOC sidebar.
     * @default "On This Page"
     */
    title?: React.ReactNode
  }
}