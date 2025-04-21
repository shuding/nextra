export interface NextraConfig {
  /**
   * Enable the copy button for all code blocks by default, without needing to set `copy=true` attribute in the code block metadata.
   * > [!TIP]
   * >
   * > You could still disable the button for specific blocks using `copy=false` attribute.
   */
  defaultShowCopyCode?: boolean

  /**
   * Option to enable search functionality. When enabled, it sets the `data-pagefind-body` attribute on the `<main>` element.
   * > [!TIP]
   * >
   * > When set to `codeblocks: false`, it adds the `data-pagefind-ignore="all"` attribute to all code blocks (`<pre>` elements).
   * @default {
   *   "codeblocks": false
   * }
   */
  search?: boolean | {
    /**
     * Whether to index code blocks.
     */
    codeblocks: boolean
  }

  /**
   * Option to automatically optimizing your static image imports with the Markdown syntax.
   * > [!TIP]
   * >
   * > Example: `![Hello](/demo.png)`.
   * @default true
   */
  staticImage?: boolean

  /**
   * Adds estimated reading time of `.md` and `.mdx` files using [readingTime](https://npmjs.com/package/reading-time) package.
   * > [!TIP]
   * >
   * > The reading time is added to the front matter under the `readingTime` key.
   */
  readingTime?: boolean

  /**
   * Enable LaTeX either with [KaTeX](https://katex.org) to pre-render LaTeX expressions directly in MDX or [MathJax](https://mathjax.org) to dynamically render math in the browser.
   */
  latex?: boolean | {
    renderer: "mathjax"

    options?: {
      /**
       * URL for MathJax.
       * @default "https://cdnjs.cloudflare.com"
       */
      src?: string

      /**
       * MathJax config. See [configuring MathJax](https://docs.mathjax.org/en/latest/options/index.html).
       */
      config?: import("better-react-mathjax").MathJax3Config
    }
  } | {
    renderer: "katex"

    /**
     * KaTeX options. See https://katex.org/docs/options.html.
     */
    options: import("rehype-katex").Options
  }

  /**
   * Enable or disable syntax highlighting.
   * @default true
   */
  codeHighlight?: boolean

  /**
   * Options specific to MDX compiling.
   * @remarks `MdxOptions`
   * @default {
   *   "format": "detect",
   *   "rehypePrettyCodeOptions": {}
   * }
   */
  mdxOptions?: {
    /**
     * List of rehype plugins.
     */
    rehypePlugins?: import("@mdx-js/mdx").ProcessorOptions["rehypePlugins"]

    /**
     * List of remark plugins.
     */
    remarkPlugins?: import("@mdx-js/mdx").ProcessorOptions["remarkPlugins"]

    /**
     * List of recma plugins. This is a new ecosystem, currently in beta, to transform esast trees (JavaScript).
     */
    recmaPlugins?: import("@mdx-js/mdx").ProcessorOptions["recmaPlugins"]

    /**
     * Format of the file.
     * - `'md'` means treat as markdown
     * - `'mdx'` means treat as MDX
     * - `'detect'` means try to detect the format based on file path.
     * @default "detect"
     */
    format?: "detect" | "mdx" | "md"

    /**
     * Configuration options for [Rehype Pretty Code](https://github.com/rehype-pretty/rehype-pretty-code).
     * @remarks `RehypePrettyCodeOptions`
     * @default {}
     */
    rehypePrettyCodeOptions?: import("rehype-pretty-code").Options
  }

  /**
   * Allows you to whitelist HTML elements to be replaced with components defined in the `mdx-components.js` file.
   * > [!TIP]
   * >
   * > By default, Nextra only replaces `<details>` and `<summary>` elements.
   */
  whiteListTagsStyling?: string[]

  /**
   * Option to serve your `.md` and `.mdx` files from the `content` directory at a custom path instead of the root (`/`).
   * @default "/"
   */
  contentDirBasePath?: string

  /**
   * Prefixes locale to all links in the page map information. Useful for i18n when you don't want to use Nextra's `middleware` function.
   * @default false
   */
  unstable_shouldAddLocaleToLinks?: boolean
}

export interface HeadProps {
  /**
   * @default {
   *   "hue": {
   *     "dark": 204,
   *     "light": 212
   *   },
   *   "saturation": {
   *     "dark": 100,
   *     "light": 100
   *   },
   *   "lightness": {
   *     "dark": 55,
   *     "light": 45
   *   }
   * }
   */
  color?: {
    /**
     * The hue of the primary theme color.<br/>Range: `0 - 360`
     * @default {
     *   "dark": 204,
     *   "light": 212
     * }
     */
    hue?: number | {
      dark: number

      light: number
    }

    /**
     * The saturation of the primary theme color.<br/>Range: `0 - 100`
     * @default 100
     */
    saturation?: number | {
      dark: number

      light: number
    }

    /**
     * The lightness of the primary theme color.<br/>Range: `0 - 100`
     * @default {
     *   "dark": 55,
     *   "light": 45
     * }
     */
    lightness?: number | {
      dark: number

      light: number
    }
  }

  /**
   * The glyph to use as the favicon.
   */
  faviconGlyph?: string

  /**
   * @default {
   *   "dark": "17,17,17",
   *   "light": "250,250,250"
   * }
   */
  backgroundColor?: {
    /**
     * Background color for dark theme.<br/>Format: `"rgb(RRR,GGG,BBB)" | "#RRGGBB"`
     * @default "rgb(17,17,17)"
     */
    dark?: string

    /**
     * Background color for light theme.<br/>Format: `"rgb(RRR,GGG,BBB)" | "#RRGGBB"`
     * @default "rgb(250,250,250)"
     */
    light?: string
  }

  /**
   * Content of `<head>`.
   */
  children?: React.ReactNode
}