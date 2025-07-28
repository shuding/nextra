# nextra-theme-blog

## 4.3.0

### Minor Changes

- eed8328: feat: adapt colors and icons from original GitHub alerts syntax

  feat: new Callout type `important`

  fix: inconsistent built-in Callout's icons size

  feat: improve Callout's accessibility colors

- 0831a1b: Add an `onSearch` callback to the `<Search />` component. This
  callback, when specified, is called upon every search input change.
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

### Patch Changes

- 71f7b3f: Update https://nextra.site/docs/guide/search page

  Fixes extra margin-top inside `Tabs.Tab`

  Fix breaking `<Steps>` component numeration when there is `<Tabs>` component
  inside

- 47ba5f3: fix: use `em` for padding-y, padding-x and border-radius styles of
  `<Code>` element

  fix(TSDoc): for return signature without `name` return mobile card instead of
  table

  feat: use `em` instead `rem` for margins

- 40267dc: split `TSDoc` component logic to `TSDoc` component and
  `generateDocumentation` function

  update https://nextra.site/docs/built-ins/tsdoc documentation

- 8ac2506: chore: bump `babel-plugin-react-compiler` and
  `react-compiler-runtime`, remove custom pnpm patch for
  `babel-plugin-react-compiler`
- b2cba90: improve TSDoc comments for `getPageMap`, `generateStaticParamsFor`
  and `importPage` functions. Add new https://nextra.site/docs/guide/api page.
- d29469e: support Next.js 15.3.0
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

- b5fab80: add `MDXRemote` component docs page
  https://nextra.site/docs/built-ins/mdxremote

### Patch Changes

- Updated dependencies [c93fc48]
- Updated dependencies [b5fab80]
  - nextra@4.3.0-alpha.22

## 4.3.0-alpha.21

### Patch Changes

- Updated dependencies [6a82e6f]
  - nextra@4.3.0-alpha.21

## 4.3.0-alpha.20

### Patch Changes

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

- nextra@4.3.0-alpha.17

## 4.3.0-alpha.16

### Patch Changes

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

- 5617e04: fix: loading state in search results was only visible during the
  first search
- Updated dependencies [5617e04]
  - nextra@4.2.15

## 4.2.14

### Patch Changes

- ccb5da2: removing custom nextra's scrollbar styles, allowing the browser's
  default scrollbars to be used
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

- nextra@4.2.12

## 4.2.11

### Patch Changes

- nextra@4.2.11

## 4.2.10

### Patch Changes

- Updated dependencies [5c22495]
  - nextra@4.2.10

## 4.2.9

### Patch Changes

- nextra@4.2.9

## 4.2.8

### Patch Changes

- nextra@4.2.8

## 4.2.7

### Patch Changes

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

- nextra@4.2.1

## 4.2.0

### Patch Changes

- 427b080: calculate `--nextra-banner-height` after mounting banner, so banner
  text can be wrapped on multiple lines
- 6b8053f: fix a sudden height jump on opening for `<detail>` element when his
  last children contain margins
- b0e686e: hide default `<summary>` arrow on mobile
- Updated dependencies [427b080]
- Updated dependencies [6b8053f]
- Updated dependencies [b0e686e]
  - nextra@4.2.0

## 4.1.1

### Patch Changes

- 29a44de: fix regression from Nextra 3 setting
  [`theme.collapsed?: boolean` in `_meta` file](https://nextra.site/docs/file-conventions/meta-file#theme-option)
  for folders has no effect in sidebar
- Updated dependencies [29a44de]
- Updated dependencies [19578c3]
  - nextra@4.1.1

## 4.1.0

### Minor Changes

- 7caf059: - generate unique anchor id for `<summary>` elements based on its
  content at build time
  - add anchor link icon for `<summary>`

### Patch Changes

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

- nextra@4.0.3

## 4.0.2

### Patch Changes

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
- 283320f: remove `BlogMetadata.draft`, support \_meta files for
  `nextra-theme-blog`
- 283320f: remove `export const title` from generated mdx pages
- 283320f: The initial version which supports App Router instead of Pages
  Router, something may be broken, check
  https://github.com/shuding/nextra/tree/v4-v2/examples for the migration guide
- 283320f: migrate search from Flexsearch to Pagefind
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
- 283320f: remove `nextra-theme-blog/cusdis` export, export `<Comments>`
  component from `nextra-theme-blog` directly (because `peerDependency` of
  `react-cusdis` was removed)
- 283320f: require Next.js minimum v14
- 283320f: - add `nextra/components` to `experimental.optimizePackageImports` to
  optimize `nextra/components` by default
  - remove `<RemoteContent>` from `nextra/components`
  - rename `<RemoteContent>` to `MDXRemote` and move to `nextra/mdx-remote`

### Minor Changes

- 283320f: add `nextThemes` prop in `<Layout>` component
- 283320f: - use ReactIcon for code blocks with `jsx`, `tsx` language
  - add JsonIcon for `json` language
  - parse language from filename if exist when `diff` language is specified
  - use JavaScript icon for `cjs` and `mjs`
  - use TypeScript icon for `cts` and `mts`
- 283320f: use `next-view-transitions` for transition in `nextra-theme-blog`
- 283320f: replace `useContentDir` with `contentDirBasePath` option which
  configure `content` directory under a catch-all subdirectory
- 283320f: move TOC logic from `recma-rewrite-jsx` plugin to
  `rehype-extract-toc-content` plugin
- 283320f: make `page.{jsx,tsx,mdx}` pages and `_meta` files from `app` dir, and
  also `content` folder files - all add to `pageMap`, but ignore dynamic pages
  `[[`
- e11dbe0: set `content` value for `<meta name="theme-color">` based on
  background value for light and dark themes

### Patch Changes

- 283320f: search tweaks
- fdd2c6a: fix steps background on dark mode fix headings anchor link color on
  dark mode
- 283320f: setup `@typescript-eslint/no-unnecessary-condition` rule and fix
  warnings
- aca79fa: Don't focus search input on `Ctrl + k` on non Mac devices. Don't
  focus search input on `⌘ + Shift + k` or `Ctrl + Shift + k`.
- 283320f: add helpful error message about not available search on development
  mode
- 283320f: remove `react-cusdis` dependency, use
  https://cusdis.com/doc#/advanced/sdk directly
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
- 283320f: use `Date.now()` for last edit time on development and git last
  commit time on production
- 283320f: move `pagefind` output to `public/_pagefind` directory
  https://github.com/shuding/nextra/pull/3517
- 283320f: initialize `transformerTwoslash` only 1 time outside of loader
- 283320f: fix edit on github and last updated at for catch all routes
- 283320f: simplify `generatePageMap`
- 283320f: add `banner` prop for `<Layout>` component
- 283320f: sync with nextra 3.1.0
- 283320f: Cache the result of `repository.getFileLatestModifiedDateAsync`
  because it can slow down Fast Refresh for uncommitted files.
- 283320f: reduce bundle size of bundled website by compiling svg icons in
  separated files
- 283320f: enable page reload of catch-all routes `app/[[...slug]].jsx` on
  content change
- 283320f: remove false positive warnings on projects without `content/`
  directory

  ```
  ⚠ Compiled with warnings

  ../packages/nextra/dist/client/pages.js
  Module not found: Can't resolve 'private-next-root-dir/content' in '/Users/dmytro/Desktop/nextra/packages/nextra/dist/client'
  ```

- 283320f: - sync with nextra 3.0.15

  - bump to Next 15
  - remove importing of `style.css` in themes, you need to import now manually
    by

  ```js
  import 'nextra-theme-docs/style.css' // for docs theme
  import 'nextra-theme-blog/style.css' // for blog theme
  ```

- 283320f: add support for turbopack `next dev --turbopack`
- 283320f: fix `colorSchema` for HEX format with 4 chars, e.g. `#111`
- 283320f: fix external svg icon was added for span in `<Anchor>`
- 283320f: make nextThemes optional prop, to avoid ts errors
- 283320f: sync with nextra 3.0.10
- 283320f: defer pagefind results update for prioritizing the user input state
- 283320f: make Nextra works with `src/app` and `src/content` directories
- 283320f: - fix missing tailwind class for `json` icon in code blocks
  - capitalize folders in sidebar even without index pages
  - sync with nextra 3.2.4
- 283320f: add ↗ char for external links
- 283320f: sync with nextra 3.0.3
- 283320f: fix injecting mdx-components into headings and injecting into toc
- 283320f: - add `disabled` prop for `<Folder>` component when `open` prop was
  set (to disable click event and remove `cursor: pointer`)
  - allow `<h5>` and `<h6>` tags be used with `<Steps>`
  - fix Webpack module rebuild for pageMap when new files where added or removed
    in `app` dir or `content` dir
- 283320f: Use `primaryColor` for `::selection` styles
- 283320f: replace `nextraConfig.mdxBaseDir: string` by `useContentDir: boolean`
- 283320f: support `GitHub Alert Syntax`
- 283320f: fix search, didn't work with Next.js' `basePath` set
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

- 50c2f76: fix `colorSchema` for HEX format with 4 chars, e.g. `#111`
- 50c2f76: make nextThemes optional prop, to avoid ts errors
- Updated dependencies [50c2f76]
- Updated dependencies [50c2f76]
  - nextra@4.0.0-app-router.43

## 4.0.0-app-router.42

### Patch Changes

- 242e0d0: search tweaks
- 3fc12a0: - Use Tailwind CSS CLI because CSS processing by `tsup` produce
  different, weird and broken result
  - Patch react-compiler with some fixes which isn't fixed
- Updated dependencies [242e0d0]
- Updated dependencies [3fc12a0]
  - nextra@4.0.0-app-router.42

## 4.0.0-app-router.41

### Patch Changes

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

### Patch Changes

- Updated dependencies [96fb083]
  - nextra@4.0.0-app-router.35

## 4.0.0-app-router.34

### Patch Changes

- nextra@4.0.0-app-router.34

## 4.0.0-app-router.33

### Patch Changes

- Updated dependencies [dd2e216]
  - nextra@4.0.0-app-router.33

## 4.0.0-app-router.32

### Patch Changes

- fbeef15: setup `@typescript-eslint/no-unnecessary-condition` rule and fix
  warnings
- Updated dependencies [fbeef15]
  - nextra@4.0.0-app-router.32

## 4.0.0-app-router.31

### Patch Changes

- Updated dependencies [386b620]
  - nextra@4.0.0-app-router.31

## 4.0.0-app-router.30

### Major Changes

- 39bacdc: remove `BlogMetadata.draft`, support \_meta files for
  `nextra-theme-blog`

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
- Updated dependencies [e46dbdf]
  - nextra@4.0.0-app-router.24

## 4.0.0-app-router.23

### Patch Changes

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

### Patch Changes

- 7cc8ca1: simplify `generatePageMap`
- 16816f2: remove false positive warnings on projects without `content/`
  directory

  ```
  ⚠ Compiled with warnings

  ../packages/nextra/dist/client/pages.js
  Module not found: Can't resolve 'private-next-root-dir/content' in '/Users/dmytro/Desktop/nextra/packages/nextra/dist/client'
  ```

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

- Updated dependencies [33568c1]
  - nextra@4.0.0-app-router.17

## 4.0.0-app-router.16

### Major Changes

- 5385fd4: remove `nextra-theme-blog/cusdis` export, export `<Comments>`
  component from `nextra-theme-blog` directly (because `peerDependency` of
  `react-cusdis` was removed)

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

### Patch Changes

- nextra@4.0.0-app-router.15

## 4.0.0-app-router.14

### Major Changes

- be19dd4: remove `"typesVersions"` field from `package.json`. You need to set
  `"moduleResolution": "bundler"` in your `tsconfig.json` if you are using
  TypeScript

### Patch Changes

- Updated dependencies [be19dd4]
  - nextra@4.0.0-app-router.14

## 4.0.0-app-router.13

### Major Changes

- 54657e2: require Next.js minimum v15

### Patch Changes

- 07213e2: add `banner` prop for `<Layout>` component
- 07213e2: add support for turbopack `next dev --turbopack`
- Updated dependencies [3ade013]
- Updated dependencies [ddc39cc]
- Updated dependencies [07213e2]
- Updated dependencies [54657e2]
  - nextra@4.0.0-app-router.13

## 4.0.0-app-router.12

### Patch Changes

- b8defc9: sync with nextra 3.1.0
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

- 875842b: remove `react-cusdis` dependency, use
  https://cusdis.com/doc#/advanced/sdk directly
- 9832af9: add ↗ char for external links
- ec39959: Use `primaryColor` for `::selection` styles
- 875842b: support `GitHub Alert Syntax`
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

### Patch Changes

- nextra@4.0.0-app-router.4

## 4.0.0-app-router.3

### Major Changes

- 1e77fab: move `<Collapse>`, `<Details>`, `<Summary>`, `<SkipNavContent>`,
  `SkipNavLink`, `<Select>` and `<Bleed>` from `nextra-theme-docs` to
  `nextra/components`

### Minor Changes

- 1e77fab: use `next-view-transitions` for transition in `nextra-theme-blog`

### Patch Changes

- 1e77fab: fix edit on github and last updated at for catch all routes
- Updated dependencies [1e77fab]
- Updated dependencies [1e77fab]
- Updated dependencies [1e77fab]
- Updated dependencies [1e77fab]
  - nextra@4.0.0-app-router.3

## 4.0.0-app-router.2

### Major Changes

- 8ef0f58: move `<Head>` component in `nextra/components`

### Minor Changes

- 8ef0f58: add `nextThemes` prop in `<Layout>` component

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

- Updated dependencies [45cccd4]
  - nextra@3.2.2

## 3.2.1

### Patch Changes

- nextra@3.2.1

## 3.2.0

### Patch Changes

- nextra@3.2.0

## 3.1.3

### Patch Changes

- 6e64b16: fix
  `Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in /path/to/project/node_modules/nextra/package.json`
  when using `next.config.ts`
- d44c4bc: requires to have a custom App component (`pages/_app.jsx`)
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

### Patch Changes

- Updated dependencies [035fe48]
- Updated dependencies [8e9767e]
- Updated dependencies [fec399a]
- Updated dependencies [c002118]
  - nextra@3.1.0

## 3.1.0-canary.1

### Patch Changes

- Updated dependencies [035fe48]
- Updated dependencies [8e9767e]
- Updated dependencies [c002118]
  - nextra@3.1.0-canary.1

## 3.1.0-canary.0

### Patch Changes

- Updated dependencies [fec399a]
  - nextra@3.1.0-canary.0

## 3.0.15

### Patch Changes

- Updated dependencies [bd498c6]
  - nextra@3.0.15

## 3.0.14

### Patch Changes

- Updated dependencies [6454938]
- Updated dependencies [9794e9e]
- Updated dependencies [9794e9e]
  - nextra@3.0.14

## 3.0.13

### Patch Changes

- nextra@3.0.13

## 3.0.12

### Patch Changes

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

- nextra@3.0.8

## 3.0.7

### Patch Changes

- Updated dependencies [4bbc1fe]
  - nextra@3.0.7

## 3.0.6

### Patch Changes

- nextra@3.0.6

## 3.0.5

### Patch Changes

- nextra@3.0.5

## 3.0.4

### Patch Changes

- 9b6595d: Ensure the jump link behavior is consistent in Markdown.
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

- Updated dependencies [b6341f7]
  - nextra@3.0.2

## 3.0.1

### Patch Changes

- nextra@3.0.1

## 3.0.0

### Major Changes

- c2ad837: update to MDX3
- 16ab7f7: - remove `legacyBehavior` from `NextLink`

  - remove `config.cusdis`. Instead, now you need to pass cusdis options as
    props in `Cusdis` component

- 148278c: rename tailwind prefix `nx-` to `_` to reduce bundle size
- 919fe97: set `"peerDependencies.next": ">=13"`
- ba30c6c: use render props for className with `selected`, `disabled` and
  `hover` state for `<Tab>`
- d7d8a3e: new styles for code blocks aka in next.js
- 2872606: remove `image` prop from `<Card>` component, image will be showed
  based on truthiness `children` prop now

  set `icon` as optional prop

- 128e195: fix React warning, remove PageOpts.toc, use `toc` prop from
  `components.wrapper`
- 191e6c4: - use `shikiji` instead of `shiki`

  - rename `useSSG` to `useData`

- c7f03e5: rename `pageOpts.headings` to `toc`

### Minor Changes

- 6ec3241: Add Terraform/Move icon https://github.com/shuding/nextra/pull/2811
  https://github.com/shuding/nextra/pull/2808
- 5a63701: add icons for following languages:

  - GraphQL (`graphql`)
  - C++ (`c++`, `cpp`)
  - C# (`csharp`, `c#`, `cs`)
  - Python (`python`, `py`)

  allow disallow mobile word wrap button in code blocks with `word-wrap=false`
  meta data setting

- 6ec3241: Make the `<Tab>` component be crawlable and indexable by search
  engines by default
- 3043826: add shikiji twoslash

  Demo feature:
  https://nextra-v2-na3obnhub-shuding1.vercel.app/docs/guide/twoslash-support

- 440ff42: add MathJax support

### Patch Changes

- 73239c4: To ensure consistent horizontal padding, set the default language as
  plaintext for code blocks. This prevents any loss of formatting for code
  blocks without a specified language.
- 2a3e3e7: Fix first list item in `<FileTree>` not within permitted parent
  elements
- cb24790: fix broken `export default` statement in mdx files
- 7e57ddb: Avoid skipping the heading level in the posts layout, removes
  `.post-item` and `.post-item-more` classes
- a8c2196: use dynamic import for loading `mermaid`
- 0b5cc9d: make nextra compatible with windows
- 1a634cd: remove explicit `ZodError` assertion
- ad108ff: use `overflow-x-auto` instead `overflow-x-scroll` for `<Table>`
- 4f0f6b2: Omit `...{:type}` inline code annotations from search index #2922
- 150184b: attach heading anchor `id` attribute to heading (like Pagefind do)
  and fix heading anchor styles when `theme.typesetting: 'article'` is set
- 7bb18e3: Add a generic for `themeConfig` in `NextraThemeLayoutProps` to
  improve type inference.
- 9f55bd1: update rehype-pretty-code/shikiji to latest
- a90b90f: Switch to the dark theme provided by `@tailwindcss/typography` in
  theme-blog.
- 49a9627: fix theme-blog heading styles in post layout
- 3c6193d: Remove unnecessary `sortPages` from `server/utils.ts`
- 363b85f: add `flex-shrink: 0` for indent in `FileTree` for `<Ident>` and svg
  icons in `<Folder>` and `<File>`
- 237c345: Make React 18 as minimal requirement
- a95e745: Fix the line highlighting background-color does not extend to the
  full width of the code block when a scrollbar appears with line numbers.
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

### Patch Changes

- Updated dependencies [ca51306]
  - nextra@3.0.0-alpha.42

## 3.0.0-alpha.41

### Patch Changes

- 237c345: Make React 18 as minimal requirement
- Updated dependencies [237c345]
  - nextra@3.0.0-alpha.41

## 3.0.0-alpha.40

### Patch Changes

- Updated dependencies [982862f]
  - nextra@3.0.0-alpha.40

## 3.0.0-alpha.39

### Major Changes

- ba30c6c: use render props for className with `selected`, `disabled` and
  `hover` state for `<Tab>`
- 2872606: remove `image` prop from `<Card>` component, image will be showed
  based on truthiness `children` prop now

  set `icon` as optional prop

### Patch Changes

- Updated dependencies [47b125d]
- Updated dependencies [ba30c6c]
- Updated dependencies [2872606]
  - nextra@3.0.0-alpha.39

## 3.0.0-alpha.38

### Patch Changes

- Updated dependencies [ccaf3d4]
  - nextra@3.0.0-alpha.38

## 3.0.0-alpha.37

### Patch Changes

- 2a3e3e7: Fix first list item in `<FileTree>` not within permitted parent
  elements
- Updated dependencies [2a3e3e7]
  - nextra@3.0.0-alpha.37

## 3.0.0-alpha.36

### Patch Changes

- Updated dependencies [2b9b95b]
  - nextra@3.0.0-alpha.36

## 3.0.0-alpha.35

### Patch Changes

- Updated dependencies [f662237]
  - nextra@3.0.0-alpha.35

## 3.0.0-alpha.34

### Patch Changes

- 1a634cd: remove explicit `ZodError` assertion
- Updated dependencies [1a634cd]
  - nextra@3.0.0-alpha.34

## 3.0.0-alpha.33

### Patch Changes

- 7bb18e3: Add a generic for `themeConfig` in `NextraThemeLayoutProps` to
  improve type inference.
- Updated dependencies [7bb18e3]
  - nextra@3.0.0-alpha.33

## 3.0.0-alpha.32

### Patch Changes

- 73239c4: To ensure consistent horizontal padding, set the default language as
  plaintext for code blocks. This prevents any loss of formatting for code
  blocks without a specified language.
- 7e57ddb: Avoid skipping the heading level in the posts layout, removes
  `.post-item` and `.post-item-more` classes
- 150184b: attach heading anchor `id` attribute to heading (like Pagefind do)
  and fix heading anchor styles when `theme.typesetting: 'article'` is set
- a90b90f: Switch to the dark theme provided by `@tailwindcss/typography` in
  theme-blog.
- 49a9627: fix theme-blog heading styles in post layout
- 3c6193d: Remove unnecessary `sortPages` from `server/utils.ts`
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
- Updated dependencies [a8c2196]
- Updated dependencies [363b85f]
  - nextra@3.0.0-alpha.28

## 3.0.0-alpha.27

### Patch Changes

- 4f0f6b27: Omit `...{:type}` inline code annotations from search index #2922
- a95e7454: Fix the line highlighting background-color does not extend to the
  full width of the code block when a scrollbar appears with line numbers.
- Updated dependencies [4f0f6b27]
- Updated dependencies [a95e7454]
  - nextra@3.0.0-alpha.27

## 3.0.0-alpha.26

### Patch Changes

- nextra@3.0.0-alpha.26

## 3.0.0-alpha.25

### Patch Changes

- nextra@3.0.0-alpha.25

## 3.0.0-alpha.24

### Patch Changes

- Updated dependencies [6f4c83a8]
  - nextra@3.0.0-alpha.24

## 3.0.0-alpha.23

### Minor Changes

- 6ec3241c: Add Terraform/Move icon https://github.com/shuding/nextra/pull/2811
  https://github.com/shuding/nextra/pull/2808
- 6ec3241c: Make the `<Tab />` component be crawlable and indexable by search
  engines by default

### Patch Changes

- ad108ff7: use `overflow-x-auto` instead `overflow-x-scroll` for `<Table />`
- Updated dependencies [6ec3241c]
- Updated dependencies [6ec3241c]
- Updated dependencies [ad108ff7]
- Updated dependencies [217f7082]
  - nextra@3.0.0-alpha.23

## 3.0.0-alpha.22

### Patch Changes

- Updated dependencies [2630461c]
  - nextra@3.0.0-alpha.22

## 3.0.0-alpha.21

### Patch Changes

- nextra@3.0.0-alpha.21

## 3.0.0-alpha.20

### Patch Changes

- nextra@3.0.0-alpha.20

## 3.0.0-alpha.19

### Patch Changes

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

- nextra@3.0.0-alpha.14

## 3.0.0-alpha.13

### Patch Changes

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

### Patch Changes

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

- Updated dependencies [03da778a]
  - nextra@3.0.0-alpha.6

## 3.0.0-alpha.5

### Patch Changes

- Updated dependencies [a3b67aea]
  - nextra@3.0.0-alpha.5

## 3.0.0-alpha.4

### Patch Changes

- Updated dependencies [7faa0968]
  - nextra@3.0.0-alpha.4

## 3.0.0-alpha.3

### Patch Changes

- Updated dependencies [fe5061b7]
  - nextra@3.0.0-alpha.3

## 3.0.0-alpha.2

### Patch Changes

- cb247901: fix broken `export default` statement in mdx files
- Updated dependencies [cb247901]
  - nextra@3.0.0-alpha.2

## 3.0.0-alpha.1

### Major Changes

- 148278ce: rename tailwind prefix `nx-` to `_` to reduce bundle size
- d7d8a3eb: new styles for code blocks aka in next.js
- 128e195f: fix React warning, remove PageOpts.toc, use `toc` prop from
  `components.wrapper`
- 191e6c41: - use `shikiji` instead of `shiki`

  - rename `useSSG` to `useData`

- c7f03e54: rename `pageOpts.headings` to `toc`

### Patch Changes

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

- 16ab7f78: - remove `legacyBehavior` from `NextLink`

  - remove `config.cusdis`. Instead, now you need to pass cusdis options as
    props in `Cusdis` component

- 919fe977: set `"peerDependencies.next": ">=13"`

### Patch Changes

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
