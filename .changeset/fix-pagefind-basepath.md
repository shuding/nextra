---
"nextra": patch
---

Fix Pagefind search not working when using `basePath` in Next.js config

When deploying Nextra to a subpath (e.g., `basePath: '/docs'`), the Pagefind search would fail to load index files because `baseUrl` was hardcoded to `'/'` instead of using `addBasePath('/')`.
