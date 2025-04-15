type $ = {
  /**
   * Enable the global feature for showing a copy code button in code blocks.
   */
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
   * Option to automatically optimizing your static image imports with the Markdown syntax. E.g. `![Hello](/demo.png)`.
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
      config?: MathJax3Config
    }
  } | {
    renderer: "katex"

    /**
     * KaTeX options. See https://katex.org/docs/options.html.
     */
    options?: RehypeKatexOptions
  }

  /**
   * Enable or disable syntax highlighting.
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
    rehypePlugins?: PluggableList | null

    /**
     * List of remark plugins.
     */
    remarkPlugins?: PluggableList | null

    /**
     * List of recma plugins. This is a new ecosystem, currently in beta, to transform esast trees (JavaScript).
     */
    recmaPlugins?: PluggableList | null

    /**
     * Format of the file.
`'md'` means treat as markdown and `'mdx'` means treat as MDX. `'detect'` means try to detect the format based on file path.
     * @default "detect"
     */
    format?: "detect" | "mdx" | "md"

    /**
     * @default {}
     */
    rehypePrettyCodeOptions?: RehypePrettyCodeOptions
  }

  /**
   * Allows you to whitelist HTML elements to be replaced with components defined in the `mdx-components.js` file.
By default, Nextra only replaces `<details>` and `<summary>` elements.
   */
  whiteListTagsStyling?: string[]

  /**
   * Option to serve your `.md` and `.mdx` files from the `content` directory at a custom path instead of the root (`/`).
   * @default "/"
   */
  contentDirBasePath?: string

  /**
   * @default false
   */
  unstable_shouldAddLocaleToLinks?: boolean
}