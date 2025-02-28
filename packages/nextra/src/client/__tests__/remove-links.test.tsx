import { removeLinks } from '../remove-links.js'

describe('removeLinks()', () => {
  it('should return string', () => {
    expect(removeLinks('foo')).toBe('foo')
  })
  it('should remove link inside fragment', () => {
    const node = (
      <>
        foo
        <code>
          <a href="#">bar</a>
        </code>
      </>
    )
    expect(removeLinks(node)).toMatchInlineSnapshot(`
      [
        <React.Fragment>
          foo
          <code>
            bar
          </code>
        </React.Fragment>,
      ]
    `)
  })
  it('should remove wrapper link', () => {
    const node = (
      <a href="#">
        foo<code>bar</code>
      </a>
    )
    expect(removeLinks(node)).toMatchInlineSnapshot(`
      [
        "foo",
        <code>
          bar
        </code>,
      ]
    `)
  })
  it('should remove `undefined`', () => {
    const node = <>foo{undefined}bar</>
    expect(removeLinks(node)).toMatchInlineSnapshot(`
      [
        <React.Fragment>
          foo
          bar
        </React.Fragment>,
      ]
    `)
  })
})
