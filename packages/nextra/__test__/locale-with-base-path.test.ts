// Next.js' `addBasePath`, `hasBasePath` and `removeBasePath` functions depend
// on `__NEXT_ROUTER_BASEPATH` environment variable that must be set before
// importing middleware
process.env.__NEXT_ROUTER_BASEPATH = '/testBasePath'
import { locales as originalLocales } from '../src/locales'
import { describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
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
describe('basePath', () => {
  // Next.js' `addLocale` and `removeLocale` functions depend on `__NEXT_I18N_SUPPORT`
  process.env.__NEXT_I18N_SUPPORT = 'true'

  it('should rewrite basePath', () => {
    const request = createRequest(
      'http://localhost:3000/zh-CN/docs/getting-started'
    )
    const result = locales(request)
    expect(result.type).toBe('rewrite')
    expect(result.url.href).toBe(
      'http://localhost:3000/testBasePath/zh-CN/docs/getting-started.zh-CN'
    )
  })

  it('should redirect with basePath', () => {
    const request = createRequest('http://localhost:3000', 'NEXT_LOCALE=zh-CN')
    const result = locales(request)
    expect(result.type).toBe('redirect')
    expect(result.url.href).toBe('http://localhost:3000/testBasePath/zh-CN')
  })
})
