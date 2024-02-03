import { compileMetadata } from '../src/server/compile-metadata.js'

describe('compileMetadata()', () => {
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
  it('should remove everything', () => {
    const result = compileMetadata(mdx, { filePath: 'foo.mdx' })
    expect(result).resolves.toMatchInlineSnapshot(`
      "export const metadata = {
        "title": "Foo",
        "description": "Bar"
      };
      "
    `)
  })
  it('should remove everything with export default', () => {
    const result = compileMetadata('export { default } from "./bar.mdx"', { filePath: 'bar.mdx' })
    expect(result).resolves.toMatchInlineSnapshot(`
      "export const metadata = {};
      "
    `)
  })
})
