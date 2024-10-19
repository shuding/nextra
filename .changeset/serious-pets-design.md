---
'nextra-theme-blog': patch
'nextra-theme-docs': patch
'nextra': patch
---

- sync with nextra 3.0.15
- bump to Next 15
- remove importing of `style.css` in themes, you need to import now manually by

```js
import 'nextra-theme-docs/style.css' // for docs theme
import 'nextra-theme-blog/style.css' // for blog theme
```
