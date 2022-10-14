---
'nextra-theme-docs': patch
---

- setup `next-seo`
- add new theme option `getNextSeoProps`
- remove `titleSuffix` theme option in favor of `getNextSeoProps.titleTemplate`
- by default pass `description`, `canonical`, `openGraph` values to `<NextSeo />` component  from page `frontMatter`, values can be overridden with return value of `getNextSeoProps`
