---
'nextra-theme-docs': minor
'nextra': minor
'nextra-theme-blog': minor
---

feat: introduce new `<TSDoc />` component

The `<TSDoc>` component from `nextra/tsdoc` generates a properties table that
displays:

- **Property name**
- **TypeScript type**
- **Property description** - is parsed from [TSDoc](https://tsdoc.org) inline
  description or the `@description` tag. You can use any Markdown/MDX syntax
  here.
- **Default value** - are extracted from the `@default` or `@defaultValue` tag.

More info can be found in https://nextra.site/docs/built-ins/tsdoc
