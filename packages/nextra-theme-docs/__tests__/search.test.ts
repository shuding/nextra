import nextraDataEnglish from '../../../examples/swr-site/.next/static/chunks/nextra-data-en.json'
import { getResults, loadIndexes } from '../src/components/flexsearch'

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
    it.skip('should return no results for `>  a`', () => {
      expect(getResults('>  a', LOCALE)).toEqual([])
    })

    it.skip('should return results for `showcase`', () => {
      expect(getResults('showcase', LOCALE)).not.toEqual([])
    })
  })
})
