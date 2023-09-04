---
'nextra': major
---

- ❌ remove `_app.mdx`, use `_app.{js,jsx}` or `_app.{ts,tsx}` for TypeScript projects instead

- ❌ remove Nextra middleware `nextra/locales`

- ❌ remove `parseFileName` from `nextra/utils`

- ❌ remove `nextra/filter-route-locale`

- ❌ remove `resolvePageMap` and `pageMapCache` from `nextra/page-map`

- ✅ add `nextra/fetch-filepaths-from-github`

- save `pageMap` to `.next/static/chunks/nextra-page-map-{locale}.mjs`

- save `fileMap` to `.next/static/chunks/nextra-file-map.mjs`
