---
'nextra-theme-blog': patch
'nextra-theme-docs': patch
'nextra': patch
---

- add `disabled` prop for `<Folder>` component when `open` prop was set (to disable click event and remove `cursor: pointer`)
- allow `<h5>` and `<h6>` tags be used with `<Steps>`
- fix Webpack module rebuild for pageMap when new files where added or removed in `app` dir or `content` dir 
