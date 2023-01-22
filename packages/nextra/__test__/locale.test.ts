import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { locales as originalLocales } from '../src/locales'
import type NextServer from 'next/server'

vi.mock('next/server', async () => {
  const mod = await vi.importActual<typeof NextServer>('next/server')
  return {
    ...mod,
    NextResponse: {
      redirect: (url: string) => ({ url, type: 'redirect' }),
      rewrite: (url: string) => ({ url, type: 'rewrite' })
    }
  }
})

const locales = originalLocales as unknown as (req: NextRequest) => {
  type: string
  url: URL
}

const createRequest = (url: string, localeCookie = '') => {
  return new NextRequest(url, {
    headers: { cookie: localeCookie },
    nextConfig: {
      i18n: {
        locales: ['en-US', 'zh-CN'],
        defaultLocale: 'en-US'
      }
    }
  })
}

/**
 * @vitest-environment edge-runtime
 */
describe('locale process', () => {
  // Next.js' `addLocale` and `removeLocale` functions depend on `__NEXT_I18N_SUPPORT`
  process.env.__NEXT_I18N_SUPPORT = 'true'

  it('root url without locale', () => {
    const request = createRequest('http://localhost:3000')
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe('http://localhost:3000/index.en-US')
  })
  it('slash root url without locale', () => {
    const request = createRequest('http://localhost:3000/')
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe('http://localhost:3000/index.en-US')
  })
  it('root url with locale cookie', () => {
    const request = createRequest('http://localhost:3000', 'NEXT_LOCALE=zh-CN')
    const result = locales(request)
    expect(result.type).toBe('redirect')
    expect(result.url.href).toBe('http://localhost:3000/zh-CN')
  })
  it('slash root url with locale cookie', () => {
    const request = createRequest('http://localhost:3000/', 'NEXT_LOCALE=zh-CN')
    const result = locales(request)
    expect(result.type).toBe('redirect')
    expect(result.url.href).toBe('http://localhost:3000/zh-CN')
  })
  it('root url with locale', () => {
    const request = createRequest('http://localhost:3000/zh-CN')
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result?.url.href).toBe('http://localhost:3000/zh-CN/index.zh-CN')
  })
  it('slash root url with locale', () => {
    const request = createRequest('http://localhost:3000/zh-CN/')
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe('http://localhost:3000/zh-CN/index.zh-CN')
  })
  it('url without locale', () => {
    const request = createRequest('http://localhost:3000/docs/getting-started')
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe(
      'http://localhost:3000/docs/getting-started.en-US'
    )
  })
  it('slash url without locale', () => {
    const request = createRequest('http://localhost:3000/docs/getting-started/')
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe(
      'http://localhost:3000/docs/getting-started.en-US'
    )
  })
  it('url with locale cookie', () => {
    const request = createRequest('http://localhost:3000', 'NEXT_LOCALE=zh-CN')
    const result = locales(request)
    expect(result.type).toBe('redirect')
    expect(result.url.href).toBe('http://localhost:3000/zh-CN')
  })
  it('slash url with locale cookie', () => {
    const request = createRequest(
      'http://localhost:3000/docs/getting-started/',
      'NEXT_LOCALE=zh-CN'
    )
    const result = locales(request)
    expect(result.type).toBe('redirect')
    expect(result.url.href).toBe(
      'http://localhost:3000/zh-CN/docs/getting-started'
    )
  })
  it('url with locale', () => {
    const request = createRequest(
      'http://localhost:3000/zh-CN/docs/getting-started'
    )
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe(
      'http://localhost:3000/zh-CN/docs/getting-started.zh-CN'
    )
  })
  it('slash url with locale', () => {
    const request = createRequest(
      'http://localhost:3000/zh-CN/docs/getting-started/'
    )
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe(
      'http://localhost:3000/zh-CN/docs/getting-started.zh-CN'
    )
  })
})
