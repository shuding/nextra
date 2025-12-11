import { extractKeysFromSource } from '../meta-loader.js'

describe('meta-loader', () => {
    describe('extractKeysFromSource', () => {
        it('should extract keys in source order for numeric string keys', () => {
            const source = `export default {
  '1140': '11.4.0',
  '1130': '11.3.0',
  '1120': '11.2.0',
  '1110-1112': '11.1.0 ~ 11.1.2',
  '1100': '11.0.0',
  '9190': '9.19.0',
}`
            const keys = extractKeysFromSource(source)
            expect(keys).toEqual(['1140', '1130', '1120', '1110-1112', '1100', '9190'])
        })

        it('should extract keys with double quotes', () => {
            const source = `export default {
  "foo": "Foo",
  "bar": "Bar",
  "baz": "Baz",
}`
            const keys = extractKeysFromSource(source)
            expect(keys).toEqual(['foo', 'bar', 'baz'])
        })

        it('should extract unquoted keys', () => {
            const source = `export default {
  intro: 'Introduction',
  getting_started: 'Getting Started',
  advanced: 'Advanced',
}`
            const keys = extractKeysFromSource(source)
            expect(keys).toEqual(['intro', 'getting_started', 'advanced'])
        })

        it('should handle mixed quote styles', () => {
            const source = `export default {
  'single': 'Single Quotes',
  "double": "Double Quotes",
  unquoted: 'Unquoted Key',
}`
            const keys = extractKeysFromSource(source)
            expect(keys).toEqual(['single', 'double', 'unquoted'])
        })

        it('should handle complex _meta with nested objects', () => {
            const source = `export default {
  '---': {
    type: 'separator'
  },
  qux: '',
  nextra: {
    title: 'Nextra',
    href: 'https://nextra.site'
  }
}`
            const keys = extractKeysFromSource(source)
            expect(keys).toEqual(['---', 'qux', 'nextra'])
        })

        it('should return empty array for non-export-default source', () => {
            const source = `const foo = { bar: 'baz' }`
            const keys = extractKeysFromSource(source)
            expect(keys).toEqual([])
        })

        it('should handle the querypie example from issue #4834', () => {
            const source = `export default {
  '1140': '11.4.0',
  '1130': '11.3.0',
  '1120': '11.2.0',
  '1110-1112': '11.1.0 ~ 11.1.2',
  '1100': '11.0.0',
  '1030-1034': '10.3.0 ~ 10.3.4',
  '1020-10212': '10.2.0 ~ 10.2.12',
  '1010-10111': '10.1.0 ~ 10.1.11',
  '1000-1002': '10.0.0 ~ 10.0.2',
  '9200-9202': '9.20.0 ~ 9.20.2',
  '9190': '9.19.0 ',
  '9180-9183': '9.18.0 ~ 9.18.3',
}`
            const keys = extractKeysFromSource(source)
            // These should be in the EXACT order they appear in source,
            // NOT reordered by JavaScript's numeric string key sorting
            expect(keys).toEqual([
                '1140',
                '1130',
                '1120',
                '1110-1112',
                '1100',
                '1030-1034',
                '1020-10212',
                '1010-10111',
                '1000-1002',
                '9200-9202',
                '9190',
                '9180-9183'
            ])
        })
    })
})
