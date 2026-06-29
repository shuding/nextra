---
"nextra": patch
---

Add `maxResults` prop to `<Search>` to cap how many Pagefind results are hydrated and rendered. Prevents browser freezes ("Page Unresponsive") on large docs sites where a short query can match hundreds of pages. Defaults to 12; pass a higher value to keep previous behavior.

The previous implementation called `o.data()` on every result returned by Pagefind and rendered them all on the main thread. On large sites, a short query can match hundreds of pages, fetching hundreds of fragment JSON files and rendering hundreds of result components — long enough to block the main thread for 15+ seconds and trigger Chrome's "Page Unresponsive" dialog. The search dropdown only shows ~10 results at a time, so the rest of that work is hydrating fragments the user will never see.
