---
'nextra': patch
'nextra-theme-blog': patch
'nextra-theme-docs': patch
---

downgrade remark-math from `6` to `5.1.1` to fix `TypeError: Cannot read properties of undefined (reading 'mathFlowInside')` error

fix support of ```math lang that was overridden by `rehype-pretty-code`
