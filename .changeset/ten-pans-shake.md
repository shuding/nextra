---
'nextra-theme-docs': patch
---

fix memory leak in search for case when search value is `>  ` (replaced to `>||`) + some character
provoke memory leak
