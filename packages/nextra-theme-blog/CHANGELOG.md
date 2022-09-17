# nextra-theme-blog

## 2.0.0-beta.29

## 2.0.0-beta.28

## 2.0.0-beta.27

## 2.0.0-beta.26

## 2.0.0-beta.25

### Patch Changes

- c3e6227: add `overflow-x-scroll` for tables
- ff8967c: add `Toggle Word Wrap` button for code-blocks (only for mobile)
- ff8967c: fix missing `Copy Code` button in code-blocks without language
- 256154a: use "next/future/image" if `"experimental.images.allowFutureImage": true` is set in next config
- 256154a: replace images with `<NextImage />` even when url not relative but that starts from `/` (public directory)

## 2.0.0-beta.24

## 2.0.0-beta.23

## 2.0.0-beta.22

### Patch Changes

- 8dab966: fix invisible copy button in code blocks

## 2.0.0-beta.21

## 2.0.0-beta.20

### Patch Changes

- 1ee3c92: reuse table styles from docs in blog
- e6771ca: [Blog/Docs] Add copy to clipboard button for code-blocks. Add `NextraConfig.unstable_defaultShowCopyCode` option to show button by default, add `copy` and `copy=false` options for code-blocks
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
- 07e4732: [nextra-theme-blog]: fix `Application error: a client-side exception has occurred` when invalid date was provided in frontmatter + TESTS

## 2.0.0-beta.11

### Patch Changes

- a0398e0: fix: avoid mutating nextConfig
- fe2b714: upgrade to react 18
- 78f1519: chore: Add strict-peer-dependencies=false

## 2.0.0-beta.10

### Patch Changes

- 3ef42cb: fix(nextra-theme-blog): move css to `className`s, fix duplicate id issue
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 03e90d8: refresh build system with tsup and fix nextra type

## 2.0.0-beta.9

### Patch Changes

- 6644bd5: pass unstable_flexsearch
- 4fd7c53: chore(nextra-theme-blog): refactor `sort-date.ts`.
- 4edca5e: chore(nextra-theme-blog): refactor `traverse.ts`
- acf3a1f: fix(blog): types is missing in bundle
- 596ea52: fix(nextra-theme-blog): make nav items center aligned
- 94a8587: chore: extract `svg` icons in `/icons` folder, reusing same icons `<MoonIcon />` / `<SunIcon />` in blog from docs
- e573175: Fix release CI

## 2.0.0-beta.8

### Patch Changes

- 009bf6a: Fix release workflow.

## 2.0.0-beta.7

### Patch Changes

- 8f55c80: fix(nextra-theme-blog): unneeded spread for `<a/>`
