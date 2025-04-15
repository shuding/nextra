type $ = {
  /**
   * Enable the copy button for all code blocks by default, without needing to set `copy=true` in the code block metadata.
You can still disable the button for specific blocks using `copy=false`.
   */
  defaultShowCopyCode?: boolean

  /**
   * Option to enable search functionality. When enabled, it sets the `data-pagefind-body` attribute on the `<main>` element.

When set to `codeblocks: false`, it adds the `data-pagefind-ignore="all"` attribute to all code blocks (`<pre>` elements).
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

  /**
   * Adds estimated reading time of `.md` and `.mdx` files using https://npmjs.com/package/reading-time.
The reading time is added to the front matter under the `readingTime` key.
   */
  readingTime?: boolean

  /**
   * Enable LaTeX either with KaTeX (https://katex.org) to pre-render LaTeX expressions directly in MDX or MathJax (https://mathjax.org) to dynamically render math in the browser.
   */
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
   * Adds locale to all links in page map information. Useful for i18n when you don't want to use Nextra's `middleware` function.
   * @default false
   */
  unstable_shouldAddLocaleToLinks?: boolean
}