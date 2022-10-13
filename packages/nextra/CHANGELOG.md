# nextra

## 2.0.0-beta.30

### Patch Changes

- 02bc6fc: use `next/future/image` if next>=12.3.0
- f7856a1: change default options for `compileMdx`, set `jsx: false` and `outputFormat: 'function-body'` by default

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
- e4cfb83: define page title in sidebar from `frontMatter.title` if page is not specified in `_meta.json`
- c3e6227: add `overflow-x-scroll` for tables
- 93d028b: use `title` package in nextra to determine sidebar title based on pagename
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 256154a: use "next/future/image" if `"experimental.images.allowFutureImage": true` is set in next config
- 256154a: replace images with `<NextImage />` even when url not relative but that starts from `/` (public directory)

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
- e6771ca: fix `ReferenceError` when trying to access `__nextra_pageOpts__` inside MDX file
- 1ee3c92: reuse table styles from docs in blog
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add `NextraConfig.unstable_defaultShowCopyCode` option to show button by default, add `copy` and `copy=false` options for code-blocks
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

- 96ed5c2: [nextra/nextra-theme-docs]: support both `experimental.newNextLinkBehavior` - `true` and `false`
- c8605d6: feat: New layout implementation

## 2.0.0-beta.13

### Patch Changes

- 4157b71: set lower build target and share code highlight theme through nextra

## 2.0.0-beta.12

### Patch Changes

- cc1379c: fix `Hydration failed because the initial UI...` while modifying `meta.json` on dev env and react 18
- 512953f: chore: remove redundant check for `MARKDOWN_EXTENSION_REGEX.test(filename)` in loader
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
- 488f737: fix client console error - Text content does not match server-rendered HTML
- 4a7cc10: feat(nextra): allow define custom languages for shiki with `mdxOptions.rehypePrettyCodeOptions` option
- c751458: fix(nextra): ignore in loader files from `pages/api` folder
- e573175: Fix release CI
- efd95ec: fix(nextra): allow to contain dots in page filenames
- e35bbf7: chore: rename `module` to `mod` to avoid confusing with global `module` object

## 2.0.0-beta.8

### Patch Changes

- 009bf6a: Fix release workflow.

## 2.0.0-beta.7

### Patch Changes

- 383b869: Add Changesets and setup pre-release and release CI.
