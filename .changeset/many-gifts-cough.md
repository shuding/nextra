---
'nextra-theme-blog': patch
'nextra-theme-docs': patch
'nextra': patch
---

Cache the result of `repository.getFileLatestModifiedDateAsync` because it can slow down Fast Refresh for uncommitted files.
