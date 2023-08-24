---
'nextra': patch
---

- remove `useCachedCompiler` from `compileMdx`, always cache compiler for non-remote content

- never cache md/mdx compiler for remote content

- refactor function arguments for `compileMdx`

- fix source code from loader was stripped starting from last match `export default MDXContent;` and
  until the end, so `transform` function was not applied
