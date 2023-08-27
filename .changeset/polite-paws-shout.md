---
'nextra-theme-docs': patch
'nextra': patch
---

- Fix `TypeError: Cannot read properties of null (reading 'classList')` while navigating to route
  that doesn't have toc with `router.push` for example

- Add alias `Tabs.Tab` to `Tab` component

- Add alias `Cards.Card` to `Card` component

- should not attach custom heading id as id attribute if parent is `Tabs.Tab` or `Tab`

- should not save to toc list headings of level 1
