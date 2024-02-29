# nextra-theme-docs

## 2.13.4

### Patch Changes

- f7fc10b4: fix for the memory leak issue in the `highlight-matches.tsx`
  component when search query contain multiple whitespaces
  - nextra@2.13.4

## 2.13.3

### Patch Changes

- 93b57052: allow to disable `editLink` by specifying `editLink.component: null`
  in theme config
- 93b57052: fix `type: 'separator'` zod validation, mark `title` field as
  optional
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

- 3e5e1153: fix showing toggle sidebar button when darkmode is turned off and
  i18n was not set
- Updated dependencies [ee02a483]
  - nextra@2.13.1

## 2.13.0

### Minor Changes

- 7aec7bb5: add `primarySaturation` theme option
- a55e4aa4: update `npm2yarn`, add bun tab

### Patch Changes

- a55e4aa4: do not scroll to top while calling cmd+k in search input
  - nextra@2.13.0

## 2.12.3

### Patch Changes

- ffb6d808: - Fix
  `TypeError: Cannot read properties of null (reading 'classList')` while
  navigating to route that doesn't have toc with `router.push` for example

  - Add alias `Tabs.Tab` to `Tab` component
  - Add alias `Cards.Card` to `Card` component
  - should not attach custom heading id as id attribute if parent is `Tabs.Tab`
    or `Tab`
  - should not save to toc list headings of level 1

- Updated dependencies [ffb6d808]
  - nextra@2.12.3

## 2.12.2

### Patch Changes

- 7c8c4989: fix `Out of Memory` in search while indexing large words
- Updated dependencies [7c8c4989]
  - nextra@2.12.2

## 2.12.1

### Patch Changes

- Updated dependencies [52ae8fc5]
  - nextra@2.12.1

## 2.12.0

### Minor Changes

- d9820746: - show headings for partial md/mdx in toc

  - hide headings in toc when parent `<Tab />` or `<Tabs.Tab />`

- 63271a41: add toc.backToTop option
- 8962597e: - allow override static image component that was hardcoded to
  `import Image from 'next/image'` now it's plain `<img />`

  - support `<details />`/`<summary />` for `.md` files

### Patch Changes

- cca36d32: do not render mobile sidebar on desktop
- Updated dependencies [d9820746]
- Updated dependencies [fbf003cd]
- Updated dependencies [8962597e]
  - nextra@2.12.0

## 2.11.1

### Patch Changes

- cf5f91ea: fix footnotes and backlink jump
- ddddce95: skip search indexing for 404/500 pages
- 4dd720ad: remove `font-weight: 500;` from styles of code blocks since it gives
  no effect
- 29e35d81: fix feedback.labels for gitlab
- Updated dependencies [ddddce95]
- Updated dependencies [6154e312]
- Updated dependencies [46743ba4]
- Updated dependencies [4dd720ad]
  - nextra@2.11.1

## 2.11.0

### Minor Changes

- 3bb480a4: export `LocaleSwitch` from `nextra-theme-docs`

### Patch Changes

- 3bb480a4: use github-slugger for custom heading ids to prevent duplicated
  headings
- 3bb480a4: fix custom heading id in search result
- 3bb480a4: fix
  `Warning: Prop href did not match. Server: "/blog.en-US#" Client: "/blog#"` in
  by `normalizePages` from nextra/normalize-pages`
- 3bb480a4: improve hr contrast
- 3bb480a4: fix search, trigger the search after the Input is complete for
  languages like Chinese
- 3bb480a4: strip `.html` extension from URL route for static export
- 3bb480a4: fix memory leak in search for case `>  ` replaced previously to
  `>||` + some character provoke memory leak because `RegExp#exec` will always
  return a match
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

### Minor Changes

- b43f268: add new option `sidebar.autoCollapse` to automatically collapse
  inactive folders above `defaultMenuCollapseLevel`

### Patch Changes

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

### Minor Changes

- 1c6256b: Move Callout component to nextra package

### Patch Changes

- 15c4092: fix inconsistent `font-weight: bold` style for `type: 'menu'`
- 2d79e20: Resolves dark mode contrast problems in sidebar and breadcrumbs
- Updated dependencies [15c4092]
- Updated dependencies [1c6256b]
  - nextra@2.6.0

## 2.5.2

### Patch Changes

- Updated dependencies [a3601e5]
  - nextra@2.5.2

## 2.5.1

### Patch Changes

- Updated dependencies [d408ab0]
  - nextra@2.5.1

## 2.5.0

### Minor Changes

- 08d393e: support ANSI highlighting

### Patch Changes

- 8515349: fix Warning: React has detected a change in the order of Hooks called
  by Search
- Updated dependencies [08d393e]
  - nextra@2.5.0

## 2.4.2

### Patch Changes

- 41d4aa0: remove `nx-overflow-x-hidden` from main content
- Updated dependencies [16e562d]
  - nextra@2.4.2

## 2.4.1

### Patch Changes

- 2df6e91: Use config.useOptions text as the Select selected name on Theme
  Switch
- 7989cc5: fix regression of sidebar style for folder
- Updated dependencies [a992ce1]
  - nextra@2.4.1

## 2.4.0

### Minor Changes

- 6973b21: Add new option `headingComponent` to the TOC

### Patch Changes

- 2ff360f: use `<span />` instead `<div />` inside `<button />` for local switch
  button
- e3664c4: fix uncrawable links in sidebar, use button when link don't have href
  because it impacts on SEO

  remove useless prop children from `<FileTree.File />` component

- 8e00549: export `<Link />` component
- 61b4f0c: Wrap long section headers in TOC properly
- Updated dependencies [545bd7c]
- Updated dependencies [0a50cad]
- Updated dependencies [259bfbc]
  - nextra@2.4.0

## 2.3.0

### Minor Changes

- 707a709: Improve sidebar colors accessibility
- 76e8b0f: support custom heading id via
  `# my very long heading... [#my-custom-heading]` syntax
  https://github.com/shuding/nextra/pull/1645

### Patch Changes

- fb0b19b: Do not focus search when currently focusing a HTMLElement with
  contenteditable active
- Updated dependencies [0dd028a]
- Updated dependencies [6ea1caf]
- Updated dependencies [76e8b0f]
  - nextra@2.3.0

## 2.2.20

### Patch Changes

- 2e48307: export `normalizePages` from `nextra/normalize-pages`, `useFSRoute`
  from `nextra/hooks` (can be useful for custom theme)
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

- f29358a: always show `Cmd+K` when search input loses focus
- 7cbf5d9: rename input placeholder to "Rechercher documents..." in french
- 35d4fd1: fix `<summary />` when children contains `<p />`
- 89bbe4c: fix filetree for 2 folders
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

- 71c1897: export `<Card />`, `<Cards >/`, `<Steps />` and `<FileTree />`
- 51ec00f: fix white appearing of white square while sidebar was toggled
- 2e441b7: open http:// links in new window
- 7f697e9: prefer `asPath` over `route` in `useNextSeoProps` docs, allow `void`
  as return type of `useNextSeoProps`
- 016828e: do not redirect .mp4 in locales middleware
- da585a8: force theme to `light` if `darkMode: false` was set
- 863a750: Fixed x overflow in Callouts for long latex
- eae1993: Fix the capital letter M is displayed incorrectly on Xiaomi phones
- ad8625c: bump @headlessui/react to ^1.7.10
- 673a125: fix squeezed sidebar when he was hidden -> navigated to page without
  sidebar -> comeback to page with sidebar
- 26c7e20: fix: move intersection observe and slugs into ActiveAnchorProvider
- 3e9e54f: hide unnecessary parts of the pages when being printed
- Updated dependencies [d5aa17c]
- Updated dependencies [016828e]
- Updated dependencies [b3219c3]
  - nextra@2.2.15

## 2.2.14

### Patch Changes

- bcaba9c: fix capitalizing sidebar links + tests
- f300fe7: fix missing sidebar nav links while applying `"display": "hidden"`
  for folder
- 71257cd: style improvements
- efd8c71: fix for `theme: { footer: false }` still showed the footer
- 086cf7b: fix scrollbar for table and tabs
- Updated dependencies [bcaba9c]
- Updated dependencies [a683c84]
- Updated dependencies [a404ef7]
  - nextra@2.2.14

## 2.2.13

### Patch Changes

- 089112c: validate `_meta.json` files with zod
- 23fc5b7: style improvements
- d1d873f: typed frontmatter -> `useConfig<YOUR_FRONTMATTER_TYPE>`
- 93b9596: fix overflow for main content on desktop and mobile
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

### Patch Changes

- bcaf84a: fix treeshake of zod validation on prod build
- e10bf74: add support for remote `[...catchAll]` routes

  support meta keys with `/`

  sanitize remote mdx by removing `import` statements

- 6a0f428: add zod validation for \_meta.json "theme" property
- 6a0f428: use `z.strictObject` instead `z.object` in zod theme validation,
  improve zod error messages

## 2.2.10

### Patch Changes

- c97143f: fix search index output location
- 4b2052f: fix `Module not found: Can't resolve 'nextra-theme-docs/style.css'`
  for imported markdown files that located outside of CWD
- 624d6b4: fix when sidebar show non-md folders
- 0c957db: fix capitalizing of undefined \_meta.json file/folders

## 2.2.9

## 2.2.8

## 2.2.7

### Patch Changes

- be410bd: fix `<Collapse />` initial animation

## 2.2.6

## 2.2.5

### Patch Changes

- 5daa1c4: fix Collapse element
- 163065c: loader refactor, type-safe `__nextra_resolvePageMap`, avoid code
  interpolation in loader.ts

## 2.2.4

### Patch Changes

- 091b77b: fix missing filename

  add filename / copy code with "codeHighlight: false"

  add unit tests for filename and copy code

- 917de49: remove `github-slugger` from docs
- 1b2d7a2: allow hide sidebar, add new option
  `sidebar.toggleButton?: boolean = false`

## 2.2.3

### Patch Changes

- 11b2870: fix copy code button position
- 0cab136: pass route to titleComponent
- cd0cc63: fix defaultMenuCollapseLevel behavior

## 2.2.2

### Patch Changes

- 3145f53: extend `plugin:react/recommended`, `plugin:react-hooks/recommended`
  and `plugin:@next/next/recommended` configs
- 1834730: fix hydration error produced by cached compiler, fix broken
  code-blocks styles while setting `nextraConfig.codeHighlight: false`
- 8b9a5a0: tweak styling; fix zod checks

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

- d6b0068: Always close mobile nav when route was changed (e.g. logo click)
- 9df1d5d: fix `undefined: undefined` property in `useConfig()`
- c86508c: lint fixes for `eslint:recommended` and
  `plugin:@typescript-eslint/recommended` configs
- d6c871a: simplify the custom theme layout api
- 1ff43c1: use OKLCH colors where possible
- 0da1258: add new option `feedback.useLink`
- a3f1a90: validate theme options with `zod`
- a31678a: improve copy

## 2.0.3

### Patch Changes

- 8060ed3: style improvements

## 2.0.2

### Patch Changes

- 99ec64e: fix indentation for copy code button
- 3a08fe2: Add Callout border in dark mode
- 328ad88: support basePath with locale switch
- f488e2e: remove @react/skip-nev #1051

  fix: staticImage should only set blur placeholder for jpeg,png,webp,avif

- 5c617d4: add `aria-label` for dismiss button in banner
- b43d775: fix `Navbar />` elements `key` prop
- 105588d: fix missing border in navbar
- c1867fd: fix hydration for default `gitTimestamp` component

## 2.0.1

### Patch Changes

- a9748aa: fix: A11y improvements to the docs theme
- ac82b1f: make code-blocks buttons focusable if they are visible on page
- 0ca195c: inform screen readers of externals links that open in a new tabs

## 2.0.0

### Minor Changes

- 8f6d377: allow custom github domains

### Patch Changes

- 4731fa7: Style improvements
- 7a32f8e: remove unneeded wrappers `<div />`s in `<Navbar />`
- 9ab6dd0: allow adding additional navbar content via `navbar.extraContent`
- e6771ca: fix search overlay styles on mobile
- 94ef0b3: improve 2.0 docs
- 21009c7: fix covered select options
- bea62a1: make the search input responsive in narrow screens
- 903ddf0: fix: should update scroll when height is dynamic
- e6771ca: split css to `hamburger`/`scrollbar`/`typesetting-article` css files
- 24a02f8: reuse Flexsearch result styles on match-sorter search
- 1a7cd68: toc anchor links should have `display: inline-block`
- 6644bd5: pass unstable_flexsearch
- cef5546: allow headings contain links
- 2217f9c: fix `Warning: Prop `href` did not match. Server: "#" Client: ...`
- a0c0eb8: allow override `MDXProvider.components`
- e6771ca: fix edit on github button for cases when filename named as `index`
- 8bcb5e6: fix sideEffects in package.json
- 2217f9c: fix `next export` command
- fdb2f57: update docs to use next.js 13
- 3e3b0a9: feat: add cursor pointer to locale and theme menu
- a0398e0: fix: avoid mutating nextConfig
- e6771ca: BREAKING! various theme config options was renamed, take a look of
  renamed options
  [here](https://github.com/shuding/nextra/blob/core/packages/nextra-theme-docs/src/constants.tsx)
- 59e18b0: make `nextra`/`nextra-theme-docs`/`nextra-theme-blog` be compatible
  with next 13
- 38ccce8: feat(docs): allow `Tabs.items` as `ReadonlyArray<ReactNode>`
- fc8cca0: add `<InformationCircleIcon />` icon, improve `<Callout />` default
  emojis
- fe2b714: upgrade to react 18
- af72f85: chore(nextra-theme-docs): provide type for
  `DocsThemeConfig.nextThemes` instead of `object`
- e4cfb83: define page title in sidebar from `frontMatter.title` if page is not
  specified in `_meta.json`
- 1ee3c92: reuse table styles from docs in blog
- f569d90: missing `nx-` class prefixes in blog fix callout padding in docs
- 77361da: fix ESC button when still stays after pressed ESC
- b1d7361: improve docs for 2.0
- 9064112: make `<Tab />` accept `ComponentProps<'div'>`
- da2bea7: remove no longer used `icons` folder
- 4825365: add `@types/github-slugger` instead of manually declaring type
- 6bdb9bf: fix: broken flexsearch styles
- fdfe4f8: fix covered theme switch popup when i18n is not setup
- 66712f0: polish docs
- 873561b: scrollbar is toc should be same as in sidebar
- 08a39e6: remove `resizeObserver` for dynamic content since it provoke jumps on
  tabs switch when there is `#` anchor in url
- 4e4a37c: add new "display" property to \_meta
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add
  `NextraConfig.unstable_defaultShowCopyCode` option to show button by default,
  add `copy` and `copy=false` options for code-blocks
- a5cac21: [docs/blog]: extract code styles and import in both themes
- 96ed5c2: [nextra/nextra-theme-docs]: support both
  `experimental.newNextLinkBehavior` - `true` and `false`
- 1fef548: allow head to be a ReactNode
- 580c433: add nx- to all tailwind classes for style isolation
- c3e6227: add `overflow-x-scroll` for tables
- dfbe996: extract `<Banner />` from `<Navbar />` to `components/banner.tsx`
- 1c3fedb: add missing `nx-` prefixes to table/th/tr elements
- 78f1519: chore: Add strict-peer-dependencies=false
- c15f570: fix: query should not affect nav highlight
- 97e6141: fix(nextra/docs): fallback search to `en-US` instead `default`
- 2b6f3be: add missing border for search container
- cb87709: Fix flexsearch option being overridden
- d6d5ab8: Make sure arrows are aligned
- a007c64: move DEFAULT_THEME and DEFAULT_PAGE_THEME to constants.tsx
- ab6c0e6: fix disappearing toc issue in Firefox
- 16bedce: `"layout": "raw"` should render `all` unstyled elements, except
  `<a />`
- a0e5847: Rename some docs theme configurations
- 351fa45: add missing `nx-` prefix for `grow` class in `<LocaleSwitch />`
- c09f450: fix CTRL+K, on non non-mac use `e.ctrlKey` instead `e.metaKey`
- f5bf2e4: fix margin-top for `<Tab />` content
- 237faa9: add clear button for search input
- 973ca49: fix rtl/ltr glitch on initial loading
- c8129a2: fix theme switcher style
- 3de0f41: chore(blog/docs): use `postcss-import` to import css variables styles
- 2e2912e: fix project/chat icon could appear without provided link
- 97ca2e3: New feature: menu type
- 84d983f: fix(docs): correct query for hash with leading num
- 32cd385: add new option `search.loading` for control loading text
- 2533a6c: replace `main.extraContent` theme option with `main` option
- 4730bdc: chore(nextra-theme-docs): refactor `theme-context.ts`
- 24a02f8: typescripify `<Flexsearch />`
- 74a3398: update docs for 2.0
- bd2cefa: Fix css classes with `eslint-plugin-tailwindcss`
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- 5d852b6: break words in navlinks, remove unneeded `<div />` wrappers, align
  text on right side for next link
- e6771ca: hide search input in navbar on mobile
- 76d1e30: [nextra-theme-docs]: fix `Warning: A title element received an array`
  and possible `[object Object]` in title
- 009bf6a: Fix release workflow.
- 5238bb4: feat(docs): support logoLink config option
- e6771ca: fix empty space in navbar when theme option `search.component: null`
- e6771ca: add `editLink.component`
- ee270a4: fix extra space in flexsearch input after loading indexes
- e6771ca: rename `meta.json` to `_meta.json`
- 24a02f8: fix all RTL broken styles
- 0c136ad: add missing `nx-` prefix in sidebar
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 2217f9c: replace `classnames` package with `clsx` as he's faster
- e6771ca: clicking on folder should navigate to first children if `index` page
  doesn't exist
- 723d42a: use `lightningcss` instead `cssnano`
- bf74201: [nextra-theme-docs]: use new opacity modifier syntax for tailwindcss
- a8c5883: add `config.bodyExtraContent` option
- e2d603a: remove `getComponents` export, export `useMDXComponents` from
  `@mdx-js/react` instead
- 8564919: extract `<Input/>` from `<Search/>` and `<Flexsearch/>`
- 05d068c: Add button label for hamburger menu
- 38769ca: prefer `ref.current.querySelector` over `document.querySelector`,
  remove `load` prop in `<Search />`
- b219821: fix body overflow
- d7f2bbc: adjust docs theme; rename options
- 24a02f8: match-sorter search should highlight every match like flexsearch
- 2217f9c: remove `locale` prop from theme config, forbid passing in
  `renderComponent`
- 7d2d5ee: use resolvedTheme instead renderedTheme + theme check
- 256154a: use "next/future/image" if
  `"experimental.images.allowFutureImage": true` is set in next config
- 9f5af54: add `_meta.json#theme.collapsed` option for control state sidebar's
  folders
- c8605d6: feat: New layout implementation
- 4157b71: set lower build target and share code highlight theme through nextra
- c28a7f2: - setup `next-seo`
  - add new theme option `getNextSeoProps`
  - remove `titleSuffix` theme option in favor of
    `getNextSeoProps.titleTemplate`
  - by default pass `description`, `canonical`, `openGraph` values to
    `<NextSeo />` component from page `frontMatter`, values can be overridden
    with return value of `getNextSeoProps`
- f360f28: add new theme option `banner.dismissible`
- 7bcbc98: add new `meta.json#theme.timestamp` option to hide
  `Last updated on ...`
- 94a8587: chore: extract `svg` icons in `/icons` folder, reusing same icons
  `<MoonIcon />` / `<SunIcon />` in blog from docs
- d16b2ba: move contexts to `./contexts` directory
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 47938b1: remove unneeded `useRef` for `<details />`
- 256154a: replace images with `<NextImage />` even when url not relative but
  that starts from `/` (public directory)
- e573175: Fix release CI
- 48e0ac2: export `useConfig` and `useTheme`
- 21009c7: better focus ui, use ring color as theme hue color
- 0f4795f: chore(nextra/blog/docs): provide types for PageOpts in loader
- 71528f1: show copy code button only on hover of container
- 03e90d8: refresh build system with tsup and fix nextra type
- afaa26a: refactor toc, fix toc's styles on rtl, use `ref.current` instead
  `document.getElementsByClassName`
- c380989: fix(docs): types is missing in bundle
- 7373c1f: fix `useConfig`/`useRouter` inside `head()`
- e6771ca: fix callout shrinking from children content
- fb37b5f: Close selector bracket for compat with old Safari.
- e6771ca: rename `PageOpts.meta` to `PageOpts.frontMatter`
- ab629e6: Add correct aria values inside nav
- cdc1c2f: prefer `ref.current` over `document.querySelector` in sidebar
- 6a4a593: fix: #531 unclickable breadcrumb
- d34f9f2: feat(nextra-theme-docs): update discord logo to the new one
- a8a89e9: chore(docs): export ThemeSwitch & custom social
- f964802: do not hide default logo on mobile
- 7053959: chore(nextra-theme-docs): remove unneeded `transform-none` css class
- bc52178: fix `editLink` option was not merged with default config `editLink`
- 582ad96: feat: bump `rehype-pretty-code` version, support `showLineNumbers`
- da998e6: move react components to `components` folder and replace exports:
  ```ts
  import Bleed from 'nextra-theme-docs/bleed'
  import Callout from 'nextra-theme-docs/callout'
  import Collapse from 'nextra-theme-docs/collapse'
  import { Tab, Tabs } from 'nextra-theme-docs/tabs'
  ```
  by
  ```ts
  import { Bleed, Callout, Collapse, Tab, Tabs } from 'nextra-theme-docs'
  ```
- e6771ca: move `withLayout` logic directly in nextra loader
- 8ad9507: fix unable expanding folder items in sidebar
- c2c0d90: fix(search): handle case when value is empty
- c4a9782: support custom hue theme color via `primaryHue`, `primaryHue.dark`
  and `primaryHue.light` theme options
- c8bb94f: UI adjustments
- a9ca0b9: do not add `basePath` to the links
- 88f999d: fix: UI improvements
- 43409ad: fix: mdx theme is missing
- 416dfe2: add missing `nx-` prefixes in sidebar
- e6771ca: adjust active breadcrumb color
- 707fdc2: fix: Anchor links are not wrapping on the sidebar
- c3e6227: reuse nextra's scrollbar-y styles for scrollbar-x, adjust sidebar's
  scrollbar-y
- 0af6e79: `"layout": "raw"` should have unstyled `<a />` and `<p />` elements
  as well
- 2ec8564: add `DocsThemeConfig.navbar` config option for overriding navbar
- f99bbc2: Add `nextra-body-typesetting-article` back
- e6771ca: fix search input `ESC` icon vertical alignment
- 5b01537: Fix full docs directory list and active link
- 06aa62f: feat: allow `import { getComponents } from 'nextra-theme-docs'`

## 2.0.0-beta.45

### Patch Changes

- 66712f0: polish docs

## 2.0.0-beta.44

### Patch Changes

- 94ef0b3: improve 2.0 docs
- fdb2f57: update docs to use next.js 13
- b1d7361: improve docs for 2.0
- 74a3398: update docs for 2.0
- d7f2bbc: adjust docs theme; rename options

## 2.0.0-beta.43

### Patch Changes

- 9ab6dd0: allow adding additional navbar content via `navbar.extraContent`
- 59e18b0: make `nextra`/`nextra-theme-docs`/`nextra-theme-blog` be compatible
  with next 13
- 2e2912e: fix project/chat icon could appear without provided link

## 2.0.0-beta.42

### Patch Changes

- 2b6f3be: add missing border for search container
- 32cd385: add new option `search.loading` for control loading text
- fb37b5f: Close selector bracket for compat with old Safari.

## 2.0.0-beta.41

### Patch Changes

- bd2cefa: Fix css classes with `eslint-plugin-tailwindcss`

## 2.0.0-beta.40

### Patch Changes

- f569d90: missing `nx-` class prefixes in blog fix callout padding in docs

## 2.0.0-beta.39

### Minor Changes

- 8f6d377: allow custom github domains

### Patch Changes

- f5bf2e4: fix margin-top for `<Tab />` content
- 0c136ad: add missing `nx-` prefix in sidebar
- 8ad9507: fix unable expanding folder items in sidebar
- 416dfe2: add missing `nx-` prefixes in sidebar

## 2.0.0-beta.38

### Patch Changes

- 05d068c: Add button label for hamburger menu

## 2.0.0-beta.37

### Patch Changes

- 5b01537: Fix full docs directory list and active link

## 2.0.0-beta.36

### Patch Changes

- 08a39e6: remove `resizeObserver` for dynamic content since it provoke jumps on
  tabs switch when there is `#` anchor in url
- 1c3fedb: add missing `nx-` prefixes to table/th/tr elements
- 351fa45: add missing `nx-` prefix for `grow` class in `<LocaleSwitch />`

## 2.0.0-beta.35

### Patch Changes

- ab629e6: Add correct aria values inside nav

## 2.0.0-beta.34

### Patch Changes

- 4e4a37c: add new "display" property to \_meta

## 2.0.0-beta.33

### Patch Changes

- 580c433: add nx- to all tailwind classes for style isolation
- 2533a6c: replace `main.extraContent` theme option with `main` option
- c28a7f2: - setup `next-seo`
  - add new theme option `getNextSeoProps`
  - remove `titleSuffix` theme option in favor of
    `getNextSeoProps.titleTemplate`
  - by default pass `description`, `canonical`, `openGraph` values to
    `<NextSeo />` component from page `frontMatter`, values can be overridden
    with return value of `getNextSeoProps`

## 2.0.0-beta.32

### Patch Changes

- fc8cca0: add `<InformationCircleIcon />` icon, improve `<Callout />` default
  emojis
- 723d42a: use `lightningcss` instead `cssnano`
- 9f5af54: add `_meta.json#theme.collapsed` option for control state sidebar's
  folders
- f360f28: add new theme option `banner.dismissible`
- a8a89e9: chore(docs): export ThemeSwitch & custom social

## 2.0.0-beta.31

### Patch Changes

- cef5546: allow headings contain links
- 5238bb4: feat(docs): support logoLink config option
- f964802: do not hide default logo on mobile

## 2.0.0-beta.30

### Patch Changes

- 1a7cd68: toc anchor links should have `display: inline-block`
- c09f450: fix CTRL+K, on non non-mac use `e.ctrlKey` instead `e.metaKey`
- 84d983f: fix(docs): correct query for hash with leading num
- 7d2d5ee: use resolvedTheme instead renderedTheme + theme check

## 2.0.0-beta.29

### Patch Changes

- 973ca49: fix rtl/ltr glitch on initial loading

## 2.0.0-beta.28

### Patch Changes

- c2c0d90: fix(search): handle case when value is empty

## 2.0.0-beta.27

### Patch Changes

- 21009c7: fix covered select options
- 21009c7: better focus ui, use ring color as theme hue color

## 2.0.0-beta.26

### Patch Changes

- a0e5847: Rename some docs theme configurations

## 2.0.0-beta.25

### Patch Changes

- 4731fa7: Style improvements
- e4cfb83: define page title in sidebar from `frontMatter.title` if page is not
  specified in `_meta.json`
- 9064112: make `<Tab />` accept `ComponentProps<'div'>`
- c3e6227: add `overflow-x-scroll` for tables
- d6d5ab8: Make sure arrows are aligned
- ab6c0e6: fix disappearing toc issue in Firefox
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- e2d603a: remove `getComponents` export, export `useMDXComponents` from
  `@mdx-js/react` instead
- 256154a: use "next/future/image" if
  `"experimental.images.allowFutureImage": true` is set in next config
- 256154a: replace images with `<NextImage />` even when url not relative but
  that starts from `/` (public directory)
- c4a9782: support custom hue theme color via `primaryHue`, `primaryHue.dark`
  and `primaryHue.light` theme options
- c3e6227: reuse nextra's scrollbar-y styles for scrollbar-x, adjust sidebar's
  scrollbar-y

## 2.0.0-beta.24

### Patch Changes

- bc52178: fix `editLink` option was not merged with default config `editLink`

## 2.0.0-beta.23

### Patch Changes

- c8129a2: fix theme switcher style
- 2ec8564: add `DocsThemeConfig.navbar` config option for overriding navbar

## 2.0.0-beta.22

### Patch Changes

- 77361da: fix ESC button when still stays after pressed ESC
- fdfe4f8: fix covered theme switch popup when i18n is not setup
- 873561b: scrollbar is toc should be same as in sidebar

## 2.0.0-beta.21

## 2.0.0-beta.20

### Patch Changes

- e6771ca: fix search overlay styles on mobile
- e6771ca: split css to `hamburger`/`scrollbar`/`typesetting-article` css files
- e6771ca: fix edit on github button for cases when filename named as `index`
- e6771ca: BREAKING! various theme config options was renamed, take a look of
  renamed options
  [here](https://github.com/shuding/nextra/blob/core/packages/nextra-theme-docs/src/constants.tsx)
- 1ee3c92: reuse table styles from docs in blog
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add
  `NextraConfig.unstable_defaultShowCopyCode` option to show button by default,
  add `copy` and `copy=false` options for code-blocks
- 5d852b6: break words in navlinks, remove unneeded `<div />` wrappers, align
  text on right side for next link
- e6771ca: hide search input in navbar on mobile
- e6771ca: fix empty space in navbar when theme option `search.component: null`
- e6771ca: add `editLink.component`
- e6771ca: rename `meta.json` to `_meta.json`
- e6771ca: clicking on folder should navigate to first children if `index` page
  doesn't exist
- 71528f1: show copy code button only on hover of container
- e6771ca: fix callout shrinking from children content
- e6771ca: rename `PageOpts.meta` to `PageOpts.frontMatter`
- e6771ca: move `withLayout` logic directly in nextra loader
- e6771ca: adjust active breadcrumb color
- e6771ca: fix search input `ESC` icon vertical alignment

## 2.0.0-beta.19

### Patch Changes

- 1fef548: allow head to be a ReactNode
- ee270a4: fix extra space in flexsearch input after loading indexes
- afaa26a: refactor toc, fix toc's styles on rtl, use `ref.current` instead
  `document.getElementsByClassName`
- cdc1c2f: prefer `ref.current` over `document.querySelector` in sidebar

## 2.0.0-beta.18

### Patch Changes

- 7a32f8e: remove unneeded wrappers `<div />`s in `<Navbar />`
- bea62a1: make the search input responsive in narrow screens
- 24a02f8: reuse Flexsearch result styles on match-sorter search
- a0c0eb8: allow override `MDXProvider.components`
- 16bedce: `"layout": "raw"` should render `all` unstyled elements, except
  `<a />`
- 237faa9: add clear button for search input
- 24a02f8: typescripify `<Flexsearch />`
- 24a02f8: fix all RTL broken styles
- a8c5883: add `config.bodyExtraContent` option
- 8564919: extract `<Input/>` from `<Search/>` and `<Flexsearch/>`
- 38769ca: prefer `ref.current.querySelector` over `document.querySelector`,
  remove `load` prop in `<Search />`
- 24a02f8: match-sorter search should highlight every match like flexsearch
- 7bcbc98: add new `meta.json#theme.timestamp` option to hide
  `Last updated on ...`
- d16b2ba: move contexts to `./contexts` directory
- 47938b1: remove unneeded `useRef` for `<details />`
- 7373c1f: fix `useConfig`/`useRouter` inside `head()`
- a9ca0b9: do not add `basePath` to the links
- 0af6e79: `"layout": "raw"` should have unstyled `<a />` and `<p />` elements
  as well
- f99bbc2: Add `nextra-body-typesetting-article` back

## 2.0.0-beta.17

### Patch Changes

- 2217f9c: fix `Warning: Prop`href`did not match. Server: "#" Client: ...`
- 2217f9c: fix `next export` command
- 2217f9c: replace `classnames` package with `clsx` as he's faster
- 2217f9c: remove `locale` prop from theme config, forbid passing in
  `renderComponent`

## 2.0.0-beta.16

### Patch Changes

- 8bcb5e6: fix sideEffects in package.json
- da2bea7: remove no longer used `icons` folder
- 4825365: add `@types/github-slugger` instead of manually declaring type
- dfbe996: extract `<Banner />` from `<Navbar />` to `components/banner.tsx`
- a007c64: move DEFAULT_THEME and DEFAULT_PAGE_THEME to constants.tsx
- b219821: fix body overflow
- 48e0ac2: export `useConfig` and `useTheme`
- da998e6: move react components to `components` folder and replace exports:
  ```ts
  import Bleed from 'nextra-theme-docs/bleed'
  import Callout from 'nextra-theme-docs/callout'
  import Collapse from 'nextra-theme-docs/collapse'
  import { Tab, Tabs } from 'nextra-theme-docs/tabs'
  ```
  by
  ```ts
  import { Bleed, Callout, Collapse, Tab, Tabs } from 'nextra-theme-docs'
  ```
- 43409ad: fix: mdx theme is missing

## 2.0.0-beta.15

### Patch Changes

- 88f999d: fix: UI improvements

## 2.0.0-beta.14

### Patch Changes

- 96ed5c2: [nextra/nextra-theme-docs]: support both
  `experimental.newNextLinkBehavior` - `true` and `false`
- c8605d6: feat: New layout implementation

## 2.0.0-beta.13

### Patch Changes

- cb87709: Fix flexsearch option being overridden
- 4157b71: set lower build target and share code highlight theme through nextra
- 6a4a593: fix: #531 unclickable breadcrumb
- 06aa62f: feat: allow `import { getComponents } from 'nextra-theme-docs'`

## 2.0.0-beta.12

### Patch Changes

- a5cac21: [docs/blog]: extract code styles and import in both themes
- 3de0f41: chore(blog/docs): use `postcss-import` to import css variables styles
- 97ca2e3: New feature: menu type
- 76d1e30: [nextra-theme-docs]: fix `Warning: A title element received an array`
  and possible `[object Object]` in title
- bf74201: [nextra-theme-docs]: use new opacity modifier syntax for tailwindcss
- 0f4795f: chore(nextra/blog/docs): provide types for PageOpts in loader

## 2.0.0-beta.11

### Patch Changes

- 903ddf0: fix: should update scroll when height is dynamic
- 3e3b0a9: feat: add cursor pointer to locale and theme menu
- a0398e0: fix: avoid mutating nextConfig
- 38ccce8: feat(docs): allow `Tabs.items` as `ReadonlyArray<ReactNode>`
- fe2b714: upgrade to react 18
- 6bdb9bf: fix: broken flexsearch styles
- 78f1519: chore: Add strict-peer-dependencies=false
- 582ad96: feat: bump `rehype-pretty-code` version, support `showLineNumbers`
- c8bb94f: UI adjustments
- 707fdc2: fix: Anchor links are not wrapping on the sidebar

## 2.0.0-beta.10

### Patch Changes

- af72f85: chore(nextra-theme-docs): provide type for
  `DocsThemeConfig.nextThemes` instead of `object`
- 97e6141: fix(nextra/docs): fallback search to `en-US` instead `default`
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 03e90d8: refresh build system with tsup and fix nextra type

## 2.0.0-beta.9

### Patch Changes

- 6644bd5: pass unstable_flexsearch
- c15f570: fix: query should not affect nav highlight
- 4730bdc: chore(nextra-theme-docs): refactor `theme-context.ts`
- 94a8587: chore: extract `svg` icons in `/icons` folder, reusing same icons
  `<MoonIcon />` / `<SunIcon />` in blog from docs
- e573175: Fix release CI
- c380989: fix(docs): types is missing in bundle
- d34f9f2: feat(nextra-theme-docs): update discord logo to the new one
- 7053959: chore(nextra-theme-docs): remove unneeded `transform-none` css class

## 2.0.0-beta.8

### Patch Changes

- 009bf6a: Fix release workflow.

## 2.0.0-beta.7
