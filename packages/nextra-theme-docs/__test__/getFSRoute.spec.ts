import { describe, it, expect } from 'vitest'
import { getFSRoute } from '../src/utils'

describe('getFSRoute', () => {
  it('replace locale', () => {
    const withLocale = getFSRoute('/getting-started.en-US', 'en-US')
    expect(withLocale).toEqual('/getting-started')
  })
  it('replace index', () => {
    const withIndex = getFSRoute('/getting-started/index')
    expect(withIndex).toEqual('/getting-started')
    const withIndexAndLocale = getFSRoute('/getting-started/index')
    expect(withIndexAndLocale).toEqual('/getting-started')
  })
  it('ignore query', () => {
    const withQuery = getFSRoute('/getting-started?query=1')
    expect(withQuery).toEqual('/getting-started')

    const withQueryLocale = getFSRoute(
      '/getting-started.en-US?query=1',
      'en-US'
    )
    expect(withQueryLocale).toEqual('/getting-started')

    const withIndexLocaleQuery = getFSRoute(
      '/getting-started/index.en-US?query=1',
      'en-US'
    )
    expect(withIndexLocaleQuery).toEqual('/getting-started')
  })
})
