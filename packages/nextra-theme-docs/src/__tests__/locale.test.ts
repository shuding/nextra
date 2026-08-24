import {
  getLocaleFromPathname,
  getPathnameWithLocale
} from '../utils/locale'

describe('getLocaleFromPathname', () => {
  const locales = ['en', 'es']

  test('falls back to the default locale when the pathname has no locale prefix', () => {
    expect(getLocaleFromPathname('/docs/guide', locales, 'en')).toEqual({
      locale: 'en',
      hasPrefix: false
    })
  })

  test('uses a configured locale prefix from the pathname', () => {
    expect(getLocaleFromPathname('/es/docs/guide', locales, 'en')).toEqual({
      locale: 'es',
      hasPrefix: true
    })
  })

  test.each([
    ['/docs/guide', 'en', false, '/es/docs/guide'],
    ['/en/docs/guide', 'en', true, '/es/docs/guide'],
    ['/', 'en', false, '/es']
  ])(
    'changes %s to the target locale without malformed paths',
    (pathname, locale, hasPrefix, expected) => {
      expect(
        getPathnameWithLocale(pathname, locale, 'es', hasPrefix)
      ).toBe(expected)
    }
  )
})
