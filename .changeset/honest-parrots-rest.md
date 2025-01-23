---
"nextra": patch
---

fix `::selection` styles, use `hsla` instead of `hsl` because it can overlap text with `::selection` background when `background-clip: text` is set
