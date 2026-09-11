---
"nextra": patch
---

Add a `gitTimestamp` option to skip Git last-modified lookups.

Content in a Git submodule is not in the parent repository history, so timestamp resolution fails and Nextra logs a warning per file. Set `gitTimestamp: false` in `nextra()` to disable fetching.
