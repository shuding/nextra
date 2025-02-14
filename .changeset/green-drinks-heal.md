---
"nextra-theme-docs": patch
---

- add `overflow: hidden` on `<html>` element instead of `<body>` to lock scroll when mobile nav is open
- increase z-index for mobile nav  from `10` to `20`, in navbar from `20` to `30`
- fix navbar alignement on mobile when `Navbar.align` prop is set to `left`
