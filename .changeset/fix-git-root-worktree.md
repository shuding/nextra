---
"nextra": patch
---

Fix `GIT_ROOT` resolution for git worktrees so MDX `getFileLatestModifiedDateAsync` lookups don't hang `next build`.

`repository.path()` returns `<repo>/.git/worktrees/<name>/` inside a worktree, so `path.join(repository.path(), '..')` resolved to `<repo>/.git/worktrees/` — the wrong directory. Every per-file timestamp lookup then walked the full history from a path that didn't exist relative to the calculated root, taking ~1.6 s per file (a 110-file site went from ~1.8 s total to ~176 s).

`repository.workdir()` returns the correct working directory for both regular checkouts and worktrees, with a fallback to the old behaviour for bare repositories where `workdir()` is undefined.
