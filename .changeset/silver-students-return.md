---
'nextra-theme-docs': patch
---

remove `titleSuffix` theme option in favor of `defaultSeo.titleTemplate`
setup `next-seo`
add new theme option `defaultSeo`
get `description`, `canonical`, `openGraph` values from `frontMatter` and pass them to `<NextSeo />` component
