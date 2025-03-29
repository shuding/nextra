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
- **Permalink** - a `#` anchor link to the property row for easy reference.

More info can be found in https://nextra.site/docs/built-ins/tsdoc

> [!IMPORTANT]
> 
> Huge thanks to [xyflow - Node Based UIs for React and Svelte](https://xyflow.com/?utm_source=github&utm_campaign=nextra-4.3&utm_content=changelog) for sponsoring this feature!
