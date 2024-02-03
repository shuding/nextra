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
      "import {Fragment as _Fragment, jsx as _jsx} from "react/jsx-runtime";
      export const metadata = {
        "title": "Foo",
        "description": "Bar"
      };
      function _createMdxContent(props) {
        return _jsx(_Fragment, {});
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = props.components || ({});
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      "
    `)
  })
  it('should remove everything with export default', () => {
    const result = compileMetadata('export { default } from "./bar.mdx"', { filePath: 'bar.mdx' })
    expect(result).resolves.toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx} from "react/jsx-runtime";
      export const metadata = {
        "title": "Foo",
        "description": "Bar"
      };
      function _createMdxContent(props) {
        return _jsx(_Fragment, {});
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = props.components || ({});
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      "
    `)
  })
})
