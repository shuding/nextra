type $ = {
  defaultShowCopyCode?: boolean

  /**
   * @default {"codeblocks":false}
   */
  search?: boolean | {
    /**
     * Whether to index code blocks.
     */
    codeblocks: boolean
  }

  /**
   * @default true
   */
  staticImage?: boolean

  readingTime?: boolean

  latex?: boolean | {
    renderer: "mathjax"

    options?: {
      /**
       * URL for MathJax.
       */
      src?: string

      /**
       * MathJax config. See https://docs.mathjax.org/en/latest/options/index.html.
       */
      config?: "@TODO TO IMPLEMENT"
    }
  } | {
    renderer: "katex"

    /**
     * KaTeX options. See https://katex.org/docs/options.html.
     */
    options?: "@TODO TO IMPLEMENT"
  }

  /**
   * @default true
   */
  codeHighlight?: boolean

  /**
   * @default {"format":"detect","rehypePrettyCodeOptions":{}}
   */
  mdxOptions?: {
    /**
     * List of rehype plugins.
     */
    rehypePlugins?: "@TODO TO IMPLEMENT"

    /**
     * List of remark plugins.
     */
    remarkPlugins?: "@TODO TO IMPLEMENT"

    /**
     * List of recma plugins. This is a new ecosystem, currently in beta, to transform esast trees (JavaScript).
     */
    recmaPlugins?: "@TODO TO IMPLEMENT"

    /**
     * @default "detect"
     */
    format?: "detect" | "mdx" | "md"

    /**
     * @default {}
     */
    rehypePrettyCodeOptions?: "@TODO TO IMPLEMENT"
  }

  whiteListTagsStyling?: string[]

  /**
   * @default "/"
   */
  contentDirBasePath?: string

  /**
   * @default false
   */
  unstable_shouldAddLocaleToLinks?: boolean
}