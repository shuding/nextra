---
'nextra': minor
'nextra-theme-blog': minor
'nextra-theme-docs': minor
---

- add `@theguild/remark-npm2yarn` package that replaces the code block that has `npm2yarn` metadata
  with `<Tabs />` and `<Tab />` components from `nextra/components`.

- `<Tabs />` now has `selectedKey` prop, the chosen tab is saved in the local storage, which will be
  chosen in future page renders.

More info https://nextra.site/docs/guide/advanced/npm2yarn
