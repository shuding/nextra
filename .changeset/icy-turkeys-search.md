---
'nextra-theme-docs': patch
---

Fix collapse behaviour of sidebar

- When a nested route item is active, clicking the parent route item should not collapse the section.
- When the collapsible section is open, clicking the parent route item should not cause it to collapse.
- Switching to another route should not trigger an unexpected reopening.
