# nextra-theme-docs

## 4.3.0

### Minor Changes

- eed8328: feat: adapt colors and icons from original GitHub alerts syntax

  feat: new Callout type `important`

  fix: inconsistent built-in Callout's icons size

  feat: improve Callout's accessibility colors

- 0831a1b: Add an `onSearch` callback to the `<Search />` component. This
  callback, when specified, is called upon every search input change.
- c93fc48: update zod to v4

  feat(TSDoc): rename `generateDocumentation` to `generateDefinition`

  feat(Bleed): pass all props from `div` element to `Bleed`, `Callout`, `Banner`
  container

  fix(TSDoc): improve TSDoc comments for components

  - `Banner`
  - `Head`
  - `Search`
  - `Bleed`
  - `Callout`
  - `Cards`
  - `FileTree`
  - `Steps`
  - `Table`
  - `Tabs`
  - `Playground`
  - `TSDoc`
  - `Layout`
  - `Navbar`

  fix(TSDoc): improve TSDoc comments for functions:

  - `nextra`
  - `generateDefinition`
  - `useMDXComponents`

- 94b081c: feat: refactor `<Search>` component styles for improved transitions
  and visibility
- b5fab80: add `MDXRemote` component docs page
  https://nextra.site/docs/built-ins/mdxremote
- d9dd061: update `tailwindcss` to `4.1.10` and `react-compiler-runtime` to
  `19.1.0-rc.2`
- c134abe: feat: improve overall accessibility, makes text/colors easier to read
  and achieves WCAG Level AAA compliance in many places
- 83f6c57: feat: introduce new `<TSDoc />` component

  The `<TSDoc>` component from `nextra/tsdoc` generates a properties table that
  displays:

  - **Property name**
  - **TypeScript type**
  - **Property description** - is parsed from [TSDoc](https://tsdoc.org) inline
    description or the `@description` tag. You can use any Markdown/MDX syntax
    here.
  - **Default value** - are extracted from the `@default` or `@defaultValue`
    tag.
  - **Permalink** - a `#` anchor link to the property row for easy reference.

  More info can be found in https://nextra.site/docs/built-ins/tsdoc

  > [!IMPORTANT]
  >
  > Huge thanks to
  > [xyflow - Node Based UIs for React and Svelte](https://xyflow.com/?utm_source=github&utm_campaign=nextra-4.3&utm_content=changelog)
  > for sponsoring this feature!

- 07debf9: feat(TSDoc): support flattening return object fields
- fdeb5fe: feat: add new Layout prop `feedback.link` to customize feedback href

### Patch Changes

- 71f7b3f: Update https://nextra.site/docs/guide/search page

  Fixes extra margin-top inside `Tabs.Tab`

  Fix breaking `<Steps>` component numeration when there is `<Tabs>` component
  inside

- a070fdc: Fix `[object Object]` text on hovering breadcrumbs and pagination
  links
- 47ba5f3: fix: use `em` for padding-y, padding-x and border-radius styles of
  `<Code>` element

  fix(TSDoc): for return signature without `name` return mobile card instead of
  table

  feat: use `em` instead `rem` for margins

- 40267dc: split `TSDoc` component logic to `TSDoc` component and
  `generateDocumentation` function

  update https://nextra.site/docs/built-ins/tsdoc documentation

- b0dde33: Fix collapse behaviour of sidebar

  - When a nested route item is active, clicking the parent route item should
    not collapse the section.
  - When the collapsible section is open, clicking the parent route item should
    not cause it to collapse.
  - Switching to another route should not trigger an unexpected reopening.

- 8ac2506: chore: bump `babel-plugin-react-compiler` and
  `react-compiler-runtime`, remove custom pnpm patch for
  `babel-plugin-react-compiler`
- 8edc715: fix phantom scroll when footer is disabled
- b2cba90: improve TSDoc comments for `getPageMap`, `generateStaticParamsFor`
  and `importPage` functions. Add new https://nextra.site/docs/guide/api page.
- d29469e: support Next.js 15.3.0
- 2b18c66: - Disable prefetch for sidebar/breadcrumb/pagination links
  - Add extractStringsFromReactNode to extract strings from breadcrumb links and
    pagination links
- 6a82e6f: - Fix: Received `false` for a non-boolean attribute `prefetch`.
  - Allow override `next-mdx-import-source-file` in `turbopack.resolveAlias`
    option
- 4547eb9: feat(TSDoc): add support for functions and functions with multiple
  signatures
- 407e0c4: feat(TSDoc): add `TSDoc.noParametersContent` prop
- a506e0b: fix `TypeError: page.generateMetadata is not a function` when using
  with `withSentryConfig` plugin
- Updated dependencies [eed8328]
- Updated dependencies [71f7b3f]
- Updated dependencies [0831a1b]
- Updated dependencies [b0afee7]
- Updated dependencies [c93fc48]
- Updated dependencies [47ba5f3]
- Updated dependencies [01ac538]
- Updated dependencies [94b081c]
- Updated dependencies [b5fab80]
- Updated dependencies [40267dc]
- Updated dependencies [ef35ab9]
- Updated dependencies [f717156]
- Updated dependencies [9f449e5]
- Updated dependencies [8ac2506]
- Updated dependencies [a6a1f97]
- Updated dependencies [fda0355]
- Updated dependencies [b2cba90]
- Updated dependencies [f40e018]
- Updated dependencies [d29469e]
- Updated dependencies [d9dd061]
- Updated dependencies [6a82e6f]
- Updated dependencies [c134abe]
- Updated dependencies [7de40fb]
- Updated dependencies [c7d25df]
- Updated dependencies [4547eb9]
- Updated dependencies [407e0c4]
- Updated dependencies [83f6c57]
- Updated dependencies [00f4696]
- Updated dependencies [31ddba4]
- Updated dependencies [07debf9]
- Updated dependencies [a506e0b]
- Updated dependencies [9690841]
  - nextra@4.3.0

## 4.3.0-alpha.31

### Patch Changes

- Updated dependencies [f40e018]
  - nextra@4.3.0-alpha.31

## 4.3.0-alpha.30

### Patch Changes

- Updated dependencies [b0afee7]
  - nextra@4.3.0-alpha.30

## 4.3.0-alpha.29

### Patch Changes

- Updated dependencies [a6a1f97]
  - nextra@4.3.0-alpha.29

## 4.3.0-alpha.28

### Patch Changes

- Updated dependencies [ef35ab9]
  - nextra@4.3.0-alpha.28

## 4.3.0-alpha.27

### Patch Changes

- Updated dependencies [01ac538]
  - nextra@4.3.0-alpha.27

## 4.3.0-alpha.26

### Patch Changes

- Updated dependencies [c7d25df]
  - nextra@4.3.0-alpha.26

## 4.3.0-alpha.25

### Minor Changes

- d9dd061: update `tailwindcss` to `4.1.10` and `react-compiler-runtime` to
  `19.1.0-rc.2`

### Patch Changes

- Updated dependencies [d9dd061]
  - nextra@4.3.0-alpha.25

## 4.3.0-alpha.24

### Minor Changes

- 0831a1b: Add an `onSearch` callback to the `<Search />` component. This
  callback, when specified, is called upon every search input change.

### Patch Changes

- Updated dependencies [0831a1b]
  - nextra@4.3.0-alpha.24

## 4.3.0-alpha.23

### Patch Changes

- Updated dependencies [9690841]
  - nextra@4.3.0-alpha.23

## 4.3.0-alpha.22

### Minor Changes

- c93fc48: update zod to v4

  feat(TSDoc): rename `generateDocumentation` to `generateDefinition`

  feat(Bleed): pass all props from `div` element to `Bleed`, `Callout`, `Banner`
  container

  fix(TSDoc): improve TSDoc comments for components

  - `Banner`
  - `Head`
  - `Search`
  - `Bleed`
  - `Callout`
  - `Cards`
  - `FileTree`
  - `Steps`
  - `Table`
  - `Tabs`
  - `Playground`
  - `TSDoc`
  - `Layout`
  - `Navbar`

  fix(TSDoc): improve TSDoc comments for functions:

  - `nextra`
  - `generateDefinition`
  - `useMDXComponents`

- b5fab80: add `MDXRemote` component docs page
  https://nextra.site/docs/built-ins/mdxremote

### Patch Changes

- Updated dependencies [c93fc48]
- Updated dependencies [b5fab80]
  - nextra@4.3.0-alpha.22

## 4.3.0-alpha.21

### Patch Changes

- 6a82e6f: - Fix: Received `false` for a non-boolean attribute `prefetch`.
  - Allow override `next-mdx-import-source-file` in `turbopack.resolveAlias`
    option
- Updated dependencies [6a82e6f]
  - nextra@4.3.0-alpha.21

## 4.3.0-alpha.20

### Patch Changes

- 2b18c66: - Disable prefetch for sidebar/breadcrumb/pagination links
  - Add extractStringsFromReactNode to extract strings from breadcrumb links and
    pagination links
  - nextra@4.3.0-alpha.20

## 4.3.0-alpha.19

### Patch Changes

- 407e0c4: feat(TSDoc): add `TSDoc.noParametersContent` prop
- Updated dependencies [407e0c4]
  - nextra@4.3.0-alpha.19

## 4.3.0-alpha.18

### Patch Changes

- Updated dependencies [7de40fb]
- Updated dependencies [00f4696]
- Updated dependencies [31ddba4]
  - nextra@4.3.0-alpha.18

## 4.3.0-alpha.17

### Patch Changes

- 8edc715: fix phantom scroll when footer is disabled
  - nextra@4.3.0-alpha.17

## 4.3.0-alpha.16

### Patch Changes

- b0dde33: Fix collapse behaviour of sidebar

  - When a nested route item is active, clicking the parent route item should
    not collapse the section.
  - When the collapsible section is open, clicking the parent route item should
    not cause it to collapse.
  - Switching to another route should not trigger an unexpected reopening.
  - nextra@4.3.0-alpha.16

## 4.3.0-alpha.15

### Patch Changes

- b2cba90: improve TSDoc comments for `getPageMap`, `generateStaticParamsFor`
  and `importPage` functions. Add new https://nextra.site/docs/guide/api page.
- Updated dependencies [b2cba90]
  - nextra@4.3.0-alpha.15

## 4.3.0-alpha.14

### Patch Changes

- a506e0b: fix `TypeError: page.generateMetadata is not a function` when using
  with `withSentryConfig` plugin
- Updated dependencies [a506e0b]
  - nextra@4.3.0-alpha.14

## 4.3.0-alpha.13

### Patch Changes

- 47ba5f3: fix: use `em` for padding-y, padding-x and border-radius styles of
  `<Code>` element

  fix(TSDoc): for return signature without `name` return mobile card instead of
  table

  feat: use `em` instead `rem` for margins

- d29469e: support Next.js 15.3.0
- Updated dependencies [47ba5f3]
- Updated dependencies [d29469e]
  - nextra@4.3.0-alpha.13

## 4.3.0-alpha.12

### Patch Changes

- 40267dc: split `TSDoc` component logic to `TSDoc` component and
  `generateDocumentation` function

  update https://nextra.site/docs/built-ins/tsdoc documentation

- Updated dependencies [40267dc]
  - nextra@4.3.0-alpha.12

## 4.3.0-alpha.11

### Patch Changes

- 71f7b3f: Update https://nextra.site/docs/guide/search page

  Fixes extra margin-top inside `Tabs.Tab`

  Fix breaking `<Steps>` component numeration when there is `<Tabs>` component
  inside

- Updated dependencies [71f7b3f]
  - nextra@4.3.0-alpha.11

## 4.3.0-alpha.10

### Minor Changes

- fdeb5fe: feat: add new Layout prop `feedback.link` to customize feedback href

### Patch Changes

- nextra@4.3.0-alpha.10

## 4.3.0-alpha.9

### Minor Changes

- 94b081c: feat: refactor `<Search>` component styles for improved transitions
  and visibility

### Patch Changes

- Updated dependencies [94b081c]
  - nextra@4.3.0-alpha.9

## 4.3.0-alpha.8

### Minor Changes

- c134abe: feat: improve overall accessibility, makes text/colors easier to read
  and achieves WCAG Level AAA compliance in many places

### Patch Changes

- Updated dependencies [c134abe]
  - nextra@4.3.0-alpha.8

## 4.3.0-alpha.7

### Minor Changes

- 07debf9: feat(TSDoc): support flattening return object fields

### Patch Changes

- Updated dependencies [07debf9]
  - nextra@4.3.0-alpha.7

## 4.3.0-alpha.6

### Patch Changes

- a070fdc: Fix `[object Object]` text on hovering breadcrumbs and pagination
  links
  - nextra@4.3.0-alpha.6

## 4.3.0-alpha.5

### Minor Changes

- eed8328: feat: adapt colors and icons from original GitHub alerts syntax

  feat: new Callout type `important`

  fix: inconsistent built-in Callout's icons size

  feat: improve Callout's accessibility colors

### Patch Changes

- Updated dependencies [eed8328]
  - nextra@4.3.0-alpha.5

## 4.3.0-alpha.4

### Patch Changes

- 4547eb9: feat(TSDoc): add support for functions and functions with multiple
  signatures
- Updated dependencies [4547eb9]
  - nextra@4.3.0-alpha.4

## 4.3.0-alpha.3

### Patch Changes

- Updated dependencies [f717156]
  - nextra@4.3.0-alpha.3

## 4.3.0-alpha.2

### Patch Changes

- 8ac2506: chore: bump `babel-plugin-react-compiler` and
  `react-compiler-runtime`, remove custom pnpm patch for
  `babel-plugin-react-compiler`
- Updated dependencies [8ac2506]
  - nextra@4.3.0-alpha.2

## 4.3.0-alpha.1

### Patch Changes

- Updated dependencies [9f449e5]
  - nextra@4.3.0-alpha.1

## 4.3.0-alpha.0

### Minor Changes

- 83f6c57: feat: introduce new `<TSDoc />` component

  The `<TSDoc>` component from `nextra/tsdoc` generates a properties table that
  displays:

  - **Property name**
  - **TypeScript type**
  - **Property description** - is parsed from [TSDoc](https://tsdoc.org) inline
    description or the `@description` tag. You can use any Markdown/MDX syntax
    here.
  - **Default value** - are extracted from the `@default` or `@defaultValue`
    tag.
  - **Permalink** - a `#` anchor link to the property row for easy reference.

  More info can be found in https://nextra.site/docs/built-ins/tsdoc

  > [!IMPORTANT]
  >
  > Huge thanks to
  > [xyflow - Node Based UIs for React and Svelte](https://xyflow.com/?utm_source=github&utm_campaign=nextra-4.3&utm_content=changelog)
  > for sponsoring this feature!

### Patch Changes

- Updated dependencies [83f6c57]
  - nextra@4.3.0-alpha.0

## 4.2.18

### Patch Changes

- Updated dependencies [e1c2b1b]
  - nextra@4.2.18

## 4.2.17

### Patch Changes

- a7db0e6: fix: use correct `ReactNode` zod validation for
  `Layout.footer/banner/editLink/feedback.content/toc.backToTop/toc.extraContent/toc.title/search`
  and `Navbar.children/projectIcon/chatIcon`
- aac469e: fix: improve sidebar folder item arrow animation
- Updated dependencies [a7db0e6]
- Updated dependencies [18e7fb9]
  - nextra@4.2.17

## 4.2.16

### Patch Changes

- 2cfaacc: fix: frozen spinner on loading state in search results by updating
  Tailwind CSS to v4.0.10
- Updated dependencies [2cfaacc]
  - nextra@4.2.16

## 4.2.15

### Patch Changes

- 27dcd23: fix: better error message for `Layout#lastUpdated` prop. Ensure
  `lastUpdated` is React component and not React fragment.
- 5617e04: fix: loading state in search results was only visible during the
  first search
- Updated dependencies [5617e04]
  - nextra@4.2.15

## 4.2.14

### Patch Changes

- ccb5da2: removing custom nextra's scrollbar styles, allowing the browser's
  default scrollbars to be used
- 05a202d: fix: make search results appear above the navbar
- fd4e6d1: fix: make scroll position in sidebar stable between client-side
  navigation
- Updated dependencies [ccb5da2]
- Updated dependencies [05a202d]
  - nextra@4.2.14

## 4.2.13

### Patch Changes

- Updated dependencies [fc4035c]
- Updated dependencies [fc4035c]
  - nextra@4.2.13

## 4.2.12

### Patch Changes

- 23b1c48: increate z-index for `type: menu` dropdown from `20` to `30`
  - nextra@4.2.12

## 4.2.11

### Patch Changes

- 8805d3f: - add `overflow: hidden` on `<html>` element instead of `<body>` to
  lock scroll when mobile nav is open
  - increase z-index for mobile nav from `10` to `20`, in navbar from `20` to
    `30`
  - fix navbar alignement on mobile when `Navbar.align` prop is set to `left`
  - nextra@4.2.11

## 4.2.10

### Patch Changes

- 5c22495: - add `Navbar.align` prop to align navigation links to the specified
  side. (default `'right'`)
  - fix hidden nav links when specified with `type: 'page', href: '...'` in
    `_meta` files
- Updated dependencies [5c22495]
  - nextra@4.2.10

## 4.2.9

### Patch Changes

- 31534cb: add `Navbar.className` prop
  - nextra@4.2.9

## 4.2.8

### Patch Changes

- e610d1d: fix type of `Navbar.children`, should be `ReactNode`, not
  `ReactElement`
  - nextra@4.2.8

## 4.2.7

### Patch Changes

- 9b5eea6: allow change `nextThemes.forcedTheme` prop
  - nextra@4.2.7

## 4.2.6

### Patch Changes

- Updated dependencies [a7906d1]
  - nextra@4.2.6

## 4.2.5

### Patch Changes

- Updated dependencies [e6c3050]
  - nextra@4.2.5

## 4.2.4

### Patch Changes

- Updated dependencies [b46d831]
- Updated dependencies [7949e28]
  - nextra@4.2.4

## 4.2.3

### Patch Changes

- ca67a19: remove requirement `page.{jsx,tsx}` pages to have exported `metadata`
  object
- Updated dependencies [ca67a19]
  - nextra@4.2.3

## 4.2.2

### Patch Changes

- Updated dependencies [dd32eca]
  - nextra@4.2.2

## 4.2.1

### Patch Changes

- 5c51b49: fix allow configuring `theme.toc` in `_meta` file when `toc.float` is
  set to `false` for pages with `type: 'page'`
- 996b0b5: fix: show `Scroll to top` link `toc.backToTop` when
  `toc.float: false` is set
  - nextra@4.2.1

## 4.2.0

### Minor Changes

- 90b8c66: allow configuring `theme.toc` with `layout: 'default'` in `_meta`
  files

### Patch Changes

- 0b0db89: better animations for open/closed state for the `<NavbarMenu>`
  component which is rendered with `type: 'menu'` in `_meta` file
- 427b080: calculate `--nextra-banner-height` after mounting banner, so banner
  text can be wrapped on multiple lines
- 6b8053f: fix a sudden height jump on opening for `<detail>` element when his
  last children contain margins
- 5d1e75b: add the missing `transition-opacity` style for the `<BackToTop>`
  component
- b0e686e: hide default `<summary>` arrow on mobile
- 2b0b434: add the missing `cursor-pointer` style in the `<BackToTop>` component
- bcc34cc: reduce main area padding x to from `24px` to `16px` like in next.js
  docs
- Updated dependencies [427b080]
- Updated dependencies [6b8053f]
- Updated dependencies [b0e686e]
  - nextra@4.2.0

## 4.1.1

### Patch Changes

- b9f8bfb: do not render default footer content if the `Footer#children` prop
  was not provided
- 8d878dd: fix: show heading anchor when hover on heading itself
- 20f7aaa: fix
  `Uncaught Error: Minified React error #418; visit https://react.dev/errors/418`
  error due mismatch of last updated time date
- 57e98cd: add `Layout#sidebar.defaultOpen` prop to configure sidebar default
  open state
- d586bd6: fix `ThemeSwitch#lite` prop
- 29a44de: fix regression from Nextra 3 setting
  [`theme.collapsed?: boolean` in `_meta` file](https://nextra.site/docs/file-conventions/meta-file#theme-option)
  for folders has no effect in sidebar
- 5e86a14: add missing transition state for `<Navbar>` links and `<TOC>` extra
  content links
- 2ba45de: allow change `_meta` file `theme.toc` property with `type: 'page'`
- Updated dependencies [29a44de]
- Updated dependencies [19578c3]
  - nextra@4.1.1

## 4.1.0

### Minor Changes

- 7caf059: - generate unique anchor id for `<summary>` elements based on its
  content at build time
  - add anchor link icon for `<summary>`

### Patch Changes

- fa7f1ee: fix cropped sidebar footer on desktop, when Nextra's `<Banner>` is
  used
- Updated dependencies [7caf059]
  - nextra@4.1.0

## 4.0.9

### Patch Changes

- Updated dependencies [e78f796]
- Updated dependencies [ff007b2]
  - nextra@4.0.9

## 4.0.8

### Patch Changes

- Updated dependencies [267ef81]
  - nextra@4.0.8

## 4.0.7

### Patch Changes

- Updated dependencies [32e7d55]
- Updated dependencies [695e428]
- Updated dependencies [fc78033]
- Updated dependencies [b2f2458]
  - nextra@4.0.7

## 4.0.6

### Patch Changes

- Updated dependencies [44ea060]
  - nextra@4.0.6

## 4.0.5

### Patch Changes

- Updated dependencies [14bf091]
  - nextra@4.0.5

## 4.0.4

### Patch Changes

- 5132295: fix broken `showLineNumbers` setting on code blocks
- 5132295: fix unable order \_meta key with `index` name
- Updated dependencies [5132295]
- Updated dependencies [5132295]
  - nextra@4.0.4

## 4.0.3

### Patch Changes

- a0c432f: fix
  `TypeError: Cannot read properties of null (reading 'querySelector')`
  - nextra@4.0.3

## 4.0.2

### Patch Changes

- 865e2ab: hide `On This Page` TOC's title `themeConfig.toc.title` when there is
  no toc links
  - nextra@4.0.2

## 4.0.1

### Patch Changes

- 481e0d0: fix syntax highlighting for `mdx` lang and improve docs for
  `/docs/docs-theme/start`
- 426cd66: Remove margin-top from `.nextra-steps` `:before` pseudo selector
- Updated dependencies [481e0d0]
- Updated dependencies [426cd66]
  - nextra@4.0.1

## 4.0.0

### Major Changes

- 283320f: remove `"typesVersions"` field from `package.json`. You need to set
  `"moduleResolution": "bundler"` in your `tsconfig.json` if you are using
  TypeScript
- 283320f: move `<Collapse>`, `<Details>`, `<Summary>`, `<SkipNavContent>`,
  `SkipNavLink`, `<Select>` and `<Bleed>` from `nextra-theme-docs` to
  `nextra/components`
- 283320f: remove `<Th>`, `<Tr>` and `<Td>` exports (since they should be always
  used with `<Table>` component)

  ```diff
  - import { Table, Th, Tr, Td } from 'nextra/components'
  + import { Table } from 'nextra/components'

  // ...

  - <Th>
  + <Table.Th>
  - <Tr>
  + <Table.Tr>
  - <Td>
  + <Table.Td>
  ```

- 283320f: make `compileMdx` from `nextra/compile` return a `string` instead of
  an `object`
- 283320f: remove `i18n.direction` option
- 283320f: remove `export const title` from generated mdx pages
- 283320f: The initial version which supports App Router instead of Pages
  Router, something may be broken, check
  https://github.com/shuding/nextra/tree/v4-v2/examples for the migration guide
- 283320f: fix focusing on first search result item
- 283320f: remove `navbar` and `footer` props, pass `<Navbar>` and `<Footer>` as
  children of `<Layout>`
- 283320f: migrate search from Flexsearch to Pagefind
- 283320f: migrate from react context to zustand
- 283320f: - add root `_meta.global.{js,jsx,ts,tsx}` file
  > See
  > [working example](https://github.com/shuding/nextra/blob/v4-v2/docs/app/_meta.global.ts)
  > based on https://nextra.site website
  - `getPageMap` now receive only 1 argument `root?: string = '/'` instead of 2
    `lang?: string, route?: string = '/'`
  - remove `createCatchAllMeta` from `nextra/catch-all`
  - remove `collectCatchAllRoutes`
  - remove `normalizePageRoute`
  - add `mergeMetaWithPageMap` to `nextra/page-map`
  - move adding `metadata.filePath`, `metadata.title` and `metadata.readingTime`
    in remark plugin
  - refactor recma rewrite plugin and add tests
    - remove `recmaRewriteJsx`
    - remove `recmaRewriteFunctionBody`
  - make `convertPageMapToJs` sync
- 283320f: improve performance on projects without Turbopack enabled
- 283320f: release Nextra rc.0
- 283320f: - migrate to tailwind css v4.beta2
  - refactor builtin CSS classes from `_` prefix to `x:` prefix
  - remove `color-primary-750` theme color variant
- 283320f: replace `export const useTOC = () = [/* your headings */]` by
  `export const toc = [/* your headings */]`
- 283320f: move `<Head>` component in `nextra/components`
- 283320f: remove `feedback.useLink` and `editLink.component` option, remove
  `themeConfig` prop on `<Layout>` component

  change `gitTimestamp` option to boolean

  remove `nextraCofig.transform` option

- 283320f: replace `gitTimestamp` option with `lastUpdated`

  replace `editLink.content` option with `editLink`

- 283320f: support `<Head>`'s `backgroundColor.dark/light` props colors in
  `rgb(...,...,...)` and `#RRGGBB` formats
- 283320f: remove `renderComponent` and `renderString`
- 283320f: require Next.js minimum v14
- 283320f: - add `nextra/components` to `experimental.optimizePackageImports` to
  optimize `nextra/components` by default
  - remove `<RemoteContent>` from `nextra/components`
  - rename `<RemoteContent>` to `MDXRemote` and move to `nextra/mdx-remote`
- 283320f: document removed theme config options

  - `main`
  - `direction`
  - `toc.component`
  - `themeSwitch.component`
  - `themeSwitch.useOptions`
  - `search.component`
  - `feedback.useLink`
  - `banner.dismissible`
  - `banner.key`
  - `banner.content`
  - `footer.content`
  - `footer.component`
  - `head`
  - `navbar.component`
  - `navbar.extraContent`
  - `project.link`
  - `project.icon`
  - `chat.link`
  - `chat.icon`
  - `search.emptyResult`
  - `search.loading`
  - `search.errorText`
  - `search.placeholder`
  - `search.className`

  refactor `themeSwitch.useOptions` to `themeSwitch` option

  refactor `editLink.content` to `editLink` option

  rename Search prop `error` to `errorText`

### Minor Changes

- 283320f: content width could be configured via CSS `--nextra-content-width`
  variable
- 283320f: add opacity animation for `:target` state for headings h2-h6
- 283320f: - use ReactIcon for code blocks with `jsx`, `tsx` language
  - add JsonIcon for `json` language
  - parse language from filename if exist when `diff` language is specified
  - use JavaScript icon for `cjs` and `mjs`
  - use TypeScript icon for `cts` and `mts`
- 283320f: export a `style-prefixed.css` file with Tailwind CSS v4 prefixed
  layers for projects using Tailwind CSS v3

  - `@layer utilities` -> `@layer v4-utilities`
  - `@layer base` -> `@layer v4-base`

- 283320f: include `document.referrer` in link in `<NotFoundPage>` component
- 283320f: replace `useContentDir` with `contentDirBasePath` option which
  configure `content` directory under a catch-all subdirectory
- 283320f: move TOC logic from `recma-rewrite-jsx` plugin to
  `rehype-extract-toc-content` plugin
- 283320f: make `page.{jsx,tsx,mdx}` pages and `_meta` files from `app` dir, and
  also `content` folder files - all add to `pageMap`, but ignore dynamic pages
  `[[`
- 283320f: compile sidebar components with react compiler
- e11dbe0: set `content` value for `<meta name="theme-color">` based on
  background value for light and dark themes
- 283320f: refactor `useMenuActions` to `setMenu`, `useFocusedRouteActions` to
  `setFocusedRoute`

### Patch Changes

- 283320f: fix mobile nav position
- 283320f: search tweaks
- fdd2c6a: fix steps background on dark mode fix headings anchor link color on
  dark mode
- 283320f: setup `@typescript-eslint/no-unnecessary-condition` rule and fix
  warnings
- aca79fa: Don't focus search input on `Ctrl + k` on non Mac devices. Don't
  focus search input on `⌘ + Shift + k` or `Ctrl + Shift + k`.
- 283320f: add helpful error message about not available search on development
  mode
- 283320f: add `getPageMap` helper function to `nextra/page-map`
- 283320f: Fixes when Turbopack is enabled:
  `Module not found: Can't resolve '@theguild/remark-mermaid/mermaid'`
- 283320f: add `whiteListTagsStyling` nextra config option
- 283320f: fix unable to select text and `::selection` style
- 283320f: - allow override/add additional icons for code blocks
  - remove `nextraConfig.mdxOptions.providerImportSource` option in favour of
    `mdx-components` file
- 283320f: - Use Tailwind CSS CLI because CSS processing by `tsup` produce
  different, weird and broken result
  - Patch react-compiler with some fixes which isn't fixed
- 283320f: - Simplify the class-name of the sidebar file item
  - fix unclosable active folder when it's `<button>` element and not `<a>`
  - improve `<Collapse>` to add inner `<div>` only if children != 1
- 283320f: export `setMenu`
- 283320f: use `Date.now()` for last edit time on development and git last
  commit time on production
- 283320f: move `pagefind` output to `public/_pagefind` directory
  https://github.com/shuding/nextra/pull/3517
- 283320f: initialize `transformerTwoslash` only 1 time outside of loader
- 283320f: Add aria attrs to the sidebar collapse button
- 283320f: - remove `nextra/context`
  - remove `type NextraThemeLayoutProps`
- 283320f: fix edit on github and last updated at for catch all routes
- 283320f: simplify `generatePageMap`
- 283320f: - if `filePath` is falsy in client wrapper -> do not render
  `edit on github` link
  - if `filePath` starts with `http` do not append `docsRepositoryBase` prefix
- 283320f: Add `nextra-mobile-nav` to `<MobileNav>`
- 283320f: - parse and transform `_meta` files with zod
  - remove `_meta` `newWindow` field
- 283320f: allow `editLink`/`feedback.content`/`search`/`toc.backToTop` be
  `null` as value
- 283320f: sync with nextra 3.1.0
- 283320f: Cache the result of `repository.getFileLatestModifiedDateAsync`
  because it can slow down Fast Refresh for uncommitted files.
- 283320f: add `bottomContent` prop for `<Wrapper>` component, e.g. to put some
  content after pagination in `nextra-theme-docs`
- 283320f: migrate to zustand v5
- 283320f: remove `transition` for `transform` property when opening mobile nav
- 283320f: avoid unnecessary updates to the config store on initial render
- 283320f: reduce bundle size of bundled website by compiling svg icons in
  separated files
- 283320f: enable page reload of catch-all routes `app/[[...slug]].jsx` on
  content change
- 283320f: remove default value of `Navbar.logo`, now this prop is required
- 283320f: remove false positive warnings on projects without `content/`
  directory

  ```
  ⚠ Compiled with warnings

  ../packages/nextra/dist/client/pages.js
  Module not found: Can't resolve 'private-next-root-dir/content' in '/Users/dmytro/Desktop/nextra/packages/nextra/dist/client'
  ```

- 283320f: fix error goes from `playground.js` file when your `mdx-components`
  file contain server-only components

  ```
  ./app/layout.tsx
  'client-only' cannot be imported from a Server Component module. It should only be used from a Client Component.

  Import trace for requested module:
  ../packages/components/dist/index.js
  ./mdx-components.js
  ../node_modules/.pnpm/nextra@4.0.0-app-router.20_@types+react@18.3.12_acorn@8.14.0_next@15.0.2_@babel+core@7.26.0_r_73lkrljx3r7g5vsm2cmbm3erma/node_modules/nextra/dist/client/components/remote-content.js
  ../node_modules/.pnpm/nextra@4.0.0-app-router.20_@types+react@18.3.12_acorn@8.14.0_next@15.0.2_@babel+core@7.26.0_r_73lkrljx3r7g5vsm2cmbm3erma/node_modules/nextra/dist/client/components/playground.js
  ```

- 283320f: - sync with nextra 3.0.15

  - bump to Next 15
  - remove importing of `style.css` in themes, you need to import now manually
    by

  ```js
  import 'nextra-theme-docs/style.css' // for docs theme
  import 'nextra-theme-blog/style.css' // for blog theme
  ```

- 283320f: add `normalizePagesResult.activeMetadata` to get value of front
  matter or exported metadata from page
- 283320f: add support for turbopack `next dev --turbopack`
- 283320f: fix `colorSchema` for HEX format with 4 chars, e.g. `#111`
- 283320f: fix external svg icon was added for span in `<Anchor>`
- 283320f: remove `NormalizedResult.flatDirectories`

  remove `Item.withIndexPage`, use `'frontMatter' in Item`

- 283320f: sync with nextra 3.0.10
- 283320f: defer pagefind results update for prioritizing the user input state
- 283320f: make Nextra works with `src/app` and `src/content` directories
- 283320f: - fix missing tailwind class for `json` icon in code blocks
  - capitalize folders in sidebar even without index pages
  - sync with nextra 3.2.4
- 283320f: add ↗ char for external links
- 283320f: sync with nextra 3.0.3
- 283320f: fix injecting mdx-components into headings and injecting into toc
- 283320f: add required `Layout.navbar`, `Layout.footer` props and optional
  `Layout.banner` prop, you don't need to pass them as `children` now
- 283320f: fix unclickable `type: menu` on mobile nav
- 283320f: - add `disabled` prop for `<Folder>` component when `open` prop was
  set (to disable click event and remove `cursor: pointer`)
  - allow `<h5>` and `<h6>` tags be used with `<Steps>`
  - fix Webpack module rebuild for pageMap when new files where added or removed
    in `app` dir or `content` dir
- 283320f: `firstChildRoute` should return "index" route as first
- 283320f: Use `primaryColor` for `::selection` styles
- 283320f: replace `nextraConfig.mdxBaseDir: string` by `useContentDir: boolean`
- 283320f: support `GitHub Alert Syntax`
- 283320f: fix search, didn't work with Next.js' `basePath` set
- 283320f: fix click on the arrow icon in the folder item in the Sidebar, was
  always consider clicked on `<a>` or `<button>` due `event.currentTarget`
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [fdd2c6a]
- Updated dependencies [283320f]
- Updated dependencies [aca79fa]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [e11dbe0]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
- Updated dependencies [283320f]
  - nextra@4.0.0

## 4.0.0-rc.0

### Major Changes

- 28796b4: release Nextra rc.0

### Patch Changes

- Updated dependencies [28796b4]
  - nextra@4.0.0-rc.0

## 4.0.0-app-router.43

### Patch Changes

- 50c2f76: add `bottomContent` prop for `<Wrapper>` component, e.g. to put some
  content after pagination in `nextra-theme-docs`
- 50c2f76: fix `colorSchema` for HEX format with 4 chars, e.g. `#111`
- Updated dependencies [50c2f76]
- Updated dependencies [50c2f76]
  - nextra@4.0.0-app-router.43

## 4.0.0-app-router.42

### Patch Changes

- 242e0d0: search tweaks
- 3fc12a0: - Use Tailwind CSS CLI because CSS processing by `tsup` produce
  different, weird and broken result
  - Patch react-compiler with some fixes which isn't fixed
- 25c33dd: - if `filePath` is falsy in client wrapper -> do not render
  `edit on github` link
  - if `filePath` starts with `http` do not append `docsRepositoryBase` prefix
- Updated dependencies [242e0d0]
- Updated dependencies [3fc12a0]
  - nextra@4.0.0-app-router.42

## 4.0.0-app-router.41

### Patch Changes

- 562c2b1: fix unclickable `type: menu` on mobile nav
  - nextra@4.0.0-app-router.41

## 4.0.0-app-router.40

### Patch Changes

- Updated dependencies [88135ec]
  - nextra@4.0.0-app-router.40

## 4.0.0-app-router.39

### Patch Changes

- Updated dependencies [711dbe7]
  - nextra@4.0.0-app-router.39

## 4.0.0-app-router.38

### Patch Changes

- Updated dependencies [42eb445]
  - nextra@4.0.0-app-router.38

## 4.0.0-app-router.37

### Patch Changes

- Updated dependencies [ad80ee1]
  - nextra@4.0.0-app-router.37

## 4.0.0-app-router.36

### Patch Changes

- Updated dependencies [739e9eb]
- Updated dependencies [d805f2a]
- Updated dependencies [0ab4ff1]
  - nextra@4.0.0-app-router.36

## 4.0.0-app-router.35

### Minor Changes

- e43a435: content width could be configured via CSS `--nextra-content-width`
  variable

### Patch Changes

- Updated dependencies [96fb083]
  - nextra@4.0.0-app-router.35

## 4.0.0-app-router.34

### Minor Changes

- 6d22c8f: export a `style-prefixed.css` file with Tailwind CSS v4 prefixed
  layers for projects using Tailwind CSS v3

  - `@layer utilities` -> `@layer v4-utilities`
  - `@layer base` -> `@layer v4-base`

### Patch Changes

- nextra@4.0.0-app-router.34

## 4.0.0-app-router.33

### Patch Changes

- Updated dependencies [dd2e216]
  - nextra@4.0.0-app-router.33

## 4.0.0-app-router.32

### Minor Changes

- 2cd964f: compile sidebar components with react compiler

### Patch Changes

- fbeef15: setup `@typescript-eslint/no-unnecessary-condition` rule and fix
  warnings
- ea7bece: Add `nextra-mobile-nav` to `<MobileNav>`
- Updated dependencies [fbeef15]
  - nextra@4.0.0-app-router.32

## 4.0.0-app-router.31

### Patch Changes

- Updated dependencies [386b620]
  - nextra@4.0.0-app-router.31

## 4.0.0-app-router.30

### Patch Changes

- f277a7a: fix search, didn't work with Next.js' `basePath` set
- Updated dependencies [f277a7a]
  - nextra@4.0.0-app-router.30

## 4.0.0-app-router.29

### Major Changes

- 4bdf82d: - migrate to tailwind css v4.beta2
  - refactor builtin CSS classes from `_` prefix to `x:` prefix
  - remove `color-primary-750` theme color variant

### Patch Changes

- Updated dependencies [4bdf82d]
  - nextra@4.0.0-app-router.29

## 4.0.0-app-router.28

### Patch Changes

- 846552e: - fix missing tailwind class for `json` icon in code blocks
  - capitalize folders in sidebar even without index pages
  - sync with nextra 3.2.4
- Updated dependencies [846552e]
  - nextra@4.0.0-app-router.28

## 4.0.0-app-router.27

### Major Changes

- 8a0ae0f: - add root `_meta.global.{js,jsx,ts,tsx}` file
  > See
  > [working example](https://github.com/shuding/nextra/blob/v4-v2/docs/app/_meta.global.ts)
  > based on https://nextra.site website
  - `getPageMap` now receive only 1 argument `root?: string = '/'` instead of 2
    `lang?: string, route?: string = '/'`
  - remove `createCatchAllMeta` from `nextra/catch-all`
  - remove `collectCatchAllRoutes`
  - remove `normalizePageRoute`
  - add `mergeMetaWithPageMap` to `nextra/page-map`
  - move adding `metadata.filePath`, `metadata.title` and `metadata.readingTime`
    in remark plugin
  - refactor recma rewrite plugin and add tests
    - remove `recmaRewriteJsx`
    - remove `recmaRewriteFunctionBody`
  - make `convertPageMapToJs` sync

### Patch Changes

- 5e06f57: fix injecting mdx-components into headings and injecting into toc
- Updated dependencies [8a0ae0f]
- Updated dependencies [5e06f57]
  - nextra@4.0.0-app-router.27

## 4.0.0-app-router.26

### Minor Changes

- 0076bad: move TOC logic from `recma-rewrite-jsx` plugin to
  `rehype-extract-toc-content` plugin

### Patch Changes

- be82724: Fixes when Turbopack is enabled:
  `Module not found: Can't resolve '@theguild/remark-mermaid/mermaid'`
- Updated dependencies [be82724]
- Updated dependencies [0076bad]
  - nextra@4.0.0-app-router.26

## 4.0.0-app-router.25

### Major Changes

- c095f98: make `compileMdx` from `nextra/compile` return a `string` instead of
  an `object`
- 79bbab7: remove `export const title` from generated mdx pages
- 33ee518: replace `export const useTOC = () = [/* your headings */]` by
  `export const toc = [/* your headings */]`

### Patch Changes

- 3edc6d7: use `Date.now()` for last edit time on development and git last
  commit time on production
- fdbae45: initialize `transformerTwoslash` only 1 time outside of loader
- Updated dependencies [c095f98]
- Updated dependencies [79bbab7]
- Updated dependencies [3edc6d7]
- Updated dependencies [fdbae45]
- Updated dependencies [33ee518]
  - nextra@4.0.0-app-router.25

## 4.0.0-app-router.24

### Patch Changes

- e46dbdf: Cache the result of `repository.getFileLatestModifiedDateAsync`
  because it can slow down Fast Refresh for uncommitted files.
- cc33237: avoid unnecessary updates to the config store on initial render
- Updated dependencies [e46dbdf]
  - nextra@4.0.0-app-router.24

## 4.0.0-app-router.23

### Patch Changes

- 803e5be: migrate to zustand v5
- 7212f88: remove `transition` for `transform` property when opening mobile nav
- b2e44d3: make Nextra works with `src/app` and `src/content` directories
- Updated dependencies [b2e44d3]
  - nextra@4.0.0-app-router.23

## 4.0.0-app-router.22

### Patch Changes

- 5f79b77: fix unable to select text and `::selection` style
- 57fde3f: reduce bundle size of bundled website by compiling svg icons in
  separated files
- Updated dependencies [5f79b77]
- Updated dependencies [57fde3f]
  - nextra@4.0.0-app-router.22

## 4.0.0-app-router.21

### Major Changes

- 730899e: - add `nextra/components` to `experimental.optimizePackageImports` to
  optimize `nextra/components` by default
  - remove `<RemoteContent>` from `nextra/components`
  - rename `<RemoteContent>` to `MDXRemote` and move to `nextra/mdx-remote`

### Patch Changes

- 4e02ef3: fix error goes from `playground.js` file when your `mdx-components`
  file contain server-only components

  ```
  ./app/layout.tsx
  'client-only' cannot be imported from a Server Component module. It should only be used from a Client Component.

  Import trace for requested module:
  ../packages/components/dist/index.js
  ./mdx-components.js
  ../node_modules/.pnpm/nextra@4.0.0-app-router.20_@types+react@18.3.12_acorn@8.14.0_next@15.0.2_@babel+core@7.26.0_r_73lkrljx3r7g5vsm2cmbm3erma/node_modules/nextra/dist/client/components/remote-content.js
  ../node_modules/.pnpm/nextra@4.0.0-app-router.20_@types+react@18.3.12_acorn@8.14.0_next@15.0.2_@babel+core@7.26.0_r_73lkrljx3r7g5vsm2cmbm3erma/node_modules/nextra/dist/client/components/playground.js
  ```

- 0d74f68: fix external svg icon was added for span in `<Anchor>`
- Updated dependencies [4e02ef3]
- Updated dependencies [0d74f68]
- Updated dependencies [730899e]
  - nextra@4.0.0-app-router.21

## 4.0.0-app-router.20

### Major Changes

- 16816f2: remove `<Th>`, `<Tr>` and `<Td>` exports (since they should be always
  used with `<Table>` component)

  ```diff
  - import { Table, Th, Tr, Td } from 'nextra/components'
  + import { Table } from 'nextra/components'

  // ...

  - <Th>
  + <Table.Th>
  - <Tr>
  + <Table.Tr>
  - <Td>
  + <Table.Td>
  ```

- 0a63ba3: improve performance on projects without Turbopack enabled

### Minor Changes

- 2bd6f41: include `document.referrer` in link in `<NotFoundPage>` component

### Patch Changes

- 7cc8ca1: simplify `generatePageMap`
- 16816f2: remove false positive warnings on projects without `content/`
  directory

  ```
  ⚠ Compiled with warnings

  ../packages/nextra/dist/client/pages.js
  Module not found: Can't resolve 'private-next-root-dir/content' in '/Users/dmytro/Desktop/nextra/packages/nextra/dist/client'
  ```

- b873702: `firstChildRoute` should return "index" route as first
- Updated dependencies [3d8705c]
- Updated dependencies [16816f2]
- Updated dependencies [27454c4]
- Updated dependencies [7cc8ca1]
- Updated dependencies [aa94d91]
- Updated dependencies [0a63ba3]
- Updated dependencies [71a051b]
- Updated dependencies [0a63ba3]
- Updated dependencies [16816f2]
- Updated dependencies [b873702]
  - nextra@4.0.0-app-router.20

## 4.0.0-app-router.19

### Patch Changes

- Updated dependencies [a3627e5]
  - nextra@4.0.0-app-router.19

## 4.0.0-app-router.18

### Minor Changes

- 439466a: replace `useContentDir` with `contentDirBasePath` option which
  configure `content` directory under a catch-all subdirectory
- b00a560: make `page.{jsx,tsx,mdx}` pages and `_meta` files from `app` dir, and
  also `content` folder files - all add to `pageMap`, but ignore dynamic pages
  `[[`

### Patch Changes

- a074a99: add `whiteListTagsStyling` nextra config option
- Updated dependencies [a074a99]
- Updated dependencies [439466a]
- Updated dependencies [b00a560]
  - nextra@4.0.0-app-router.18

## 4.0.0-app-router.17

### Patch Changes

- 7a48610: export `setMenu`
- 33568c1: add `normalizePagesResult.activeMetadata` to get value of front
  matter or exported metadata from page
- Updated dependencies [33568c1]
  - nextra@4.0.0-app-router.17

## 4.0.0-app-router.16

### Minor Changes

- ab21db7: - use ReactIcon for code blocks with `jsx`, `tsx` language
  - add JsonIcon for `json` language
  - parse language from filename if exist when `diff` language is specified
  - use JavaScript icon for `cjs` and `mjs`
  - use TypeScript icon for `cts` and `mts`

### Patch Changes

- 0540e6c: - add `disabled` prop for `<Folder>` component when `open` prop was
  set (to disable click event and remove `cursor: pointer`)
  - allow `<h5>` and `<h6>` tags be used with `<Steps>`
  - fix Webpack module rebuild for pageMap when new files where added or removed
    in `app` dir or `content` dir
- Updated dependencies [ab21db7]
- Updated dependencies [0540e6c]
- Updated dependencies [5b47509]
  - nextra@4.0.0-app-router.16

## 4.0.0-app-router.15

### Minor Changes

- 367293e: add opacity animation for `:target` state for headings h2-h6

### Patch Changes

- nextra@4.0.0-app-router.15

## 4.0.0-app-router.14

### Major Changes

- be19dd4: remove `"typesVersions"` field from `package.json`. You need to set
  `"moduleResolution": "bundler"` in your `tsconfig.json` if you are using
  TypeScript

### Patch Changes

- 9ca1765: fix mobile nav position
- 2b41ec7: remove default value of `Navbar.logo`, now this prop is required
- Updated dependencies [be19dd4]
  - nextra@4.0.0-app-router.14

## 4.0.0-app-router.13

### Major Changes

- 54657e2: require Next.js minimum v15

### Patch Changes

- 3ade013: - remove `nextra/context`
  - remove `type NextraThemeLayoutProps`
- ddc39cc: - parse and transform `_meta` files with zod
  - remove `_meta` `newWindow` field
- 54657e2: allow `editLink`/`feedback.content`/`search`/`toc.backToTop` be
  `null` as value
- 07213e2: add support for turbopack `next dev --turbopack`
- 54657e2: add required `Layout.navbar`, `Layout.footer` props and optional
  `Layout.banner` prop, you don't need to pass them as `children` now
- Updated dependencies [3ade013]
- Updated dependencies [ddc39cc]
- Updated dependencies [07213e2]
- Updated dependencies [54657e2]
  - nextra@4.0.0-app-router.13

## 4.0.0-app-router.12

### Patch Changes

- b8defc9: sync with nextra 3.1.0
- b8defc9: remove `NormalizedResult.flatDirectories`

  remove `Item.withIndexPage`, use `'frontMatter' in Item`

- Updated dependencies [b8defc9]
- Updated dependencies [b8defc9]
  - nextra@4.0.0-app-router.12

## 4.0.0-app-router.11

### Patch Changes

- be15165: move `pagefind` output to `public/_pagefind` directory
  https://github.com/shuding/nextra/pull/3517
- Updated dependencies [be15165]
  - nextra@4.0.0-app-router.11

## 4.0.0-app-router.10

### Patch Changes

- 8b1a7c9: defer pagefind results update for prioritizing the user input state
- Updated dependencies [8b1a7c9]
  - nextra@4.0.0-app-router.10

## 4.0.0-app-router.9

### Patch Changes

- 2c8a8ab: - sync with nextra 3.0.15

  - bump to Next 15
  - remove importing of `style.css` in themes, you need to import now manually
    by

  ```js
  import 'nextra-theme-docs/style.css' // for docs theme
  import 'nextra-theme-blog/style.css' // for blog theme
  ```

- Updated dependencies [2c8a8ab]
  - nextra@4.0.0-app-router.9

## 4.0.0-app-router.8

### Patch Changes

- 3ce535b: Add aria attrs to the sidebar collapse button
- 9832af9: add ↗ char for external links
- ec39959: Use `primaryColor` for `::selection` styles
- 875842b: support `GitHub Alert Syntax`
- 47c62c8: fix click on the arrow icon in the folder item in the Sidebar, was
  always consider clicked on `<a>` or `<button>` due `event.currentTarget`
- Updated dependencies [9832af9]
- Updated dependencies [ec39959]
- Updated dependencies [875842b]
  - nextra@4.0.0-app-router.8

## 4.0.0-app-router.7

### Patch Changes

- 5201e5f: add helpful error message about not available search on development
  mode
- 3ac2c32: add `getPageMap` helper function from `nextra/page-map`
- b4ca36d: - allow override/add additional icons for code blocks
  - remove `nextraConfig.mdxOptions.providerImportSource` option in favour of
    `mdx-components` file
- 73726ec: - Simplify the class-name of the sidebar file item
  - fix unclosable active folder when it's `<button>` element and not `<a>`
  - improve `<Collapse>` to add inner `<div>` only if children != 1
- 4768dee: replace `nextraConfig.mdxBaseDir: string` by `useContentDir: boolean`
- Updated dependencies [5201e5f]
- Updated dependencies [3ac2c32]
- Updated dependencies [b4ca36d]
- Updated dependencies [4768dee]
  - nextra@4.0.0-app-router.7

## 4.0.0-app-router.6

### Patch Changes

- 2092d5e: enable page reload of catch-all routes `app/[[...slug]].jsx` on
  content change
- a97e5cf: sync with nextra 3.0.10
- Updated dependencies [2092d5e]
- Updated dependencies [a97e5cf]
  - nextra@4.0.0-app-router.6

## 4.0.0-app-router.5

### Patch Changes

- a15a02d: sync with nextra 3.0.3
- Updated dependencies [659b36e]
- Updated dependencies [a15a02d]
  - nextra@4.0.0-app-router.5

## 4.0.0-app-router.4

### Major Changes

- 17e6da5: remove `i18n.direction` option
- 0faa569: replace `gitTimestamp` option with `lastUpdated`

  replace `editLink.content` option with `editLink`

- 17e6da5: document removed theme config options

  - `main`
  - `direction`
  - `toc.component`
  - `themeSwitch.component`
  - `themeSwitch.useOptions`
  - `search.component`
  - `feedback.useLink`
  - `banner.dismissible`
  - `banner.key`
  - `banner.content`
  - `footer.content`
  - `footer.component`
  - `head`
  - `navbar.component`
  - `navbar.extraContent`
  - `project.link`
  - `project.icon`
  - `chat.link`
  - `chat.icon`
  - `search.emptyResult`
  - `search.loading`
  - `search.errorText`
  - `search.placeholder`
  - `search.className`

  refactor `themeSwitch.useOptions` to `themeSwitch` option

  refactor `editLink.content` to `editLink` option

  rename Search prop `error` to `errorText`

### Patch Changes

- nextra@4.0.0-app-router.4

## 4.0.0-app-router.3

### Major Changes

- 1e77fab: move `<Collapse>`, `<Details>`, `<Summary>`, `<SkipNavContent>`,
  `SkipNavLink`, `<Select>` and `<Bleed>` from `nextra-theme-docs` to
  `nextra/components`
- 1e77fab: remove `renderComponent` and `renderString`

### Patch Changes

- 1e77fab: fix edit on github and last updated at for catch all routes
- Updated dependencies [1e77fab]
- Updated dependencies [1e77fab]
- Updated dependencies [1e77fab]
- Updated dependencies [1e77fab]
  - nextra@4.0.0-app-router.3

## 4.0.0-app-router.2

### Major Changes

- 215aa08: fix focusing on first search result item
- 1c83931: remove `navbar` and `footer` props, pass `<Navbar>` and `<Footer>` as
  children of `<Layout>`
- 724f851: migrate from react context to zustand
- 8ef0f58: move `<Head>` component in `nextra/components`
- ee4a467: remove `feedback.useLink` and `editLink.component` option, remove
  `themeConfig` prop on `<Layout>` component

  change `gitTimestamp` option to boolean

  remove `nextraCofig.transform` option

- 62f1553: support `<Head>`'s `backgroundColor.dark/light` props colors in
  `rgb(...,...,...)` and `#RRGGBB` formats

### Minor Changes

- 8f90ed5: refactor `useMenuActions` to `setMenu`, `useFocusedRouteActions` to
  `setFocusedRoute`

### Patch Changes

- Updated dependencies [215aa08]
- Updated dependencies [8ef0f58]
  - nextra@4.0.0-app-router.2

## 4.0.0-app-router.1

### Major Changes

- 26851b5: migrate search from Flexsearch to Pagefind

### Patch Changes

- Updated dependencies [26851b5]
  - nextra@4.0.0-app-router.1

## 4.0.0-app-router.0

### Major Changes

- 99f34d3: The initial version which supports App Router instead of Pages
  Router, something may be broken, check
  https://github.com/shuding/nextra/tree/v4-v2/examples for the migration guide

### Patch Changes

- Updated dependencies [99f34d3]
  - nextra@4.0.0-app-router.0

## 3.3.1

### Patch Changes

- bfa61d9: add `text-overflow: ellipsis` for `<Cards.Card>` component
- Updated dependencies [bfa61d9]
  - nextra@3.3.1

## 3.3.0

### Minor Changes

- ee69234: add
  [image zoom feature](http://nextra.site/docs/guide/image#image-zoom) for all
  images written via [GFM syntax](https://github.github.com/gfm/#images) in
  md/mdx files (except images inside links)

### Patch Changes

- Updated dependencies [ee69234]
  - nextra@3.3.0

## 3.2.5

### Patch Changes

- Updated dependencies [2f5d954]
  - nextra@3.2.5

## 3.2.4

### Patch Changes

- Updated dependencies [a4b0bbb]
  - nextra@3.2.4

## 3.2.3

### Patch Changes

- Updated dependencies [50f33f3]
  - nextra@3.2.3

## 3.2.2

### Patch Changes

- 45cccd4: allow passing `className` for `<Tabs>` and `<Tabs.Tab>`
- Updated dependencies [45cccd4]
  - nextra@3.2.2

## 3.2.1

### Patch Changes

- 9154c2f: fix(nextra-theme-docs): incorrect makePrimaryColor relative value for
  tailwind primary.900
- 8a21a77: - Change hamburger menu animation speed

  Google Core Web Vitals rolled out a new
  [INP](https://developers.google.com/search/blog/2023/05/introducing-inp) score
  The mobile hamburger menu would occasionally get flagged for "need
  improvement"

  - nextra@3.2.1

## 3.2.0

### Minor Changes

- d755012: feat(nextra-theme-docs): add new theme config option
  `color.lightness`

### Patch Changes

- nextra@3.2.0

## 3.1.3

### Patch Changes

- 6e64b16: fix
  `Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in /path/to/project/node_modules/nextra/package.json`
  when using `next.config.ts`
- d44c4bc: requires to have a custom App component (`pages/_app.jsx`)
- 24f9806: fix folder's index page was not merged with folder itself for some
  edge case
- Updated dependencies [6e64b16]
- Updated dependencies [d44c4bc]
- Updated dependencies [24f9806]
  - nextra@3.1.3

## 3.1.2

### Patch Changes

- Updated dependencies [9c78588]
  - nextra@3.1.2

## 3.1.1

### Patch Changes

- 68633e5: fix: Improve Twoslash Popover Display
- Updated dependencies [68633e5]
  - nextra@3.1.1

## 3.1.0

### Minor Changes

- 8e9767e: `activeType` should be initialized from `meta['*']`
- fec399a: fix `type: 'separator'`, `type: 'menu'` and `item` with `href` not
  respecting order when not all pages specified in `_meta` file

### Patch Changes

- 035fe48: - fix empty dropdown menu when \_meta item with `type: "menu"`
  contains items with local pages
- c002118: - add tests for should respect order for `type: "separator"`,
  `type: "menu"` and item with `href`
- Updated dependencies [035fe48]
- Updated dependencies [8e9767e]
- Updated dependencies [fec399a]
- Updated dependencies [c002118]
  - nextra@3.1.0

## 3.1.0-canary.1

### Minor Changes

- 8e9767e: `activeType` should be initialized from `meta['*']`

### Patch Changes

- 035fe48: - fix empty dropdown menu when \_meta item with `type: "menu"`
  contains items with local pages
- c002118: - add tests for should respect order for `type: "separator"`,
  `type: "menu"` and item with `href`
- Updated dependencies [035fe48]
- Updated dependencies [8e9767e]
- Updated dependencies [c002118]
  - nextra@3.1.0-canary.1

## 3.1.0-canary.0

### Minor Changes

- fec399a: fix `type: 'separator'`, `type: 'menu'` and `item` with `href` not
  respecting order when not all pages specified in `_meta` file

### Patch Changes

- Updated dependencies [fec399a]
  - nextra@3.1.0-canary.0

## 3.0.15

### Patch Changes

- Updated dependencies [bd498c6]
  - nextra@3.0.15

## 3.0.14

### Patch Changes

- 9794e9e: Fix `frontMatter.sidebarTitle` didn't affect without
  `frontMatter.title` set

  now priority for sidebar title is:

  1. `title` property from `_meta` file
  1. `frontMatter.sidebarTitle`
  1. `frontMatter.title`
  1. formatted with [Title](https://title.sh) based on filename

- Updated dependencies [6454938]
- Updated dependencies [9794e9e]
- Updated dependencies [9794e9e]
  - nextra@3.0.14

## 3.0.13

### Patch Changes

- f1815ac: From an accessibility POV (WCAG G13) there's a need of additional
  visual differentiation factor for hovers. Article achieves this but mdx
  doesn't.

  So changing the mdx link behaviour so on hover the underline disappears.

  - nextra@3.0.13

## 3.0.12

### Patch Changes

- 7e0093f: Fix `nextra/locales` middleware, redirect to the docs URL relative to
  the `/<basePath>`.
- Updated dependencies [7e0093f]
  - nextra@3.0.12

## 3.0.11

### Patch Changes

- Updated dependencies [e0a9303]
  - nextra@3.0.11

## 3.0.10

### Patch Changes

- Updated dependencies [31de764]
- Updated dependencies [161d350]
  - nextra@3.0.10

## 3.0.9

### Patch Changes

- Updated dependencies [f9cc160]
  - nextra@3.0.9

## 3.0.8

### Patch Changes

- 72c84eb: add `max-md:_overflow-hidden` instead of `_overflow-hidden` when
  hamburger is clicked
- 1530239: hide `<summary>` marker on Safari
- 210d68a: trigger scrolling when the TOC item is outside the viewport
- bf04f96: add ring-inset for navbar links
  - nextra@3.0.8

## 3.0.7

### Patch Changes

- Updated dependencies [4bbc1fe]
  - nextra@3.0.7

## 3.0.6

### Patch Changes

- 4ed7b4b: remove extra horizontal margin spacing in toc
  - nextra@3.0.6

## 3.0.5

### Patch Changes

- 3aac732: Add `.nextra-search-results` class back
  - nextra@3.0.5

## 3.0.4

### Patch Changes

- 84fc255: should get right `activeType`, `activeThemeContext` even when some
  parent has `display: 'hidden'`
- 9b6595d: Ensure the jump link behavior is consistent in Markdown.
- f3a5575: add a scrollbar for nav links in the header when they exceed
  available free space
- Updated dependencies [84a8a41]
- Updated dependencies [659b36e]
- Updated dependencies [84fc255]
  - nextra@3.0.4

## 3.0.3

### Patch Changes

- 9d93caf: RTL support for the `<Steps>` component.
- 5fbce2f: Added golang logo for code blocks.
- Updated dependencies [82fc267]
- Updated dependencies [edc6c29]
- Updated dependencies [9d93caf]
- Updated dependencies [5fbce2f]
  - nextra@3.0.3

## 3.0.2

### Patch Changes

- 991b69a: handle empty `item.route` in `<FolderImpl` in `<Sidebar>` for
  `item.type: 'menu'`
- Updated dependencies [b6341f7]
  - nextra@3.0.2

## 3.0.1

### Patch Changes

- d9d0820: fix unclickable links on mobile
  - nextra@3.0.1

## 3.0.0

### Major Changes

- e7e8e84: show react components, variable interpolation and latex in toc
- c7f03e5: remove `toc.headingComponent`
- ea1a736: remove `next-seo` and `useNextSeoProps`, use `head` option instead
- c2ad837: update to MDX3
- 148278c: rename tailwind prefix `nx-` to `_` to reduce bundle size
- 919fe97: set `"peerDependencies.next": ">=13"`
- 47b125d: fix global style conflicts for
  `<a>`/`<button>`/`<summary>`/`<input>`/`[tabindex]:not([tabindex='-1']`
- ba30c6c: use render props for className with `selected`, `disabled` and
  `hover` state for `<Tab>`
- d7d8a3e: new styles for code blocks aka in next.js
- 2872606: remove `image` prop from `<Card>` component, image will be showed
  based on truthiness `children` prop now

  set `icon` as optional prop

- 63ca28b: Remove support of "\_meta.json", use "\_meta.{js,jsx,ts,tsx}"
  instead.
- ebe652d: remove `sidebar.titleComponent`, use JSX for styling separators and
  titles
- eca7535: - remove `Steps`, `Callout`, `Tabs`, `Tab`, `Cards`, `Card`,
  `FileTree` exports, export them now from `nextra/components`

  - remove `useMDXComponents` export, export it now from `nextra/mdx`
  - set by default `sidebar.toggleButton` to true

- 128e195: fix React warning, remove PageOpts.toc, use `toc` prop from
  `components.wrapper`
- 63ca28b: remove `config.serverSideError`
- f2dd18d: - rename theme config options

  `i18n.text` → `i18n.name`

  `banner.text` → `banner.content`

  `editLink.text` → `editLink.content`

  `footer.text` → `footer.content`

- 198dbcc: use toc with JSX elements for remote content
- 191e6c4: - use `shikiji` instead of `shiki`

  - rename `useSSG` to `useData`

- 6eb3118: rename `primaryHue` and `primarySaturation` theme options to
  `color.hue` and `color.saturation`
- c7f03e5: rename `pageOpts.headings` to `toc`
- 8c1b9d5: remove `<MatchSorterSearch>`

### Minor Changes

- eb943d0: add `theme.topContent` and `theme.bottomContent`
- 0fe55db: add `import { useRouter } from 'nextra/hooks'` for fetching `locale`
  and `defaultLocale`
- c77485e: set default `head` option as `null`
- 1dcb91a: export `useThemeConfig`
- 6ec3241: Add Terraform/Move icon https://github.com/shuding/nextra/pull/2811
  https://github.com/shuding/nextra/pull/2808
- 5a63701: add icons for following languages:

  - GraphQL (`graphql`)
  - C++ (`c++`, `cpp`)
  - C# (`csharp`, `c#`, `cs`)
  - Python (`python`, `py`)

  allow disallow mobile word wrap button in code blocks with `word-wrap=false`
  meta data setting

- a52a869: add `frontmatter.sidebarTitle` support for setting page label in
  sidebar via frontmatter
- 6ec3241: Make the `<Tab>` component be crawlable and indexable by search
  engines by default
- b47880d: export `useMenu` hook
- b776b16: add `backgroundColor.light` and `backgroundColor.dark` theme options
- 6070b02: rename `frontmatter.sidebar_label` to `frontmatter.sidebarTitle`
- 3043826: add shikiji twoslash

  Demo feature:
  https://nextra-v2-na3obnhub-shuding1.vercel.app/docs/guide/twoslash-support

- 6070b02: move `removeLinks` function from `nextra-theme-docs` to
  `nextra/remove-links`
- 962cea6: allow `items: Map` for `type: 'menu'` since object can't guaranty the
  insertion order
- 440ff42: add MathJax support
- 1a97327: keep `loading`, `placeholder` and `themeSwitch.useOptions` default
  theme options only for `en` lang

### Patch Changes

- b045cc3: fix invisible mobile menu after click on hamburger
- eeb4c4c: enable `outline: 'none'` only for `:focus-visible` state, to fix
  double ring in Firefox
- 376b895: fixes case when setting `disabled: true` on the scroll to top button
  prevents scrolling to most top

  scroll to most top in toc element too

- 34e25cd: migrate search to `@headlessui/react` Combobox
- 73239c4: To ensure consistent horizontal padding, set the default language as
  plaintext for code blocks. This prevents any loss of formatting for code
  blocks without a specified language.
- 57f3963: Remove intersection-observer polyfill
- 2b9b95b: migrate to `@headlessui/react` v2
- 7457d6b: remove `git-url-parse` to keep bundle smaller
- 2a3e3e7: Fix first list item in `<FileTree>` not within permitted parent
  elements
- 6070b02: load `flexsearch` dynamically to reduce bundle size
- 0b4d43b: Avoid the sidebar collapse having unintended animations when
  `sidebar.autoCollapse` is set to `true`.
- 31c2ee7: fix `removeLinks` when input node is link
- bf963cd: Remove the aria-hidden attribute from scroll-to-top button when it is
  visible
- 829c417: - fix overflow when clicking on `<details>` with open state

  - fix animation on mobile when clicking on `<details>` with open state

- cb24790: fix broken `export default` statement in mdx files
- de56507: fix vertical margin for nested ordered `<ol>` and unordered `<ul>`
  lists
- 8c99baf: enhance search input to better support CJK language users
- a8c2196: use dynamic import for loading `mermaid`
- 0b5cc9d: make nextra compatible with windows
- 7b0b7e9: fix page scroll jump while entering characters in the search input
- 45471df: fix "Scroll to top" is not supposed to be interactable when it is
  hidden.

  `display:children` doesn't collapse breadcrumbs

  hide external links from pagination

  remove xmlns attribute from icons

- 8ffe2fe: remove focus-visible polyfill
- fe5061b: fix for remote docs
- 6945f38: fix not rendered default `<meta name="description" />` and
  `<meta property="og:description" />`
- 1a634cd: remove explicit `ZodError` assertion
- ad108ff: use `overflow-x-auto` instead `overflow-x-scroll` for `<Table>`
- 4f0f6b2: Omit `...{:type}` inline code annotations from search index #2922
- 150184b: attach heading anchor `id` attribute to heading (like Pagefind do)
  and fix heading anchor styles when `theme.typesetting: 'article'` is set
- 80c9764: ensure zod is removed from production build with `/* @__PURE__ */`
  comments
- 9df7f58: Fix nav-links not highlighting on hover in dark mode
- 7bb18e3: Add a generic for `themeConfig` in `NextraThemeLayoutProps` to
  improve type inference.
- 9b41180: `backToTop` is hidden when enabled but when `toc.extraContent`,
  `feedback.content` and `editLink.component` are falsy
- 6f4c83a: fix unclickable links in TOC

  allow passing `recmaPlugins` in `mdxOptions`

- f255696: Improve styles for reduced motion preferences
- 9f55bd1: update rehype-pretty-code/shikiji to latest
- d21634d: export `getComponents`
- 452e5bd: Add `<Playground>` component

  https://nextra-v2-9x7fp6hti-shud.vercel.app/docs/guide/advanced/playground

- e95faa1: - fixed `<summary>` lost whitespaces when there is some HTML element
  inside

  - fixed hydration errors and `<summary>` was not rendered when `<details>`
    text content follows directly after `<summary>` element

- ccaf3d4: Add the `autoImportThemeStyle` option to the Nextra configuration.
  This allows users to import the official Nextra theme CSS into a specific
  cascade layer.
- cee94a6: Consider the navbar height when setting the root margin for the
  active anchor intersection observer
- 2630461: fix
  `TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))`
  on dev environment when `frontMatter.searchable: false`
- 217f708: update next-themes

  fix wrong numbering for nested `<Steps>`

- ca51306: Enhance focus ring style consistency.
- f662237: avoid focus-visible style being cut off by overflow-hidden
- 3c6193d: Remove unnecessary `sortPages` from `server/utils.ts`
- 1a97327: Update the `backToTop` option in the docs theme configuration to
  support i18n
- 799174f: fixed react warning
  `Warning: React has detected a change in the order of Hooks called by Body`
  when `themeConfig.main` options is used
- 363b85f: add `flex-shrink: 0` for indent in `FileTree` for `<Ident>` and svg
  icons in `<Folder>` and `<File>`
- 237c345: Make React 18 as minimal requirement
- eb943d0: hardcode flexsearch version to 0.7.31, because package is broken on
  0.7.41
- ad108ff: fix `<Bleed>` overflows incorrectly in firefox
- 4fb2452: fix invisible mobile menu when `layout: "raw"` is specified in \_meta
  file
- 7faa096: fix visible hidden pages on mobile which set up with
  `display: 'hidden'`
- 315ca82: remove possible links in toc elements
- a95e745: Fix the line highlighting background-color does not extend to the
  full width of the code block when a scrollbar appears with line numbers.
- 363b85f: fix `RangeError: Maximum call stack size exceeded` in `findSummary`
  when `child.props.children` is `undefined`
- Updated dependencies [e7e8e84]
- Updated dependencies [7188278]
- Updated dependencies [d1e3e9a]
- Updated dependencies [73239c4]
- Updated dependencies [2b9b95b]
- Updated dependencies [023d37b]
- Updated dependencies [0fe55db]
- Updated dependencies [50a52fd]
- Updated dependencies [c2ad837]
- Updated dependencies [2a3e3e7]
- Updated dependencies [a3b67ae]
- Updated dependencies [1a36469]
- Updated dependencies [799174f]
- Updated dependencies [98f439c]
- Updated dependencies [6ec3241]
- Updated dependencies [148278c]
- Updated dependencies [c7f03e5]
- Updated dependencies [3644e1c]
- Updated dependencies [919fe97]
- Updated dependencies [cb24790]
- Updated dependencies [47b125d]
- Updated dependencies [982862f]
- Updated dependencies [a8c2196]
- Updated dependencies [ba30c6c]
- Updated dependencies [0b5cc9d]
- Updated dependencies [5a63701]
- Updated dependencies [60ec68c]
- Updated dependencies [d7d8a3e]
- Updated dependencies [fe5061b]
- Updated dependencies [2872606]
- Updated dependencies [a52a869]
- Updated dependencies [6ec3241]
- Updated dependencies [1a634cd]
- Updated dependencies [63ca28b]
- Updated dependencies [ad108ff]
- Updated dependencies [ad4823d]
- Updated dependencies [4f0f6b2]
- Updated dependencies [1f3e7cd]
- Updated dependencies [ab07609]
- Updated dependencies [2f3be33]
- Updated dependencies [90c129e]
- Updated dependencies [f71e660]
- Updated dependencies [150184b]
- Updated dependencies [66cce1d]
- Updated dependencies [c74ae90]
- Updated dependencies [7615b62]
- Updated dependencies [6070b02]
- Updated dependencies [7bb18e3]
- Updated dependencies [b9f88e3]
- Updated dependencies [8efbb45]
- Updated dependencies [6f4c83a]
- Updated dependencies [d8a406b]
- Updated dependencies [9f55bd1]
- Updated dependencies [4e55c06]
- Updated dependencies [128e195]
- Updated dependencies [8bce16d]
- Updated dependencies [ccaf3d4]
- Updated dependencies [3043826]
- Updated dependencies [2630461]
- Updated dependencies [576cb6f]
- Updated dependencies [217f708]
- Updated dependencies [57bc0e2]
- Updated dependencies [ca51306]
- Updated dependencies [f662237]
- Updated dependencies [3c6193d]
- Updated dependencies [1f3e7cd]
- Updated dependencies [198dbcc]
- Updated dependencies [363b85f]
- Updated dependencies [fef635e]
- Updated dependencies [6070b02]
- Updated dependencies [237c345]
- Updated dependencies [191e6c4]
- Updated dependencies [440ff42]
- Updated dependencies [7faa096]
- Updated dependencies [9099c35]
- Updated dependencies [98f439c]
- Updated dependencies [a95e745]
- Updated dependencies [80e11e0]
- Updated dependencies [c7f03e5]
  - nextra@3.0.0

## 3.0.0-alpha.42

### Minor Changes

- 1a97327: keep `loading`, `placeholder` and `themeSwitch.useOptions` default
  theme options only for `en` lang

### Patch Changes

- ca51306: Enhance focus ring style consistency.
- 1a97327: Update the `backToTop` option in the docs theme configuration to
  support i18n
- Updated dependencies [ca51306]
  - nextra@3.0.0-alpha.42

## 3.0.0-alpha.41

### Patch Changes

- 237c345: Make React 18 as minimal requirement
- Updated dependencies [237c345]
  - nextra@3.0.0-alpha.41

## 3.0.0-alpha.40

### Patch Changes

- bf963cd: Remove the aria-hidden attribute from scroll-to-top button when it is
  visible
- cee94a6: Consider the navbar height when setting the root margin for the
  active anchor intersection observer
- Updated dependencies [982862f]
  - nextra@3.0.0-alpha.40

## 3.0.0-alpha.39

### Major Changes

- 47b125d: fix global style conflicts for
  `<a>`/`<button>`/`<summary>`/`<input>`/`[tabindex]:not([tabindex='-1']`
- ba30c6c: use render props for className with `selected`, `disabled` and
  `hover` state for `<Tab>`
- 2872606: remove `image` prop from `<Card>` component, image will be showed
  based on truthiness `children` prop now

  set `icon` as optional prop

### Patch Changes

- f255696: Improve styles for reduced motion preferences
- Updated dependencies [47b125d]
- Updated dependencies [ba30c6c]
- Updated dependencies [2872606]
  - nextra@3.0.0-alpha.39

## 3.0.0-alpha.38

### Patch Changes

- ccaf3d4: Add the `autoImportThemeStyle` option to the Nextra configuration.
  This allows users to import the official Nextra theme CSS into a specific
  cascade layer.
- Updated dependencies [ccaf3d4]
  - nextra@3.0.0-alpha.38

## 3.0.0-alpha.37

### Patch Changes

- 2a3e3e7: Fix first list item in `<FileTree>` not within permitted parent
  elements
- 829c417: - fix overflow when clicking on `<details>` with open state

  - fix animation on mobile when clicking on `<details>` with open state

- Updated dependencies [2a3e3e7]
  - nextra@3.0.0-alpha.37

## 3.0.0-alpha.36

### Patch Changes

- 34e25cd: migrate search to `@headlessui/react` Combobox
- 57f3963: Remove intersection-observer polyfill
- 2b9b95b: migrate to `@headlessui/react` v2
- Updated dependencies [2b9b95b]
  - nextra@3.0.0-alpha.36

## 3.0.0-alpha.35

### Patch Changes

- 0b4d43b: Avoid the sidebar collapse having unintended animations when
  `sidebar.autoCollapse` is set to `true`.
- 452e5bd: Add `<Playground />` component

  https://nextra-v2-9x7fp6hti-shud.vercel.app/docs/guide/advanced/playground

- f662237: avoid focus-visible style being cut off by overflow-hidden
- Updated dependencies [f662237]
  - nextra@3.0.0-alpha.35

## 3.0.0-alpha.34

### Patch Changes

- 8c99baf: enhance search input to better support CJK language users
- 8ffe2fe: remove focus-visible polyfill
- 1a634cd: remove explicit `ZodError` assertion
- Updated dependencies [1a634cd]
  - nextra@3.0.0-alpha.34

## 3.0.0-alpha.33

### Patch Changes

- 6945f38: fix not rendered default `<meta name="description" />` and
  `<meta property="og:description" />`
- 7bb18e3: Add a generic for `themeConfig` in `NextraThemeLayoutProps` to
  improve type inference.
- Updated dependencies [7bb18e3]
  - nextra@3.0.0-alpha.33

## 3.0.0-alpha.32

### Patch Changes

- 73239c4: To ensure consistent horizontal padding, set the default language as
  plaintext for code blocks. This prevents any loss of formatting for code
  blocks without a specified language.
- 150184b: attach heading anchor `id` attribute to heading (like Pagefind do)
  and fix heading anchor styles when `theme.typesetting: 'article'` is set
- 9df7f58: Fix nav-links not highlighting on hover in dark mode
- 3c6193d: Remove unnecessary `sortPages` from `server/utils.ts`
- 799174f: fixed react warning
  `Warning: React has detected a change in the order of Hooks called by Body`
  when `themeConfig.main` options is used
- Updated dependencies [73239c4]
- Updated dependencies [799174f]
- Updated dependencies [150184b]
- Updated dependencies [3c6193d]
  - nextra@3.0.0-alpha.32

## 3.0.0-alpha.31

### Patch Changes

- Updated dependencies [d1e3e9a]
  - nextra@3.0.0-alpha.31

## 3.0.0-alpha.30

### Patch Changes

- Updated dependencies [7615b62]
  - nextra@3.0.0-alpha.30

## 3.0.0-alpha.29

### Patch Changes

- Updated dependencies [fef635e]
  - nextra@3.0.0-alpha.29

## 3.0.0-alpha.28

### Patch Changes

- a8c2196: use dynamic import for loading `mermaid`
- 363b85f: add `flex-shrink: 0` for indent in `FileTree` for `<Ident />` and svg
  icons in `<Folder />` and `<File />`
- 363b85f: fix `RangeError: Maximum call stack size exceeded` in `findSummary`
  when `child.props.children` is `undefined`
- Updated dependencies [a8c2196]
- Updated dependencies [363b85f]
  - nextra@3.0.0-alpha.28

## 3.0.0-alpha.27

### Patch Changes

- 4f0f6b27: Omit `...{:type}` inline code annotations from search index #2922
- e95faa16: - fixed `<summary />` lost whitespaces when there is some HTML
  element inside

  - fixed hydration errors and `<summary />` was not rendered when `<details />`
    text content follows directly after `<summary />` element

- a95e7454: Fix the line highlighting background-color does not extend to the
  full width of the code block when a scrollbar appears with line numbers.
- Updated dependencies [4f0f6b27]
- Updated dependencies [a95e7454]
  - nextra@3.0.0-alpha.27

## 3.0.0-alpha.26

### Patch Changes

- 376b8954: fixes case when setting `disabled: true` on the scroll to top button
  prevents scrolling to most top

  scroll to most top in toc element too

- 7b0b7e98: fix page scroll jump while entering characters in the search input
  - nextra@3.0.0-alpha.26

## 3.0.0-alpha.25

### Patch Changes

- de565078: fix vertical margin for nested ordered `<ol />` and unordered
  `<ul />` lists
  - nextra@3.0.0-alpha.25

## 3.0.0-alpha.24

### Patch Changes

- 6f4c83a8: fix unclickable links in TOC

  allow passing `recmaPlugins` in `mdxOptions`

- Updated dependencies [6f4c83a8]
  - nextra@3.0.0-alpha.24

## 3.0.0-alpha.23

### Minor Changes

- 6ec3241c: Add Terraform/Move icon https://github.com/shuding/nextra/pull/2811
  https://github.com/shuding/nextra/pull/2808
- 6ec3241c: Make the `<Tab />` component be crawlable and indexable by search
  engines by default
- b47880d5: export `useMenu` hook

### Patch Changes

- ad108ff7: use `overflow-x-auto` instead `overflow-x-scroll` for `<Table />`
- 217f7082: update next-themes

  fix wrong numbering for nested `<Steps />`

- ad108ff7: fix `<Bleed />` overflows incorrectly in firefox
- Updated dependencies [6ec3241c]
- Updated dependencies [6ec3241c]
- Updated dependencies [ad108ff7]
- Updated dependencies [217f7082]
  - nextra@3.0.0-alpha.23

## 3.0.0-alpha.22

### Patch Changes

- eeb4c4cd: enable `outline: 'none'` only for `:focus-visible` state, to fix
  double ring in Firefox
- 9b411804: `backToTop` is hidden when enabled but when `toc.extraContent`,
  `feedback.content` and `editLink.component` are falsy
- 2630461c: fix
  `TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))`
  on dev environment when `frontMatter.searchable: false`
- Updated dependencies [2630461c]
  - nextra@3.0.0-alpha.22

## 3.0.0-alpha.21

### Minor Changes

- 962cea6b: allow `items: Map` for `type: 'menu'` since object can't guaranty
  the insertion order

### Patch Changes

- nextra@3.0.0-alpha.21

## 3.0.0-alpha.20

### Minor Changes

- b776b162: add `backgroundColor.light` and `backgroundColor.dark` theme options

### Patch Changes

- nextra@3.0.0-alpha.20

## 3.0.0-alpha.19

### Patch Changes

- d21634d5: export `getComponents`
  - nextra@3.0.0-alpha.19

## 3.0.0-alpha.18

### Patch Changes

- Updated dependencies [98f439ca]
- Updated dependencies [f71e660e]
- Updated dependencies [98f439ca]
  - nextra@3.0.0-alpha.18

## 3.0.0-alpha.17

### Minor Changes

- 30438264: add shikiji twoslash

  Demo feature:
  https://nextra-v2-na3obnhub-shuding1.vercel.app/docs/guide/twoslash-support

### Patch Changes

- 9f55bd1f: update rehype-pretty-code/shikiji to latest
- Updated dependencies [9f55bd1f]
- Updated dependencies [30438264]
  - nextra@3.0.0-alpha.17

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

- Updated dependencies [5a637010]
- Updated dependencies [90c129e6]
  - nextra@3.0.0-alpha.16

## 3.0.0-alpha.15

### Patch Changes

- Updated dependencies [1a364694]
  - nextra@3.0.0-alpha.15

## 3.0.0-alpha.14

### Patch Changes

- 45471df5: fix "Scroll to top" is not supposed to be interactable when it is
  hidden.

  `display:children` doesn't collapse breadcrumbs

  hide external links from pagination

  remove xmlns attribute from icons

  - nextra@3.0.0-alpha.14

## 3.0.0-alpha.13

### Minor Changes

- 6070b025: rename `frontmatter.sidebar_label` to `frontmatter.sidebarTitle`
- 6070b025: move `removeLinks` function from `nextra-theme-docs` to
  `nextra/remove-links`

### Patch Changes

- 6070b025: load `flexsearch` dynamically to reduce bundle size
- Updated dependencies [60ec68c4]
- Updated dependencies [c74ae90a]
- Updated dependencies [6070b025]
- Updated dependencies [8bce16d3]
- Updated dependencies [6070b025]
  - nextra@3.0.0-alpha.13

## 3.0.0-alpha.12

### Patch Changes

- Updated dependencies [3644e1c2]
- Updated dependencies [57bc0e2a]
  - nextra@3.0.0-alpha.12

## 3.0.0-alpha.11

### Major Changes

- c2ad837d: update to MDX3

### Minor Changes

- eb943d00: add `theme.topContent` and `theme.bottomContent`

### Patch Changes

- eb943d00: hardcode flexsearch version to 0.7.31, because package is broken on
  0.7.41
- Updated dependencies [c2ad837d]
  - nextra@3.0.0-alpha.11

## 3.0.0-alpha.10

### Patch Changes

- Updated dependencies [9099c354]
  - nextra@3.0.0-alpha.10

## 3.0.0-alpha.9

### Patch Changes

- Updated dependencies [8efbb45c]
- Updated dependencies [80e11e04]
  - nextra@3.0.0-alpha.9

## 3.0.0-alpha.8

### Minor Changes

- 440ff42d: add MathJax support

### Patch Changes

- Updated dependencies [440ff42d]
  - nextra@3.0.0-alpha.8

## 3.0.0-alpha.7

### Patch Changes

- 0b5cc9d5: make nextra compatible with windows
- Updated dependencies [0b5cc9d5]
  - nextra@3.0.0-alpha.7

## 3.0.0-alpha.6

### Patch Changes

- 31c2ee70: fix `removeLinks` when input node is link
- 03da778a: fix `*` theme settings for dynamic routes when route is not exist in
  page map
- Updated dependencies [03da778a]
  - nextra@3.0.0-alpha.6

## 3.0.0-alpha.5

### Patch Changes

- 315ca826: remove possible links in toc elements
- Updated dependencies [a3b67aea]
  - nextra@3.0.0-alpha.5

## 3.0.0-alpha.4

### Minor Changes

- 1dcb91a0: export `useThemeConfig`

### Patch Changes

- 4fb24524: fix invisible mobile menu when `layout: "raw"` is specified in
  \_meta file
- 7faa0968: fix visible hidden pages on mobile which set up with
  `display: 'hidden'`
- Updated dependencies [7faa0968]
  - nextra@3.0.0-alpha.4

## 3.0.0-alpha.3

### Patch Changes

- fe5061b7: fix for remote docs
- Updated dependencies [fe5061b7]
  - nextra@3.0.0-alpha.3

## 3.0.0-alpha.2

### Patch Changes

- b045cc3e: fix invisible mobile menu after click on hamburger
- cb247901: fix broken `export default` statement in mdx files
- Updated dependencies [cb247901]
  - nextra@3.0.0-alpha.2

## 3.0.0-alpha.1

### Major Changes

- e7e8e849: show react components, variable interpolation and latex in toc
- c7f03e54: remove `toc.headingComponent`
- ea1a7362: remove `next-seo` and `useNextSeoProps`, use `head` option instead
- 148278ce: rename tailwind prefix `nx-` to `_` to reduce bundle size
- d7d8a3eb: new styles for code blocks aka in next.js
- 63ca28be: Remove support of "\_meta.json", use "\_meta.{js,jsx,ts,tsx}"
  instead.
- ebe652db: remove `sidebar.titleComponent`, use JSX for styling separators and
  titles
- 128e195f: fix React warning, remove PageOpts.toc, use `toc` prop from
  `components.wrapper`
- 63ca28be: remove `config.serverSideError`
- 198dbcca: use toc with JSX elements for remote content
- 191e6c41: - use `shikiji` instead of `shiki`

  - rename `useSSG` to `useData`

- 6eb3118f: rename `primaryHue` and `primarySaturation` theme options to
  `color.hue` and `color.saturation`
- c7f03e54: rename `pageOpts.headings` to `toc`

### Minor Changes

- c77485ec: set default `head` option as `null`
- a52a869e: add `frontmatter.sidebar_label` support for setting page label in
  sidebar via frontmatter

### Patch Changes

- 7457d6b6: remove `git-url-parse` to keep bundle smaller
- Updated dependencies [e7e8e849]
- Updated dependencies [71882780]
- Updated dependencies [023d37b1]
- Updated dependencies [148278ce]
- Updated dependencies [c7f03e54]
- Updated dependencies [d7d8a3eb]
- Updated dependencies [a52a869e]
- Updated dependencies [63ca28be]
- Updated dependencies [1f3e7cd4]
- Updated dependencies [b9f88e34]
- Updated dependencies [4e55c064]
- Updated dependencies [128e195f]
- Updated dependencies [1f3e7cd4]
- Updated dependencies [198dbcca]
- Updated dependencies [191e6c41]
- Updated dependencies [c7f03e54]
  - nextra@3.0.0-alpha.1

## 3.0.0-alpha.0

### Major Changes

- 919fe977: set `"peerDependencies.next": ">=13"`
- eca75354: - remove `Steps`, `Callout`, `Tabs`, `Tab`, `Cards`, `Card`,
  `FileTree` exports, export them now from `nextra/components`

  - remove `useMDXComponents` export, export it now from `nextra/mdx`
  - set by default `sidebar.toggleButton` to true

- f2dd18d2: - rename theme config options

  `i18n.text` → `i18n.name`

  `banner.text` → `banner.content`

  `editLink.text` → `editLink.content`

  `footer.text` → `footer.content`

- 8c1b9d53: remove `<MatchSorterSearch />`

### Minor Changes

- 0fe55db2: add `import { useRouter } from 'nextra/hooks'` for fetching `locale`
  and `defaultLocale`

### Patch Changes

- 80c9764b: ensure zod is removed from production build with `/* @__PURE__ */`
  comments
- Updated dependencies [0fe55db2]
- Updated dependencies [50a52fd1]
- Updated dependencies [919fe977]
- Updated dependencies [ad4823d9]
- Updated dependencies [ab07609c]
- Updated dependencies [2f3be336]
- Updated dependencies [66cce1d1]
- Updated dependencies [d8a406b4]
- Updated dependencies [576cb6f1]
  - nextra@3.0.0-alpha.0

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
