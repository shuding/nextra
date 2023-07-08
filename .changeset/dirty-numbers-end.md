---
'nextra-theme-blog': minor
'nextra-theme-docs': minor
'nextra': minor
---

Move below packages to nextra package

- `<Cards />` and `<Card />`
- `<Tabs />` and `<Tab />`
- `<Steps />`
- `<FileTree />`

to import them you can use the following in your official `nextra-theme-blog` and `nextra-theme-docs`

```js
import { Card, Cards } from 'nextra/components'
```

```js
import { Tab, Tabs } from 'nextra/components'
```

```js
import { Steps } from 'nextra/components'
```

```js
import { FileTree } from 'nextra/components'
```
