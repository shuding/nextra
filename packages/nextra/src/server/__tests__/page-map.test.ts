import { getPageMapForFixture } from './test-utils.js'

describe('Page Process', () => {
  it("should not add `_meta.json` file if folder doesn't contain markdown files", async () => {
    const pageMap = await getPageMapForFixture('folder-without-markdown-files')
    expect(pageMap).toEqual([])
  })

  it("should not add `_meta.json` file if it's missing", async () => {
    const pageMap = await getPageMapForFixture('folder-without-meta-json')
    expect(pageMap).toMatchInlineSnapshot(`
      [
        {
          "frontMatter": undefined,
          "name": "callout",
          "route": "/callout",
          "title": "Callout",
        },
        {
          "frontMatter": undefined,
          "name": "tabs",
          "route": "/tabs",
          "title": "Tabs",
        },
      ]
    `)
  })

  it('should resolve symlinked files and directories', async () => {
    const pageMap = await getPageMapForFixture('folder-with-symlinks/pages')
    expect(pageMap).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "frontMatter": undefined,
              "name": "test2",
              "route": "/docs/test2",
              "title": "Test2",
            },
          ],
          "name": "docs",
          "route": "/docs",
          "title": "Docs",
        },
        {
          "frontMatter": undefined,
          "name": "test1",
          "route": "/test1",
          "title": "Test1",
        },
      ]
    `)
  })
})
