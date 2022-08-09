# nextra-theme-docs

## 2.0.0-beta.17

### Patch Changes

- 2217f9c: fix `Warning: Prop`href`did not match. Server: "#" Client: ...`
- 2217f9c: fix `next export` command
- 2217f9c: replace `classnames` package with `clsx` as he's faster
- 2217f9c: remove `locale` prop from theme config, forbid passing in `renderComponent`

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
  import Callout from 'nextra-theme-docs/callout'
  import Collapse from 'nextra-theme-docs/collapse'
  import Bleed from 'nextra-theme-docs/bleed'
  import { Tabs, Tab } from 'nextra-theme-docs/tabs'
  ```
  by
  ```ts
  import { Callout, Collapse, Bleed, Tabs, Tab } from 'nextra-theme-docs'
  ```
- 43409ad: fix: mdx theme is missing

## 2.0.0-beta.15

### Patch Changes

- 88f999d: fix: UI improvements

## 2.0.0-beta.14

### Patch Changes

- 96ed5c2: [nextra/nextra-theme-docs]: support both `experimental.newNextLinkBehavior` - `true` and `false`
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
- 76d1e30: [nextra-theme-docs]: fix `Warning: A title element received an array` and possible `[object Object]` in title
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

- af72f85: chore(nextra-theme-docs): provide type for `DocsThemeConfig.nextThemes` instead of `object`
- 97e6141: fix(nextra/docs): fallback search to `en-US` instead `default`
- 699d131: feat(nextra/docs/blog): allow import `.md`/`.mdx` as well
- 03e90d8: refresh build system with tsup and fix nextra type

## 2.0.0-beta.9

### Patch Changes

- 6644bd5: pass unstable_flexsearch
- c15f570: fix: query should not affect nav highlight
- 4730bdc: chore(nextra-theme-docs): refactor `theme-context.ts`
- 94a8587: chore: extract `svg` icons in `/icons` folder, reusing same icons `<MoonIcon />` / `<SunIcon />` in blog from docs
- e573175: Fix release CI
- c380989: fix(docs): types is missing in bundle
- d34f9f2: feat(nextra-theme-docs): update discord logo to the new one
- 7053959: chore(nextra-theme-docs): remove unneeded `transform-none` css class

## 2.0.0-beta.8

### Patch Changes

- 009bf6a: Fix release workflow.

## 2.0.0-beta.7
