import { describe, it, expect } from 'vitest'
import { parseFileName } from '../src/utils'

describe('Utils', () => {
  describe('parseFileName()', () => {
    describe('extension', () => {
      it('parse different extensions', () => {
        expect(parseFileName('./foo.bar.baz-qux.zh-CN.js')).toEqual({
          name: 'foo.bar.baz-qux',
          locale: 'zh-CN',
          ext: '.js'
        })
        expect(parseFileName('MY_FOLDER/foo.bar.qux.mtsx')).toEqual({
          name: 'foo.bar.qux',
          locale: '',
          ext: '.mtsx'
        })
        expect(parseFileName('docs-folder/foo.bar.ba-qu.zh-CN.json5')).toEqual({
          name: 'foo.bar.ba-qu',
          locale: 'zh-CN',
          ext: '.json5'
        })
        expect(parseFileName('hello/foo.bar.ba-qu.txt')).toEqual({
          name: 'foo.bar.ba-qu',
          locale: '',
          ext: '.txt'
        })
      })

      it('parse no extension', () => {
        expect(parseFileName('bazru-RU')).toEqual({
          name: 'bazru-RU',
          locale: '',
          ext: ''
        })
      })
    })

    describe('locale', () => {
      it('with 2 letters', () => {
        expect(parseFileName('foo.ru.mdx')).toEqual({
          name: 'foo',
          locale: 'ru',
          ext: '.mdx'
        })
      })

      it('with 4 letters', () => {
        expect(parseFileName('foo.en-US.jsx')).toEqual({
          name: 'foo',
          locale: 'en-US',
          ext: '.jsx'
        })
      })

      it('not with incorrect case', () => {
        const fileNames = [
          'foo.Ru.mdx',
          'foo.rU.mdx',
          'foo.RU.mdx',

          'foo.Ru-ru.mdx',
          'foo.Ru-Ru.mdx',
          'foo.Ru-rU.mdx',
          'foo.Ru-RU.mdx',

          'foo.rU-ru.mdx',
          'foo.rU-Ru.mdx',
          'foo.rU-rU.mdx',
          'foo.rU-RU.mdx',

          'foo.RU-ru.mdx',
          'foo.RU-Ru.mdx',
          'foo.RU-rU.mdx',
          'foo.RU-RU.mdx',

          'foo.ru-ru.mdx',
          'foo.ru-Ru.mdx',
          'foo.ru-rU.mdx'
        ]

        for (const fileName of fileNames) {
          expect(parseFileName(fileName).locale).toBe('')
        }
      })

      it('not without leading dot', () => {
        expect(parseFileName('fooen-US.mdx')).toEqual({
          name: 'fooen-US',
          locale: '',
          ext: '.mdx'
        })
      })

      it('not with underscore', () => {
        expect(parseFileName('foo.en_US.mdx').locale).toBe('')
      })

      it('not for 5 letters', () => {
        expect(parseFileName('foo.en-USZ.json')).toEqual({
          name: 'foo.en-USZ',
          locale: '',
          ext: '.json'
        })
      })
    })
  })
})
