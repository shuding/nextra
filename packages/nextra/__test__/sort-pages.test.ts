import { sortPages } from '../src/utils'

const kind = 'MdxPage'

describe('sortPages()', () => {
  it('should sort by date', () => {
    const data = sortPages([
      { kind, name: 'baz', frontMatter: { date: new Date('1995-10-21') } },
      { kind, name: 'foo', frontMatter: { date: new Date('1992-10-21') } },
      { kind, name: 'quz', frontMatter: { date: new Date('1998-10-21') } }
    ])
    expect(data).toEqual([
      ['quz', 'Quz'],
      ['baz', 'Baz'],
      ['foo', 'Foo']
    ])
  })

  it('should sort by date first and after by title', () => {
    const data = sortPages([
      { kind, name: 'quz' },
      { kind, name: 'foo', frontMatter: { date: new Date('1992-10-21') } },
      { kind, name: 'baz' }
    ])
    expect(data).toEqual([
      ['foo', 'Foo'],
      ['baz', 'Baz'],
      ['quz', 'Quz']
    ])
  })

  it('should take priority `frontMatter.title` over name', () => {
    const data = sortPages([
      { kind, name: 'baz' },
      { kind, name: 'foo', frontMatter: { title: 'abc' } },
      { kind, name: 'quz' }
    ])
    expect(data).toEqual([
      ['foo', 'abc'],
      ['baz', 'Baz'],
      ['quz', 'Quz']
    ])
  })

  it('should sort numeric', () => {
    const data = sortPages([
      { kind, name: '10-baz' },
      { kind, name: '0-foo' },
      { kind, name: '2.5-quz' }
    ])
    expect(data).toEqual([
      ['0-foo', '0 Foo'],
      ['2.5-quz', '2.5 Quz'],
      ['10-baz', '10 Baz']
    ])
  })

  it('should capitalize `Folder`', () => {
    const data = sortPages([
      { kind, name: 'quz' },
      { kind: 'Folder', name: 'foo' },
      { kind, name: 'baz' }
    ])
    expect(data).toEqual([
      ['baz', 'Baz'],
      ['foo', 'Foo'],
      ['quz', 'Quz']
    ])
  })
})
