---
'nextra-theme-docs': patch
---

fix memory leak in search for case `>  ` replaced previously to `>||` + some character provoke
memory leak because `RegExp#exec` will always return a match
