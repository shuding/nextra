import { describe, it, expect } from 'vitest'
import { cnPageMap, usPageMap } from './__fixture__/pageMap'
import { normalizePages } from 'nextra/normalize-pages'

const defaultLocale = 'en-US'

describe('normalize-page', () => {
  it('zh-CN home', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('zh-CN getting-started', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US home', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US getting-started', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('/404 page', () => {
    const result = normalizePages({
      list: [
        { kind: 'MdxPage', name: '404', route: '/404' },
        { kind: 'MdxPage', name: 'get-started', route: '/get-started' },
        { kind: 'MdxPage', name: 'index', route: '/' },
        {
          kind: 'Meta',
          data: {
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
    })
    expect(result).toMatchSnapshot()
  })

  it('/500 page', () => {
    const result = normalizePages({
      list: [
        { kind: 'MdxPage', name: '500', route: '/500' },
        { kind: 'MdxPage', name: 'get-started', route: '/get-started' },
        { kind: 'MdxPage', name: 'index', route: '/' },
        {
          kind: 'Meta',
          data: {
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
    })
    expect(result).toMatchSnapshot()
  })
})
