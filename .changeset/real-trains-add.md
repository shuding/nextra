---
'nextra-theme-blog': patch
'nextra-theme-docs': patch
'nextra': patch
---

remove false positive warnings on projects without `content/` directory

```
⚠ Compiled with warnings

../packages/nextra/dist/client/pages.js
Module not found: Can't resolve 'private-next-root-dir/content' in '/Users/dmytro/Desktop/nextra/packages/nextra/dist/client'
```
