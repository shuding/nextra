---
'nextra-theme-docs': patch
'nextra': patch
---

fix error goes from `playground.js` file when your `mdx-components` file contain server-only components

```
./app/layout.tsx
'client-only' cannot be imported from a Server Component module. It should only be used from a Client Component.

Import trace for requested module:
../packages/components/dist/index.js
./mdx-components.js
../node_modules/.pnpm/nextra@4.0.0-app-router.20_@types+react@18.3.12_acorn@8.14.0_next@15.0.2_@babel+core@7.26.0_r_73lkrljx3r7g5vsm2cmbm3erma/node_modules/nextra/dist/client/components/remote-content.js
../node_modules/.pnpm/nextra@4.0.0-app-router.20_@types+react@18.3.12_acorn@8.14.0_next@15.0.2_@babel+core@7.26.0_r_73lkrljx3r7g5vsm2cmbm3erma/node_modules/nextra/dist/client/components/playground.js
```
