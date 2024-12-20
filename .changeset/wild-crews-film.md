---
'nextra-theme-docs': patch
---

fix click on the arrow icon in the folder item in the Sidebar, was always consider clicked on `<a>` or `<button>` due
`event.currentTarget`
