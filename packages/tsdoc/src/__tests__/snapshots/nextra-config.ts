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
       * MathJax config. See https://docs.mathjax.org/en/latest/options/index.html
       */
      config?: "@TODO TO IMPLEMENT"
    }
  } | {
    renderer: "katex"

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
    rehypePlugins?: "@TODO TO IMPLEMENT"

    remarkPlugins?: "@TODO TO IMPLEMENT"

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