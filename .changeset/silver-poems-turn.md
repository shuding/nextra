---
'nextra': patch
'nextra-theme-docs': patch
---

Fix `frontMatter.sidebarTitle` didn't affect without `frontMatter.title` set

now priority for sidebar title is:

1. `title` property from `_meta` file
1. `frontMatter.sidebarTitle`
1. `frontMatter.title`
1. formatted with [Title](https://title.sh) based on filename
