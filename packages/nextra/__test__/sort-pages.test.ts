import { sortPages } from '../src/server/utils.js'

describe('sortPages()', () => {
  it('should sort by date', () => {
    const data = sortPages([
      { name: 'baz', frontMatter: { date: new Date('1995-10-21') } },
      { name: 'foo', frontMatter: { date: new Date('1992-10-21') } },
      { name: 'quz', frontMatter: { date: new Date('1998-10-21') } }
    ])
    expect(data).toEqual([
      ['quz', 'Quz'],
      ['baz', 'Baz'],
      ['foo', 'Foo']
    ])
  })

  it('should sort by date first and after by title', () => {
    const data = sortPages([
      { name: 'quz' },
      { name: 'foo', frontMatter: { date: new Date('1992-10-21') } },
      { name: 'baz' }
    ])
    expect(data).toEqual([
      ['foo', 'Foo'],
      ['baz', 'Baz'],
      ['quz', 'Quz']
    ])
  })

  it('should take priority `frontMatter.title` over name', () => {
    const data = sortPages([
      { name: 'baz' },
      { name: 'foo', frontMatter: { title: 'abc' } },
      { name: 'quz' }
    ])
    expect(data).toEqual([
      ['foo', 'abc'],
      ['baz', 'Baz'],
      ['quz', 'Quz']
    ])
  })

  it('should sort numeric', () => {
    const data = sortPages([
      { name: '10-baz' },
      { name: '0-foo' },
      { name: '2.5-quz' }
    ])
    expect(data).toEqual([
      ['0-foo', '0 Foo'],
      ['2.5-quz', '2.5 Quz'],
      ['10-baz', '10 Baz']
    ])
  })

  it('should capitalize `Folder`', () => {
    const data = sortPages([{ name: 'quz' }, { name: 'foo' }, { name: 'baz' }])
    expect(data).toEqual([
      ['baz', 'Baz'],
      ['foo', 'Foo'],
      ['quz', 'Quz']
    ])
  })
})
