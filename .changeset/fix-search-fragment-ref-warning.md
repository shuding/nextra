---
"nextra": patch
---

Fix React 19 development warning `Invalid prop 'ref' supplied to 'React.Fragment'` in the search results panel

`ComboboxOptions` wraps its children in a `Frozen` component which, since `@headlessui/react` 2.2.10, clones a single element child with a `ref`. Rendering a `Fragment` as the loading/error state of the search results panel caused that `ref` to be forwarded to `React.Fragment`. Replace those `Fragment`s with plain `<div>` elements so the `ref` can be attached to a real DOM node.
