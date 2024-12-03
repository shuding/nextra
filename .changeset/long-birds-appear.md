---
'nextra-theme-blog': major
'nextra-theme-docs': major
'nextra': major
---

- add root `_meta.global.{js,jsx,ts,tsx}` file
  > See [working example](https://github.com/shuding/nextra/blob/v4-v2/docs/app/_meta.global.ts) based on https://nextra.site website
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
