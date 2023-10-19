import { expect } from 'vitest'
import nextraDataEnglish from '../../../examples/swr-site/.next/static/chunks/nextra-data-en.json'
import {
  compileQuery,
  getResults,
  highlight,
  loadIndexes,
  scoreText,
  summarize
} from '../src/components/flexsearch'

const fetch = (globalThis.fetch = vi.fn())

function createFetchResponse(data: unknown) {
  return { json: async () => data } as Response
}

fetch.mockResolvedValue(createFetchResponse(nextraDataEnglish))

const LOCALE = 'en'

describe('search', () => {
  it('should match `structurizedData` snapshot', async () => {
    expect(nextraDataEnglish).toMatchSnapshot()
  })

  describe('results', async () => {
    await loadIndexes('', LOCALE)

    const position = (query: string, route: string) => {
      let position = 1
      for (const result of getResults(query, LOCALE)) {
        for (const section of result.sections) {
          if (
            route === result.route ||
            route === `${result.route}#${section.anchor}`
          ) {
            return position
          }
          position++
        }
      }

      return undefined
    }

    it.skip('should return no results for `>  a`', () => {
      expect(getResults('>  a', LOCALE)).toEqual([])
    })

    it('should match `This Is A Page`', () => {
      expect(position('This Is A Page', '/en/about/a-page')).toEqual(1)
    })

    it('should match `Pre-fill Data`', () => {
      expect(
        position('Pre-fill Data', '/en/docs/prefetching#pre-fill-data')
      ).toEqual(1)
    })

    it('should match `Next.js SSR`', () => {
      expect(position('Next.js SSR', '/en/examples/ssr')).toEqual(1)
    })

    it('should match `Key Change + Previous Data + Fallback`', () => {
      expect(
        position(
          'Key Change + Previous Data + Fallback',
          '/en/docs/understanding#key-change--previous-data--fallback'
        )
      ).toEqual(1)
    })

    it('should return only one result for `eslint`', () => {
      expect(getResults('eslint', LOCALE).length).toEqual(1)
    })
  })
})

describe('compileQuery', () => {
  it('should work', () => {
    expect(compileQuery('').toString()).toEqual('/^$/')
    expect(compileQuery('one').toString()).toEqual('/(one)/gi')
    expect(compileQuery('one two').toString()).toEqual('/(one|two)/gi')
    expect(compileQuery('google.com').toString()).toEqual('/(google|com)/gi')
    expect(compileQuery('(one)(two)').toString()).toEqual('/(one|two)/gi')
    expect(compileQuery('a of abc').toString()).toEqual('/(abc)/gi')
  })
})

describe('scoreText', () => {
  it('should work', () => {
    const empty = compileQuery('')
    const one = compileQuery('one')
    const oneTwo = compileQuery('one two')

    expect(scoreText(empty, '')).toEqual(0)
    expect(scoreText(empty, ' ')).toEqual(0)
    expect(scoreText(one, '')).toEqual(0)
    expect(scoreText(one, 'one')).toEqual(3)
    expect(scoreText(one, 'two')).toEqual(0)
    expect(scoreText(one, 'one two')).toEqual(3)
    expect(scoreText(oneTwo, ' one')).toEqual(3)
    expect(scoreText(oneTwo, 'two ')).toEqual(3)
    expect(scoreText(oneTwo, 'one two')).toEqual(6)
    expect(scoreText(oneTwo, 'onetwo')).toEqual(6)
    expect(scoreText(oneTwo, 'one two one')).toEqual(6)
    expect(scoreText(oneTwo, 'one two two one')).toEqual(6)
  })
})

describe('summarize', () => {
  it('should work', () => {
    expect(summarize('', [])).toEqual([])
    expect(summarize('one', [])).toEqual([{ value: 'one' }])
    expect(summarize('one two', [])).toEqual([{ value: 'one two' }])
    expect(summarize('  one two ', [])).toEqual([{ value: '  one two ' }])
    expect(summarize('one two', [0, 3])).toEqual([
      { value: 'one', highlight: true },
      { value: ' two' }
    ])
    expect(summarize('one two', [4, 7])).toEqual([
      { value: 'one ' },
      { value: 'two', highlight: true }
    ])
    expect(summarize('one two three', [4, 7])).toEqual([
      { value: 'one ' },
      { value: 'two', highlight: true },
      { value: ' three' }
    ])
    expect(summarize('one two three', [0, 7])).toEqual([
      { value: 'one two', highlight: true },
      { value: ' three' }
    ])
    expect(summarize('one two three', [8, 13])).toEqual([
      { value: 'one two ' },
      { value: 'three', highlight: true }
    ])
    expect(summarize('one two three', [0, 2])).toEqual([
      { value: 'on', highlight: true },
      { value: 'e two three' }
    ])
    expect(summarize('one two three', [1, 3])).toEqual([
      { value: 'o' },
      { value: 'ne', highlight: true },
      { value: ' two three' }
    ])
    expect(
      summarize('a'.repeat(100) + ' one ' + 'b'.repeat(100), [101, 104])
    ).toEqual([
      { value: '... ' },
      { value: 'one', highlight: true },
      { value: ' ...' }
    ])
    expect(
      summarize('a'.repeat(30) + ' zero one two ' + 'b'.repeat(57), [31, 35])
    ).toEqual([
      { value: 'a'.repeat(30) + ' ' },
      { value: 'zero', highlight: true },
      { value: ' one two ...' }
    ])
  })
})

describe('highlight', () => {
  it('should handle non-words at edges', () => {
    const regex = compileQuery('callout')

    expect(highlight(regex, '<Callout />')).toEqual([
      { value: '<' },
      { highlight: true, value: 'Callout' },
      { value: ' />' }
    ])
  })

  it('should hande long words', () => {
    const value = 'X'.repeat(100)
    expect(highlight(/^$/, 'X'.repeat(100))).toEqual([{ value }])
    expect(highlight(/^$/, 'X'.repeat(200))).toEqual([
      { value: 'X'.repeat(100) + ' ...' }
    ])
  })

  it('should correctly orient highlights', () => {
    const regex = compileQuery('one two three four')
    expect(
      highlight(
        regex,
        'foobar '.repeat(100) +
          'one two' +
          'hello '.repeat(100) +
          'one two three four'
      )
    ).toEqual([
      {
        value: '... foobar foobar foobar foobar foobar foobar foobar '
      },
      {
        highlight: true,
        value: 'one'
      },
      {
        value: ' '
      },
      {
        highlight: true,
        value: 'two'
      },
      {
        value: 'hello hello hello hello hello hello hello ...'
      }
    ])
  })
})
