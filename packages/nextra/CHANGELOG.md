# nextra

## 3.0.0-alpha.20

## 3.0.0-alpha.19

## 3.0.0-alpha.18

### Minor Changes

- f71e660e: change to shiki again

### Patch Changes

- 98f439ca: export `evaluate` function for remote content
- 98f439ca: add rust icon

## 3.0.0-alpha.17

### Minor Changes

- 30438264: add shikiji twoslash

  Demo feature:
  https://nextra-v2-na3obnhub-shuding1.vercel.app/docs/guide/twoslash-support

### Patch Changes

- 9f55bd1f: update rehype-pretty-code/shikiji to latest

## 3.0.0-alpha.16

### Minor Changes

- 5a637010: add icons for following languages:

  - GraphQL (`graphql`)
  - C++ (`c++`, `cpp`)
  - C# (`csharp`, `c#`, `cs`)
  - Python (`python`, `py`)

  allow disallow mobile word wrap button in code blocks with `word-wrap=false`
  meta data setting

### Patch Changes

- 90c129e6: children in Card component is required only if the image prop is
  true

## 3.0.0-alpha.15

### Patch Changes

- 1a364694: add `frontMatter.sidebarTitle` only if `frontMatter.title` is empty

## 3.0.0-alpha.14

## 3.0.0-alpha.13

### Minor Changes

- 60ec68c4: improvements for remarkStaticImage:

  - import same image only once
  - support importing images by markdown image definitions

- 6070b025: rename `frontmatter.sidebar_label` to `frontmatter.sidebarTitle`
- 8bce16d3: replace `transformPageOpts` nextra option by `transformPageMap`
- 6070b025: move `removeLinks` function from `nextra-theme-docs` to
  `nextra/remove-links`

### Patch Changes

- c74ae90a: Fix TypeError: \_jsx is not a function for remote content on
  development environment

## 3.0.0-alpha.12

### Minor Changes

- 3644e1c2: add `remark-smartypants`

### Patch Changes

- 57bc0e2a: fix reload of nextra layout on route change, reported by sound.xyz

## 3.0.0-alpha.11

### Major Changes

- c2ad837d: update to MDX3

## 3.0.0-alpha.10

### Patch Changes

- 9099c354: remove `nextra/mdx-plugins`, add `nextra/remark-plugins`

## 3.0.0-alpha.9

### Patch Changes

- 8efbb45c: remove `nextra/data` export, move `useData` to `nextra/hooks`,
  `RemoteContent` to `nextra/components`
- 80e11e04: move `resolvePageMap` to `nextra/page-map-dynamic`

## 3.0.0-alpha.8

### Minor Changes

- 440ff42d: add MathJax support

## 3.0.0-alpha.7

### Patch Changes

- 0b5cc9d5: make nextra compatible with windows

## 3.0.0-alpha.6

### Patch Changes

- 03da778a: fix `*` theme settings for dynamic routes when route is not exist in
  page map

## 3.0.0-alpha.5

### Patch Changes

- a3b67aea: `_meta` should return
  `export const getStaticProps = () => ({ notFound: true })` for static exports,
  instead of page without contain

## 3.0.0-alpha.4

### Patch Changes

- 7faa0968: fix visible hidden pages on mobile which set up with
  `display: 'hidden'`

## 3.0.0-alpha.3

### Patch Changes

- fe5061b7: fix for remote docs

## 3.0.0-alpha.2

### Patch Changes

- cb247901: fix broken `export default` statement in mdx files

## 3.0.0-alpha.1

### Major Changes

- e7e8e849: show react components, variable interpolation and latex in toc
- 71882780: - insert `frontMatter` as export node via custom remark plugin

  - remove `frontMatter.mdxOptions` support

- 023d37b1: add `"type": "module"` to `nextra` package
- 148278ce: rename tailwind prefix `nx-` to `_` to reduce bundle size
- d7d8a3eb: new styles for code blocks aka in next.js
- 63ca28be: Remove support of "\_meta.json", use "\_meta.{js,jsx,ts,tsx}"
  instead.
- b9f88e34: - remove `use-internals.ts`

  - remove `layout.tsx`, move directly to `setup-page.tsx`
  - remove `kind: 'Meta' | 'Folder' | 'MdxPage'` to keep page map smaller

- 128e195f: fix React warning, remove PageOpts.toc, use `toc` prop from
  `components.wrapper`
- 1f3e7cd4: - remove `__nextraPageOptions.hot`

  - remove `__nextraPageOptions.pageOptsChecksum`
  - remove `__nextra_internal__.refreshListeners` (no longer needed since we
    insert toc as esm node in remark plugin)
  - remove `hashFnv32a`

- 198dbcca: use toc with JSX elements for remote content
- 191e6c41: - use `shikiji` instead of `shiki`

  - rename `useSSG` to `useData`

- c7f03e54: rename `pageOpts.headings` to `toc`

### Minor Changes

- c7f03e54: should not add virtual `_meta` file if missing
- a52a869e: add `frontmatter.sidebar_label` support for setting page label in
  sidebar via frontmatter
- 4e55c064: add support for `_meta.{js,jsx,ts,tsx}` with JSX support

### Patch Changes

- 1f3e7cd4: fix `pageProps` for NextraLayout

## 3.0.0-alpha.0

### Major Changes

- 50a52fd1: - ❌ remove `_app.mdx`, use `_app.{js,jsx}` or `_app.{ts,tsx}` for
  TypeScript projects instead

  - ❌ remove Nextra middleware `nextra/locales`
  - ❌ remove `parseFileName` from `nextra/utils`
  - ❌ remove `nextra/filter-route-locale`
  - ❌ remove `resolvePageMap` and `pageMapCache` from `nextra/page-map`
  - ❌ remove `__nextraPageOptions.pageNextRoute`
  - ❌ remove `pageOpts.route` and `pageOpts.newNextLinkBehavior`
  - ❌ remove `LoaderOptions.defaultLocale`
  - ❌ remove `__nextra_internal__.context[route].themeConfig`
  - ✅ add `nextra/fetch-filepaths-from-github`
  - save `pageMap` to `.next/static/chunks/nextra-page-map-{locale}.mjs`
  - save `fileMap` to `.next/static/chunks/nextra-file-map.mjs`

- 919fe977: set `"peerDependencies.next": ">=13"`
- ad4823d9: add zod validation for nextraConfig
- ab07609c: remove `locale` and `defaultLocale` from `normalizePages`
- 2f3be336: - set `"engines.node": ">=18"`

  - remove `Tab` export, use `Tabs.Tab` instead
  - remove `Card` export, use `Cards.Card` instead
  - disallow import md/mdx files that are outside the working directory, use
    symlinks instead

- 66cce1d1: **BREAKING** bundle to ESM only

  > ⚠️⚠️⚠️ use `next.config.mjs` or `next.config.js` with `"type": "module"`

- 576cb6f1: - rename `nextraConfig.flexsearch` to `nextraConfig.search`

### Minor Changes

- 0fe55db2: add `import { useRouter } from 'nextra/hooks'` for fetching `locale`
  and `defaultLocale`

### Patch Changes

- d8a406b4: add `"sideEffects": false` for better tree-shaking

## 2.13.3

### Patch Changes

- 93b57052: fix `type: 'separator'` zod validation, mark `title` field as
  optional

## 2.13.2

### Patch Changes

- ad7b31b0: downgrade remark-math from `6` to `5.1.1` to fix
  `TypeError: Cannot read properties of undefined (reading 'mathFlowInside')`
  error

  fix support of ```math lang that was overridden by `rehype-pretty-code`

## 2.13.1

### Patch Changes

- ee02a483: fix `Property 'existsSync' does not exist on type`

## 2.13.0

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

## 2.12.2

### Patch Changes

- 7c8c4989: fix `Out of Memory` in search while indexing large words

## 2.12.1

### Patch Changes

- 52ae8fc5: - always cache md/mdx compiler for non-remote content and never
  cache for remote content

  - refactor function arguments for `compileMdx`
  - fix source code from loader was stripped starting from last match
    `export default MDXContent;` and until the end, so `transform` function was
    not applied
  - fix `headings` were `undefined` in remote content

## 2.12.0

### Minor Changes

- d9820746: - show headings for partial md/mdx in toc

  - hide headings in toc when parent `<Tab />` or `<Tabs.Tab />`

- 8962597e: - allow override static image component that was hardcoded to
  `import Image from 'next/image'` now it's plain `<img />`

  - support `<details />`/`<summary />` for `.md` files

### Patch Changes

- fbf003cd: cache md/mdx processor

## 2.11.1

### Patch Changes

- ddddce95: skip search indexing for 404/500 pages
- 6154e312: ensure first h1 is set as page title if frontmatter.title is missing
- 46743ba4: fix TS error
  `Cannot find module 'nextra/filter-route-locale' or its corresponding type declarations.`
  while importing

  ```js
  import filterRouteLocale from 'nextra/filter-route-locale'
  ```

- 4dd720ad: remove `font-weight: 500;` from styles of code blocks since it gives
  no effect

## 2.11.0

### Patch Changes

- 3bb480a4: use github-slugger for custom heading ids to prevent duplicated
  headings
- 3bb480a4: fix custom heading id in search result
- 3bb480a4: fix
  `Warning: Prop href did not match. Server: "/blog.en-US#" Client: "/blog#"` in
  by `normalizePages` from nextra/normalize-pages`
- 3bb480a4: strip `.html` extension from URL route for static export

## 2.10.0

### Minor Changes

- e54b008: - add `@theguild/remark-npm2yarn` package that replaces the code
  block that has `npm2yarn` metadata with `<Tabs />` and `<Tab />` components
  from `nextra/components`.

  - `<Tabs />` now has `selectedKey` prop, the chosen tab is saved in the local
    storage, which will be chosen in future page renders.

  More info https://nextra.site/docs/guide/advanced/npm2yarn

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

- 23a25b1: replace last match of `export default MDXContent;`

## 2.8.0

### Patch Changes

- 6c12bf4: fix broken code format while selecting and copying code with
  `showLineNumbers` option enabled

## 2.7.1

### Patch Changes

- 0e53ca51: remarkMermaid should be before removing imports for remote markdown

## 2.7.0

### Minor Changes

- 44626e8f: support mermaid diagrams

## 2.6.2

### Patch Changes

- 9c9625ee: Fix search not working in certain Next.js versions

## 2.6.1

### Patch Changes

- 1e9ebabc: remove `remarkLinkRewriteOptions` from `buildDynamicMDX`

## 2.6.0

### Minor Changes

- 1c6256b: Move Callout component to nextra package

### Patch Changes

- 15c4092: fix inconsistent `font-weight: bold` style for `type: 'menu'`

## 2.5.2

### Patch Changes

- a3601e5: fix Module not found: Can't resolve
  '.../node_modules/nextra/dist/mdx.mjs'

## 2.5.1

### Patch Changes

- d408ab0: fix `Error: ENOENT: no such file or directory` in Nx-managed
  monorepos

## 2.5.0

### Minor Changes

- 08d393e: support ANSI highlighting

## 2.4.2

### Patch Changes

- 16e562d: fix Next.js 13.3.1 compatibility for SyntaxError: Named export
  'existsSync' not found.

## 2.4.1

### Patch Changes

- a992ce1: do not add dynamic routes to pageMap

## 2.4.0

### Minor Changes

- 0a50cad: support symlinked pages

### Patch Changes

- 545bd7c: Remove `.mdx?` of local links only
- 259bfbc: do not throw error when `output: 'export'` is specified in
  `next.config.js`

## 2.3.0

### Minor Changes

- 6ea1caf: fix crash of dev server when `_meta.js` contains errors

  disallow caching of `_meta.js` on dev env

  set minimal `node` as `16`

- 76e8b0f: support custom heading id via
  `# my very long heading... [#my-custom-heading]` syntax
  https://github.com/shuding/nextra/pull/1645

### Patch Changes

- 0dd028a: Prints the warning inline instead of the current behavior which
  includes a stack trace.

## 2.2.20

### Patch Changes

- 2e48307: export `normalizePages` from `nextra/normalize-pages`, `useFSRoute`
  from `nextra/hooks` (can be useful for custom theme)
- e4c8b6d: fix crash of dev server when \_meta.json is malformed

## 2.2.19

### Patch Changes

- e41cbbc: fix `transformPageOpts` with \_app.mdx, `pageMap` was still included
  even it was removed in `transformPageOpts`
- a1e59b2: Support Markdown links with query or anchor.

## 2.2.18

### Patch Changes

- 9bd2d59: remove the .md and .mdx extension from links
- c2287e1: fix buildDynamicMDX options passed to compileMdx
- 90cb6b8: do not auto create `_app.mdx` if missing

## 2.2.17

### Patch Changes

- 4a66366: fix TypeError: Cannot read properties of undefined (reading '/') with
  \_app.mdx while editing theme.config, \_meta.json or adding/removing md/mdx
  files

## 2.2.16

### Patch Changes

- d495e5f: introduce `_app.mdx` for better performance and smallest
  `.next/static/chunks` size

## 2.2.15

### Patch Changes

- d5aa17c: do not redirect `.txt` files in nextra's `locales` middleware
- 016828e: do not redirect .mp4 in locales middleware
- b3219c3: do not override `className` for `<Td />`, `<Th />` and `<Tr />`
  components

## 2.2.14

### Patch Changes

- bcaba9c: fix capitalizing sidebar links + tests
- a683c84: fix `*` key for `collectCatchAll`
- a404ef7: fix rewrites

## 2.2.13

### Patch Changes

- d1d873f: typed frontmatter -> `useConfig<YOUR_FRONTMATTER_TYPE>`
- 6626356: prefer `import type`
- 2234a13: fix raw `__esModule` string ☠️

## 2.2.12

### Patch Changes

- 619ae3a: fix pageMap for remote content

## 2.2.11

### Patch Changes

- 7d96698: compile mdx with `format: 'detect'` in loader
- e10bf74: add support for remote `[...catchAll]` routes

  support meta keys with `/`

  sanitize remote mdx by removing `import` statements

- e04e2ce: better types for dynamic meta
- 5fd2183: ignore `.xml` files in locales middleware
- e38e61f: use decodeURI in static-image.ts

## 2.2.10

### Patch Changes

- c97143f: fix search index output location
- 256282a: fix codeHighlight being false by default for remote contet
- 4d3c20a: fix special modules being bundled in client
- 4b2052f: fix `Module not found: Can't resolve 'nextra-theme-docs/style.css'`
  for imported markdown files that located outside of CWD
- 624d6b4: fix when sidebar show non-md folders
- 0c957db: fix capitalizing of undefined \_meta.json file/folders
- d0b9249: fix subpath import failed

## 2.2.9

### Patch Changes

- c50474e: support dynamic markdown import

## 2.2.8

### Patch Changes

- d2ed10f: remove development: false
- b943146: add transformPageOpts option for advanced use cases

## 2.2.7

### Patch Changes

- 36fd8c7: add format detection
- 64cec8f: disable code splitting and fix dev errors

## 2.2.6

### Patch Changes

- be24334: improve search index generation
- 4fc13df: fix warning of dynamic imports

## 2.2.5

### Patch Changes

- 163065c: loader refactor, type-safe `__nextra_resolvePageMap`, avoid code
  interpolation in loader.ts

## 2.2.4

### Patch Changes

- 091b77b: fix missing filename

  add filename / copy code with "codeHighlight: false"

  add unit tests for filename and copy code

- 917de49: remove `github-slugger` from docs

## 2.2.3

### Patch Changes

- 11b2870: fix copy code button position

## 2.2.2

### Patch Changes

- 3145f53: extend `plugin:react/recommended`, `plugin:react-hooks/recommended`
  and `plugin:@next/next/recommended` configs
- 1834730: fix hydration error produced by cached compiler, fix broken
  code-blocks styles while setting `nextraConfig.codeHighlight: false`
- f53b935: Allow disabling code highlighting & memory improvements

## 2.2.1

### Patch Changes

- 9bcfc1d: fix error was swallowed silently

## 2.2.0

### Minor Changes

- e4b20ca: support `transform` in nextra config

### Patch Changes

- 52a1bf3: feat: allow to use plain md syntax
- af76dbe: fix highlight substring from filename for code blocks

## 2.1.0

### Minor Changes

- e5262d0: improve hmr and internal api for layout (toc and meta files)

### Patch Changes

- a923bd5: fix `collectFiles` concurrency
- 5bdc62c: fix static images on windows
- c86508c: lint fixes for `eslint:recommended` and
  `plugin:@typescript-eslint/recommended` configs
- d6c871a: simplify the custom theme layout api
- 1ff43c1: use OKLCH colors where possible
- a31678a: improve copy

## 2.0.3

### Patch Changes

- adb2d25: fix remote mdx
- 8060ed3: style improvements

## 2.0.2

### Patch Changes

- 1e2afcf: Add LaTeX support
- 99ec64e: fix indentation for copy code button
- 3a08fe2: Add Callout border in dark mode
- f488e2e: remove @react/skip-nev #1051

  fix: staticImage should only set blur placeholder for jpeg,png,webp,avif

- cf9b886: better performance of `collectFiles`
- f35e724: update shiki to v0.12.1
- b2fc168: support `nextConfig.distDir`
- cc1cb5f: support `nextConfig.basePath` with i18n

## 2.0.1

### Patch Changes

- a9748aa: fix: A11y improvements to the docs theme
- ac82b1f: make code-blocks buttons focusable if they are visible on page

## 2.0.0

### Major Changes

- 793eedb: chore: Fix CI

### Patch Changes

- e4cfb83: `addPage` no longer need accept `frontMatter`
- 94ef0b3: improve 2.0 docs
- 8101efe: fix(nextra): use `rehype-mdx-title` to determine page title
- 6644bd5: pass unstable_flexsearch
- cef5546: allow headings contain links
- 2217f9c: fix `Warning: Prop `href` did not match. Server: "#" Client: ...`
- e6771ca: fix edit on github button for cases when filename named as `index`
- 2217f9c: fix `next export` command
- fdb2f57: update docs to use next.js 13
- 803553c: use `findPagesDir` from `next/dist/lib/find-pages-dir`
- 568282e: fix broken build `SyntaxError: Unexpected token '}'`
- a0398e0: fix: avoid mutating nextConfig
- e6771ca: fix `ReferenceError` when trying to access `__nextra_pageOpts__`
  inside MDX file
- 59e18b0: make `nextra`/`nextra-theme-docs`/`nextra-theme-blog` be compatible
  with next 13
- 488f737: fix client console error - Text content does not match
  server-rendered HTML
- fc8cca0: add `<InformationCircleIcon />` icon, improve `<Callout />` default
  emojis
- fe2b714: upgrade to react 18
- 02bc6fc: use `next/future/image` if next>=12.3.0
- e4cfb83: define page title in sidebar from `frontMatter.title` if page is not
  specified in `_meta.json`
- 1ee3c92: reuse table styles from docs in blog
- f569d90: missing `nx-` class prefixes in blog fix callout padding in docs
- b1d7361: improve docs for 2.0
- 8dab966: fix invisible copy button in code blocks
- 6f987e9: fix: print shallow warning only once
- 4825365: add `@types/github-slugger` instead of manually declaring type
- f7856a1: change default options for `compileMdx`, set `jsx: false` and
  `outputFormat: 'function-body'` by default
- cc1379c: fix `Hydration failed because the initial UI...` while modifying
  `meta.json` on dev env and react 18
- 66712f0: polish docs
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add
  `NextraConfig.unstable_defaultShowCopyCode` option to show button by default,
  add `copy` and `copy=false` options for code-blocks
- 96ed5c2: [nextra/nextra-theme-docs]: support both
  `experimental.newNextLinkBehavior` - `true` and `false`
- b365bb0: fix TypeError: Cannot read properties of undefined (reading 'data')
- 580c433: add nx- to all tailwind classes for style isolation
- c3e6227: add `overflow-x-scroll` for tables
- 1c3fedb: add missing `nx-` prefixes to table/th/tr elements
- d7e7f5b: do not add `placeholder="blur"` on `.svg` static images
- 78f1519: chore: Add strict-peer-dependencies=false
- 97e6141: fix(nextra/docs): fallback search to `en-US` instead `default`
- a0e5847: Rename some docs theme configurations
- 74a3398: update docs for 2.0
- 93d028b: use `title` package in nextra to determine sidebar title based on
  pagename
- bd2cefa: Fix css classes with `eslint-plugin-tailwindcss`
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- 009bf6a: Fix release workflow.
- e6771ca: rename `meta.json` to `_meta.json`
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 4a7cc10: feat(nextra): allow define custom languages for shiki with
  `mdxOptions.rehypePrettyCodeOptions` option
- a2bc427: compile `context.ts`, `ssg.ts` and `locales.ts` to esm
- 64ae4b5: add `nextraConfig.unstable_readingTime` option for blog theme
- a9523c9: fix nextra on webcontainers
- 383b869: Add Changesets and setup pre-release and release CI.
- 6dc4dee: fix `Unhandled Runtime Error: No content found for <route>`
- d7f2bbc: adjust docs theme; rename options
- 256154a: use "next/future/image" if
  `"experimental.images.allowFutureImage": true` is set in next config
- a9414be: always use `next/image`, since in next 12.3.2 `next/future/image` was
  renamed to `next/image`
- 512953f: chore: remove redundant check for
  `MARKDOWN_EXTENSION_REGEX.test(filename)` in loader
- c8605d6: feat: New layout implementation
- e6771ca: better loader types, add `MetaJsonFile`, `MdxFile`, `Folder` types
- 4157b71: set lower build target and share code highlight theme through nextra
- a1c1e4e: Update docs
- 1942a2e: chore: Fix build script
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 044721d: chore: Update turbo filters
- 256154a: replace images with `<NextImage />` even when url not relative but
  that starts from `/` (public directory)
- c751458: fix(nextra): ignore in loader files from `pages/api` folder
- e573175: Fix release CI
- 21009c7: better focus ui, use ring color as theme hue color
- 0f4795f: chore(nextra/blog/docs): provide types for PageOpts in loader
- 71528f1: show copy code button only on hover of container
- 03e90d8: refresh build system with tsup and fix nextra type
- e6771ca: rename `PageOpts.meta` to `PageOpts.frontMatter`
- 37b4445: fix react-dom peer dependency version
- 094fdec: sort `defaultMeta` by `frontMatter.date`, if missing by
  `frontMatter.title` and after by capitalized page name
- e6771ca: move `withLayout` logic directly in nextra loader
- efd95ec: fix(nextra): allow to contain dots in page filenames
- 094fdec: capitalize sidebar's folders names if item is missing in `_meta.json`
- e35bbf7: chore: rename `module` to `mod` to avoid confusing with global
  `module` object

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
- a1c1e4e: Update docs

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

### Patch Changes

- a9414be: always use `next/image`, since in next 12.3.2 `next/future/image` was
  renamed to `next/image`

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
- 094fdec: sort `defaultMeta` by `frontMatter.date`, if missing by
  `frontMatter.title` and after by capitalized page name
- 094fdec: capitalize sidebar's folders names if item is missing in `_meta.json`

## 2.0.0-beta.32

### Patch Changes

- fc8cca0: add `<InformationCircleIcon />` icon, improve `<Callout />` default
  emojis

## 2.0.0-beta.31

### Patch Changes

- cef5546: allow headings contain links

## 2.0.0-beta.30

### Patch Changes

- 02bc6fc: use `next/future/image` if next>=12.3.0
- f7856a1: change default options for `compileMdx`, set `jsx: false` and
  `outputFormat: 'function-body'` by default

## 2.0.0-beta.29

## 2.0.0-beta.28

## 2.0.0-beta.27

### Patch Changes

- d7e7f5b: do not add `placeholder="blur"` on `.svg` static images
- a9523c9: fix nextra on webcontainers
- 21009c7: better focus ui, use ring color as theme hue color

## 2.0.0-beta.26

### Patch Changes

- b365bb0: fix TypeError: Cannot read properties of undefined (reading 'data')
- a0e5847: Rename some docs theme configurations

## 2.0.0-beta.25

### Patch Changes

- e4cfb83: `addPage` no longer need accept `frontMatter`
- e4cfb83: define page title in sidebar from `frontMatter.title` if page is not
  specified in `_meta.json`
- c3e6227: add `overflow-x-scroll` for tables
- 93d028b: use `title` package in nextra to determine sidebar title based on
  pagename
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 256154a: use "next/future/image" if
  `"experimental.images.allowFutureImage": true` is set in next config
- 256154a: replace images with `<NextImage />` even when url not relative but
  that starts from `/` (public directory)

## 2.0.0-beta.24

### Patch Changes

- a2bc427: compile `context.ts`, `ssg.ts` and `locales.ts` to esm

## 2.0.0-beta.23

## 2.0.0-beta.22

### Patch Changes

- 8dab966: fix invisible copy button in code blocks

## 2.0.0-beta.21

### Patch Changes

- 568282e: fix broken build `SyntaxError: Unexpected token '}'`

## 2.0.0-beta.20

### Patch Changes

- e6771ca: fix edit on github button for cases when filename named as `index`
- e6771ca: fix `ReferenceError` when trying to access `__nextra_pageOpts__`
  inside MDX file
- 1ee3c92: reuse table styles from docs in blog
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add
  `NextraConfig.unstable_defaultShowCopyCode` option to show button by default,
  add `copy` and `copy=false` options for code-blocks
- e6771ca: rename `meta.json` to `_meta.json`
- 64ae4b5: add `nextraConfig.unstable_readingTime` option for blog theme
- e6771ca: better loader types, add `MetaJsonFile`, `MdxFile`, `Folder` types
- 71528f1: show copy code button only on hover of container
- e6771ca: rename `PageOpts.meta` to `PageOpts.frontMatter`
- e6771ca: move `withLayout` logic directly in nextra loader

## 2.0.0-beta.19

### Patch Changes

- 37b4445: fix react-dom peer dependency version

## 2.0.0-beta.18

### Patch Changes

- 803553c: use `findPagesDir` from `next/dist/lib/find-pages-dir`

## 2.0.0-beta.17

### Patch Changes

- 2217f9c: fix `Warning: Prop`href`did not match. Server: "#" Client: ...`
- 2217f9c: fix `next export` command
- 6dc4dee: fix `Unhandled Runtime Error: No content found for <route>`

## 2.0.0-beta.16

### Patch Changes

- 4825365: add `@types/github-slugger` instead of manually declaring type

## 2.0.0-beta.15

## 2.0.0-beta.14

### Patch Changes

- 96ed5c2: [nextra/nextra-theme-docs]: support both
  `experimental.newNextLinkBehavior` - `true` and `false`
- c8605d6: feat: New layout implementation

## 2.0.0-beta.13

### Patch Changes

- 4157b71: set lower build target and share code highlight theme through nextra

## 2.0.0-beta.12

### Patch Changes

- cc1379c: fix `Hydration failed because the initial UI...` while modifying
  `meta.json` on dev env and react 18
- 512953f: chore: remove redundant check for
  `MARKDOWN_EXTENSION_REGEX.test(filename)` in loader
- 0f4795f: chore(nextra/blog/docs): provide types for PageOpts in loader

## 2.0.0-beta.11

### Patch Changes

- a0398e0: fix: avoid mutating nextConfig
- fe2b714: upgrade to react 18
- 78f1519: chore: Add strict-peer-dependencies=false
- 1942a2e: chore: Fix build script
- 044721d: chore: Update turbo filters

## 2.0.0-beta.10

### Patch Changes

- 8101efe: fix(nextra): use `rehype-mdx-title` to determine page title
- 6f987e9: fix: print shallow warning only once
- 97e6141: fix(nextra/docs): fallback search to `en-US` instead `default`
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 03e90d8: refresh build system with tsup and fix nextra type

## 2.0.0-beta.9

### Major Changes

- 793eedb: chore: Fix CI

### Patch Changes

- 6644bd5: pass unstable_flexsearch
- 488f737: fix client console error - Text content does not match
  server-rendered HTML
- 4a7cc10: feat(nextra): allow define custom languages for shiki with
  `mdxOptions.rehypePrettyCodeOptions` option
- c751458: fix(nextra): ignore in loader files from `pages/api` folder
- e573175: Fix release CI
- efd95ec: fix(nextra): allow to contain dots in page filenames
- e35bbf7: chore: rename `module` to `mod` to avoid confusing with global
  `module` object

## 2.0.0-beta.8

### Patch Changes

- 009bf6a: Fix release workflow.

## 2.0.0-beta.7

### Patch Changes

- 383b869: Add Changesets and setup pre-release and release CI.
