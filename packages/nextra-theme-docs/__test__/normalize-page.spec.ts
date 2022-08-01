import { describe, it, expect } from 'vitest'
import { cnPageMap, usPageMap } from './__fixture__/pageMap'
import normalizePages from '../src/utils/normalize-pages'

const defaultLocale = 'en-US'

describe('normalize-page', () => {
  it('zh-CN home', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale: locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('zh-CN getting-started', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale: locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US home', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale: locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US getting-started', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale: locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('/404 page', () => {
    const data = {
      list: [
        { name: '404', route: '/404', locale: '' },
        { name: 'get-started', route: '/get-started', locale: '' },
        { name: 'index', route: '/', locale: '' },
        {
          name: 'meta.json',
          locale: '',
          meta: {
            '404': {
              type: 'page',
              theme: {
                layout: 'full'
              }
            },
            index: {
              title: 'Introduction'
            },
            'get-started': {
              title: 'Get Started'
            }
          }
        }
      ],
      locale: 'en-US',
      defaultLocale: 'en-US',
      route: '/500ddd'
    }
    const result = normalizePages(data)
    expect(result).toMatchSnapshot()
  })

  it('/500 page', () => {
    const data = {
      list: [
        { name: '500', route: '/500', locale: '' },
        { name: 'get-started', route: '/get-started', locale: '' },
        { name: 'index', route: '/', locale: '' },
        {
          name: 'meta.json',
          locale: '',
          meta: {
            '500': {
              type: 'page',
              theme: {
                layout: 'raw'
              }
            },
            index: {
              title: 'Introduction'
            },
            'get-started': {
              title: 'Get Started'
            }
          }
        }
      ],
      locale: 'en-US',
      defaultLocale: 'en-US',
      route: '/500'
    }
    const result = normalizePages(data)
    expect(result).toMatchSnapshot()
  })
})
