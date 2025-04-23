import { compileMetadata } from '../compile-metadata.js'

describe('compileMetadata()', () => {
  it('should remove everything', () => {
    const mdx = `---
title: Foo
description: Bar
---

# A

## B

### C

#### D

##### E

###### F

- a
- b
- c

> q

export const MyComponent = () => null

<MyComponent />
`
    const result = compileMetadata(mdx, { filePath: 'foo.mdx' })
    return expect(result).resolves.toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx} from "react/jsx-runtime";
      export const metadata = {
        "title": "Foo",
        "description": "Bar",
        "filePath": "foo.mdx"
      };
      "
    `)
  })
  it('should remove everything with export default', () => {
    const result = compileMetadata('export { default } from "./foo.mdx"', {
      filePath: 'bar.mdx'
    })
    return expect(result).resolves.toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx} from "react/jsx-runtime";
      export const metadata = {
        "title": "Bar",
        "filePath": "bar.mdx"
      };
      "
    `)
  })

  it('should remove everything for `format: "md"` which is by default', () => {
    const result = compileMetadata(
      `
<!-- export title: "Foo" -->

# world`,
      { filePath: 'foo.md' }
    )
    return expect(result).resolves.toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx} from "react/jsx-runtime";
      export const metadata = {
        "title": "world",
        "filePath": "foo.md"
      };
      "
    `)
  })
})
