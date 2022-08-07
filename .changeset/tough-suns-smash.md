---
'nextra-theme-docs': patch
---

move react components to `components` folder and replace exports:
```ts
import Callout from 'nextra-theme-docs/callout'
import Collapse from 'nextra-theme-docs/collapse'
import Bleed from 'nextra-theme-docs/bleed'
import { Tabs, Tab } from 'nextra-theme-docs/tabs'
```
by
```ts
import { Callout, Collapse, Bleed, Tabs, Tab } from 'nextra-theme-docs'
```
