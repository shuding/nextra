import nextraDataEnglish from '../../../examples/swr-site/.next/static/chunks/nextra-data-en.json'
import { compileQuery, getResults, loadIndexes, scoreText, summarize } from '../src/components/flexsearch'

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

    const expectPage = (query: string, route: string) => {
      return expect(
        getResults(query, LOCALE).find(page => page.route === route)
      )
    }

    it.skip('should return no results for `>  a`', () => {
      expect(getResults('>  a', LOCALE)).toEqual([])
    })

    it('should return results for `This Is A Page`', () => {
      expectPage('This Is A Page', '/en/about/a-page').toBeDefined()
    })
  })
})

describe("compileQuery", () => {
  it("should work", () => {
    expect(compileQuery("").toString()).toEqual("/^$/")
    expect(compileQuery("one").toString()).toEqual("/(one)/gi")
    expect(compileQuery("one two").toString()).toEqual("/(one|two)/gi")
    expect(compileQuery("(one)(two)").toString()).toEqual("/(one|two)/gi")
    expect(compileQuery("a of abc").toString()).toEqual("/(abc)/gi")
  })
})

describe("scoreText", () => {
  it("should work", () => {
    const empty = compileQuery("");
    const one = compileQuery("one");
    const oneTwo = compileQuery("one two");

    expect(scoreText(empty, "")).toEqual(0);
    expect(scoreText(empty, " ")).toEqual(0);
    expect(scoreText(one, "")).toEqual(0);
    expect(scoreText(one, "one")).toEqual(1);
    expect(scoreText(one, "two")).toEqual(0);
    expect(scoreText(one, "one two")).toEqual(1);
    expect(scoreText(oneTwo, " one")).toEqual(1);
    expect(scoreText(oneTwo, "two ")).toEqual(1);
    expect(scoreText(oneTwo, "one two")).toEqual(2);
    expect(scoreText(oneTwo, "onetwo")).toEqual(2);
    expect(scoreText(oneTwo, "one two one")).toEqual(3);
    expect(scoreText(oneTwo, "one two two one" )).toEqual(4);
  });
});

describe("summarize", () => {
  it("should work", () => {
    expect(summarize("", [])).toEqual([]);
    expect(summarize("one", [])).toEqual([{value: 'one'}]);
    expect(summarize("one two", [])).toEqual([{value: 'one two'}]);
    expect(summarize("  one two ", [])).toEqual([{value: '  one two '}]);
    expect(summarize("one two", [0,3])).toEqual([
      {value: 'one', highlight: true},
      {value: ' two'},
    ]);
    expect(summarize("one two", [4,7])).toEqual([
      {value: 'one '},
      {value: 'two', highlight: true},
    ]);
    expect(summarize("one two three", [4,7])).toEqual([
      {value: 'one '},
      {value: 'two', highlight: true},
      {value: ' three'},
    ]);
    expect(summarize("one two three", [0,7])).toEqual([
      {value: 'one two', highlight: true},
      {value: ' three'},
    ]);
    expect(summarize("one two three", [8,13])).toEqual([
      {value: 'one two '},
      {value: 'three', highlight: true},
    ]);
    expect(summarize("one two three", [0,2])).toEqual([
      {value: 'on', highlight: true},
      {value: 'e two three'},
    ]);
    expect(summarize("one two three", [1,3])).toEqual([
      {value: 'o'},
      {value: 'ne', highlight: true},
      {value: ' two three'},
    ]);
    expect(summarize('a'.repeat(100) + ' one ' + 'b'.repeat(100), [101, 104])).toEqual([
      {value: '... '},
      {value: 'one', highlight: true},
      {value: ' ...'},
    ]);
    expect(summarize('a'.repeat(30) + ' zero one two ' + 'b'.repeat(57), [31, 35])).toEqual([
      {value: 'a'.repeat(30) + ' '},
      {value: 'zero', highlight: true},
      {value: ' one two ...'},
    ]);
  });
});