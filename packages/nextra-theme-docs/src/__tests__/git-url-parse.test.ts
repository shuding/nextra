import { gitUrlParse } from '../utils/git-url-parse'

describe('gitUrlParse', () => {
  it('should work', () => {
    const result = gitUrlParse(
      'https://github.com/B2o5T/graphql-eslint/tree/master/website'
    )
    expect(result).toEqual({
      href: 'https://github.com/B2o5T/graphql-eslint/tree/master/website',
      name: 'graphql-eslint',
      origin: 'https://github.com',
      owner: 'B2o5T'
    })
  })
})
