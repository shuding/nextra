---
'nextra-theme-blog': major
'nextra-theme-docs': major
'nextra': major
---

- add root `_meta.global.{js,jsx,ts,tsx}` file
- `getPageMap` now receive only 1 argument `root?: string = '/'` instead of 2 `lang?: string, route?: string = '/'`
- remove `createCatchAllMeta` from `nextra/catch-all`
- remove `collectCatchAllRoutes`
- remove `normalizePageRoute`
- add `mergeMetaWithPageMap` to `nextra/page-map`
- move adding `metadata.filePath`, `metadata.title` and `metadata.readingTime` in remark plugin
- refactor recma rewrite plugin and add tests
  - remove `recmaRewriteJsx`
  - remove `recmaRewriteFunctionBody`
- make `convertPageMapToJs` sync
