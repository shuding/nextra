# nextra-theme-blog

## 2.13.4

### Patch Changes

- nextra@2.13.4

## 2.13.3

### Patch Changes

- Updated dependencies [93b57052]
  - nextra@2.13.3

## 2.13.2

### Patch Changes

- ad7b31b0: downgrade remark-math from `6` to `5.1.1` to fix
  `TypeError: Cannot read properties of undefined (reading 'mathFlowInside')`
  error

  fix support of ```math lang that was overridden by `rehype-pretty-code`

- Updated dependencies [ad7b31b0]
  - nextra@2.13.2

## 2.13.1

### Patch Changes

- Updated dependencies [ee02a483]
  - nextra@2.13.1

## 2.13.0

### Patch Changes

- nextra@2.13.0

## 2.12.3

### Patch Changes

- Updated dependencies [ffb6d808]
  - nextra@2.12.3

## 2.12.2

### Patch Changes

- Updated dependencies [7c8c4989]
  - nextra@2.12.2

## 2.12.1

### Patch Changes

- Updated dependencies [52ae8fc5]
  - nextra@2.12.1

## 2.12.0

### Minor Changes

- 8962597e: - allow override static image component that was hardcoded to
  `import Image from 'next/image'` now it's plain `<img />`

  - support `<details />`/`<summary />` for `.md` files

### Patch Changes

- Updated dependencies [d9820746]
- Updated dependencies [fbf003cd]
- Updated dependencies [8962597e]
  - nextra@2.12.0

## 2.11.1

### Patch Changes

- cf5f91ea: fix footnotes and backlink jump
- 4dd720ad: remove `font-weight: 500;` from styles of code blocks since it gives
  no effect
- Updated dependencies [ddddce95]
- Updated dependencies [6154e312]
- Updated dependencies [46743ba4]
- Updated dependencies [4dd720ad]
  - nextra@2.11.1

## 2.11.0

### Minor Changes

- 3bb480a4: support draft posts via frontMatter's `draft: true` value

### Patch Changes

- 3bb480a4: use github-slugger for custom heading ids to prevent duplicated
  headings
- 3bb480a4: fix code blocks `box-decoration-theme: clone` can create confusing
  output over line breaks, use `slice` instead
- Updated dependencies [3bb480a4]
- Updated dependencies [3bb480a4]
- Updated dependencies [3bb480a4]
- Updated dependencies [3bb480a4]
  - nextra@2.11.0

## 2.10.0

### Minor Changes

- e54b008: - add `@theguild/remark-npm2yarn` package that replaces the code
  block that has `npm2yarn` metadata with `<Tabs />` and `<Tab />` components
  from `nextra/components`.

  - `<Tabs />` now has `selectedKey` prop, the chosen tab is saved in the local
    storage, which will be chosen in future page renders.

  More info https://nextra.site/docs/guide/advanced/npm2yarn

### Patch Changes

- Updated dependencies [e54b008]
  - nextra@2.10.0

## 2.9.0

### Minor Changes

- 16bbb88: Move below packages to nextra package

  - `<Cards />` and `<Card />`
  - `<Tabs />` and `<Tab />`
  - `<Steps />`
  - `<FileTree />`

  to import them you can use the following in your official `nextra-theme-blog`
  and `nextra-theme-docs`

  ```js
  import { Card, Cards } from 'nextra/components'
  ```

  ```js
  import { Tab, Tabs } from 'nextra/components'
  ```

  ```js
  import { Steps } from 'nextra/components'
  ```

  ```js
  import { FileTree } from 'nextra/components'
  ```

### Patch Changes

- b1a7eba: `opens in new tab` span element should have `user-select: none`
- Updated dependencies [16bbb88]
- Updated dependencies [23a25b1]
  - nextra@2.9.0

## 2.8.0

### Patch Changes

- bef7324: accessibility issues for text and navbar in light mode
- 6c12bf4: fix broken code format while selecting and copying code with
  `showLineNumbers` option enabled
- Updated dependencies [6c12bf4]
  - nextra@2.8.0

## 2.7.1

### Patch Changes

- Updated dependencies [0e53ca51]
  - nextra@2.7.1

## 2.7.0

### Minor Changes

- 44626e8f: support mermaid diagrams

### Patch Changes

- Updated dependencies [44626e8f]
  - nextra@2.7.0

## 2.6.2

### Patch Changes

- 9c9625ee: Fix search not working in certain Next.js versions
- Updated dependencies [9c9625ee]
  - nextra@2.6.2

## 2.6.1

### Patch Changes

- Updated dependencies [1e9ebabc]
  - nextra@2.6.1

## 2.6.0

### Patch Changes

- 9d9bc23: accessibility issues for text and navbar in light mode
- Updated dependencies [15c4092]
- Updated dependencies [1c6256b]
  - nextra@2.6.0

## 2.5.2

### Patch Changes

- f85423a: Fix prose styles for small breakpoints
- Updated dependencies [a3601e5]
  - nextra@2.5.2

## 2.5.1

### Patch Changes

- 8aae0c9: fix: cusdis comments theme doens't change when resolvedTheme changed
- Updated dependencies [d408ab0]
  - nextra@2.5.1

## 2.5.0

### Minor Changes

- 08d393e: support ANSI highlighting

### Patch Changes

- Updated dependencies [08d393e]
  - nextra@2.5.0

## 2.4.2

### Patch Changes

- Updated dependencies [16e562d]
  - nextra@2.4.2

## 2.4.1

### Patch Changes

- Updated dependencies [a992ce1]
  - nextra@2.4.1

## 2.4.0

### Patch Changes

- Updated dependencies [545bd7c]
- Updated dependencies [0a50cad]
- Updated dependencies [259bfbc]
  - nextra@2.4.0

## 2.3.0

### Minor Changes

- 6a79462: add new option `dateFormatter`
- 76e8b0f: support custom heading id via
  `# my very long heading... [#my-custom-heading]` syntax
  https://github.com/shuding/nextra/pull/1645

### Patch Changes

- Updated dependencies [0dd028a]
- Updated dependencies [6ea1caf]
- Updated dependencies [76e8b0f]
  - nextra@2.3.0

## 2.2.20

### Patch Changes

- Updated dependencies [2e48307]
- Updated dependencies [e4c8b6d]
  - nextra@2.2.20

## 2.2.19

### Patch Changes

- Updated dependencies [e41cbbc]
- Updated dependencies [a1e59b2]
  - nextra@2.2.19

## 2.2.18

### Patch Changes

- Updated dependencies [9bd2d59]
- Updated dependencies [c2287e1]
- Updated dependencies [90cb6b8]
  - nextra@2.2.18

## 2.2.17

### Patch Changes

- Updated dependencies [4a66366]
  - nextra@2.2.17

## 2.2.16

### Patch Changes

- b94245a: Reverts #1417 "force theme to light if darkMode: false was set"
- d495e5f: introduce `_app.mdx` for better performance and smallest
  `.next/static/chunks` size
- Updated dependencies [d495e5f]
  - nextra@2.2.16

## 2.2.15

### Patch Changes

- 2e441b7: open http:// links in new window
- da585a8: force theme to `light` if `darkMode: false` was set
- 3e9e54f: hide unnecessary parts of the pages when being printed
- Updated dependencies [d5aa17c]
- Updated dependencies [016828e]
- Updated dependencies [b3219c3]
  - nextra@2.2.15

## 2.2.14

### Patch Changes

- Updated dependencies [bcaba9c]
- Updated dependencies [a683c84]
- Updated dependencies [a404ef7]
  - nextra@2.2.14

## 2.2.13

### Patch Changes

- d1d873f: typed frontmatter -> `useConfig<YOUR_FRONTMATTER_TYPE>`
- 6626356: prefer `import type`
- 2234a13: fix raw `__esModule` string ☠️
- Updated dependencies [d1d873f]
- Updated dependencies [6626356]
- Updated dependencies [2234a13]
  - nextra@2.2.13

## 2.2.12

### Patch Changes

- c913ec8: add peer deps
- Updated dependencies [619ae3a]
  - nextra@2.2.12

## 2.2.11

## 2.2.10

## 2.2.9

## 2.2.8

## 2.2.7

## 2.2.6

## 2.2.5

### Patch Changes

- 163065c: loader refactor, type-safe `__nextra_resolvePageMap`, avoid code
  interpolation in loader.ts

## 2.2.4

### Patch Changes

- 091b77b: fix missing filename

  add filename / copy code with "codeHighlight: false"

  add unit tests for filename and copy code

## 2.2.3

### Patch Changes

- 11b2870: fix copy code button position

## 2.2.2

### Patch Changes

- 3145f53: extend `plugin:react/recommended`, `plugin:react-hooks/recommended`
  and `plugin:@next/next/recommended` configs
- 1834730: fix hydration error produced by cached compiler, fix broken
  code-blocks styles while setting `nextraConfig.codeHighlight: false`

## 2.2.1

## 2.2.0

### Minor Changes

- e4b20ca: support `transform` in nextra config

### Patch Changes

- af76dbe: fix highlight substring from filename for code blocks

## 2.1.0

### Minor Changes

- e5262d0: improve hmr and internal api for layout (toc and meta files)

### Patch Changes

- 09fc32a: allow changing prefix in `<TagTitle />`
- c86508c: lint fixes for `eslint:recommended` and
  `plugin:@typescript-eslint/recommended` configs
- 329bc8c: fix inline code blocks style regression
- d6c871a: simplify the custom theme layout api
- 1ff43c1: use OKLCH colors where possible
- ef3008d: `•` separator is missing if tags are empty
- c86508c: allow override components with new options `components` #1201
- a31678a: improve copy

## 2.0.3

## 2.0.2

### Patch Changes

- 99ec64e: fix indentation for copy code button
- f488e2e: remove @react/skip-nev #1051

  fix: staticImage should only set blur placeholder for jpeg,png,webp,avif

## 2.0.1

### Patch Changes

- a9748aa: fix: A11y improvements to the docs theme
- 93af338: feat: static tags for blog theme
- ac82b1f: make code-blocks buttons focusable if they are visible on page
- 0ca195c: inform screen readers of externals links that open in a new tabs

## 2.0.0

### Patch Changes

- 94ef0b3: improve 2.0 docs
- 8f55c80: fix(nextra-theme-blog): unneeded spread for `<a/>`
- 6644bd5: pass unstable_flexsearch
- cef5546: allow headings contain links
- 2217f9c: fix `Warning: Prop `href` did not match. Server: "#" Client: ...`
- fdb2f57: update docs to use next.js 13
- a0398e0: fix: avoid mutating nextConfig
- 59e18b0: make `nextra`/`nextra-theme-docs`/`nextra-theme-blog` be compatible
  with next 13
- a5cac21: [blog]: add support for `showLineNumbers` prop in code-blocks
- fe2b714: upgrade to react 18
- 1ee3c92: reuse table styles from docs in blog
- f569d90: missing `nx-` class prefixes in blog fix callout padding in docs
- b1d7361: improve docs for 2.0
- 8dab966: fix invisible copy button in code blocks
- 0518b1b: improve tags styling
- 29dc746: fix blog build error
- b7f7cf6: add missing `passHref` for `NextLink`
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add
  `NextraConfig.unstable_defaultShowCopyCode` option to show button by default,
  add `copy` and `copy=false` options for code-blocks
- a5cac21: [docs/blog]: extract code styles and import in both themes
- 580c433: add nx- to all tailwind classes for style isolation
- c3e6227: add `overflow-x-scroll` for tables
- 1c3fedb: add missing `nx-` prefixes to table/th/tr elements
- 4fd7c53: chore(nextra-theme-blog): refactor `sort-date.ts`.
- 78f1519: chore: Add strict-peer-dependencies=false
- 4edca5e: chore(nextra-theme-blog): refactor `traverse.ts`
- acf3a1f: fix(blog): types is missing in bundle
- 3de0f41: chore(blog/docs): use `postcss-import` to import css variables styles
- 74a3398: update docs for 2.0
- 3ef42cb: fix(nextra-theme-blog): move css to `className`s, fix duplicate id
  issue
- bd2cefa: Fix css classes with `eslint-plugin-tailwindcss`
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- 009bf6a: Fix release workflow.
- 4157b71: fix: make cusdis a component
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 723d42a: use `lightningcss` instead `cssnano`
- 64ae4b5: add `nextraConfig.unstable_readingTime` option for blog theme
- 596ea52: fix(nextra-theme-blog): make nav items center aligned
- 7d2d5ee: use resolvedTheme instead renderedTheme + theme check
- 256154a: use "next/future/image" if
  `"experimental.images.allowFutureImage": true` is set in next config
- c8605d6: feat: New layout implementation
- 4157b71: set lower build target and share code highlight theme through nextra
- 94a8587: chore: extract `svg` icons in `/icons` folder, reusing same icons
  `<MoonIcon />` / `<SunIcon />` in blog from docs
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 256154a: replace images with `<NextImage />` even when url not relative but
  that starts from `/` (public directory)
- e573175: Fix release CI
- 48e0ac2: export `useConfig` and `useTheme`
- 0f4795f: chore(nextra/blog/docs): provide types for PageOpts in loader
- 71528f1: show copy code button only on hover of container
- 03e90d8: refresh build system with tsup and fix nextra type
- e6771ca: rename `PageOpts.meta` to `PageOpts.frontMatter`
- e6771ca: move `withLayout` logic directly in nextra loader
- 43409ad: fix: mdx theme is missing
- e596d3d: add missing class names to override styles
- 07e4732: [nextra-theme-blog]: fix
  `Application error: a client-side exception has occurred` when invalid date
  was provided in frontmatter + TESTS

## 2.0.0-beta.45

## 2.0.0-beta.44

### Patch Changes

- 94ef0b3: improve 2.0 docs
- fdb2f57: update docs to use next.js 13
- b1d7361: improve docs for 2.0
- 74a3398: update docs for 2.0

## 2.0.0-beta.43

### Patch Changes

- 59e18b0: make `nextra`/`nextra-theme-docs`/`nextra-theme-blog` be compatible
  with next 13

## 2.0.0-beta.42

## 2.0.0-beta.41

### Patch Changes

- bd2cefa: Fix css classes with `eslint-plugin-tailwindcss`

## 2.0.0-beta.40

### Patch Changes

- f569d90: missing `nx-` class prefixes in blog fix callout padding in docs

## 2.0.0-beta.39

## 2.0.0-beta.38

## 2.0.0-beta.37

## 2.0.0-beta.36

### Patch Changes

- 1c3fedb: add missing `nx-` prefixes to table/th/tr elements

## 2.0.0-beta.35

## 2.0.0-beta.34

## 2.0.0-beta.33

### Patch Changes

- 580c433: add nx- to all tailwind classes for style isolation

## 2.0.0-beta.32

### Patch Changes

- 723d42a: use `lightningcss` instead `cssnano`

## 2.0.0-beta.31

### Patch Changes

- cef5546: allow headings contain links

## 2.0.0-beta.30

### Patch Changes

- b7f7cf6: add missing `passHref` for `NextLink`
- 7d2d5ee: use resolvedTheme instead renderedTheme + theme check

## 2.0.0-beta.29

## 2.0.0-beta.28

## 2.0.0-beta.27

## 2.0.0-beta.26

## 2.0.0-beta.25

### Patch Changes

- c3e6227: add `overflow-x-scroll` for tables
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 256154a: use "next/future/image" if
  `"experimental.images.allowFutureImage": true` is set in next config
- 256154a: replace images with `<NextImage />` even when url not relative but
  that starts from `/` (public directory)

## 2.0.0-beta.24

## 2.0.0-beta.23

## 2.0.0-beta.22

### Patch Changes

- 8dab966: fix invisible copy button in code blocks

## 2.0.0-beta.21

## 2.0.0-beta.20

### Patch Changes

- 1ee3c92: reuse table styles from docs in blog
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add
  `NextraConfig.unstable_defaultShowCopyCode` option to show button by default,
  add `copy` and `copy=false` options for code-blocks
- 64ae4b5: add `nextraConfig.unstable_readingTime` option for blog theme
- 71528f1: show copy code button only on hover of container
- e6771ca: rename `PageOpts.meta` to `PageOpts.frontMatter`
- e6771ca: move `withLayout` logic directly in nextra loader

## 2.0.0-beta.19

## 2.0.0-beta.18

### Patch Changes

- 0518b1b: improve tags styling

## 2.0.0-beta.17

### Patch Changes

- 2217f9c: fix `Warning: Prop`href`did not match. Server: "#" Client: ...`

## 2.0.0-beta.16

### Patch Changes

- 48e0ac2: export `useConfig` and `useTheme`
- 43409ad: fix: mdx theme is missing

## 2.0.0-beta.15

## 2.0.0-beta.14

### Patch Changes

- c8605d6: feat: New layout implementation
- e596d3d: add missing class names to override styles

## 2.0.0-beta.13

### Patch Changes

- 4157b71: fix: make cusdis a component
- 4157b71: set lower build target and share code highlight theme through nextra

## 2.0.0-beta.12

### Patch Changes

- a5cac21: [blog]: add support for `showLineNumbers` prop in code-blocks
- 29dc746: fix blog build error
- a5cac21: [docs/blog]: extract code styles and import in both themes
- 3de0f41: chore(blog/docs): use `postcss-import` to import css variables styles
- 0f4795f: chore(nextra/blog/docs): provide types for PageOpts in loader
- 07e4732: [nextra-theme-blog]: fix
  `Application error: a client-side exception has occurred` when invalid date
  was provided in frontmatter + TESTS

## 2.0.0-beta.11

### Patch Changes

- a0398e0: fix: avoid mutating nextConfig
- fe2b714: upgrade to react 18
- 78f1519: chore: Add strict-peer-dependencies=false

## 2.0.0-beta.10

### Patch Changes

- 3ef42cb: fix(nextra-theme-blog): move css to `className`s, fix duplicate id
  issue
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 03e90d8: refresh build system with tsup and fix nextra type

## 2.0.0-beta.9

### Patch Changes

- 6644bd5: pass unstable_flexsearch
- 4fd7c53: chore(nextra-theme-blog): refactor `sort-date.ts`.
- 4edca5e: chore(nextra-theme-blog): refactor `traverse.ts`
- acf3a1f: fix(blog): types is missing in bundle
- 596ea52: fix(nextra-theme-blog): make nav items center aligned
- 94a8587: chore: extract `svg` icons in `/icons` folder, reusing same icons
  `<MoonIcon />` / `<SunIcon />` in blog from docs
- e573175: Fix release CI

## 2.0.0-beta.8

### Patch Changes

- 009bf6a: Fix release workflow.

## 2.0.0-beta.7

### Patch Changes

- 8f55c80: fix(nextra-theme-blog): unneeded spread for `<a/>`
