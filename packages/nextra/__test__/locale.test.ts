import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { next } from '../src/locales'

const i18n = {
  locales: ["en-US", "zh-CN"],
  defaultLocale: "en-US",
}

const createRequest = (url: string, localeCookie = '') => {
  return new NextRequest(url, { headers: { cookie: localeCookie }, nextConfig: { i18n } })
}

/**
 * @vitest-environment edge-runtime
 */
describe('locale process', () => {
  it('root url without locale', () => {
    const request = createRequest('http://localhost:3000')
    const result = next(request)
    expect(result.type).toBe('rewrite')
    expect(result.url?.href).toBe('http://localhost:3000/en-US/index.en-US')
  })
  it('slash root url without locale', () => {
    const request = createRequest('http://localhost:3000/')
    const result = next(request)
    expect(result.type).toBe('rewrite')
    expect(result.url?.href).toBe('http://localhost:3000/en-US/index.en-US')
  })
  it('root url with locale cookie', () => {
    const request = createRequest('http://localhost:3000', 'NEXT_LOCALE=zh-CN')
    const result = next(request)
    expect(result.type).toBe('redirect')
    expect(result.url?.href).toBe('http://localhost:3000/zh-CN/')
  })
  it('slash root url with locale cookie', () => {
    const request = createRequest('http://localhost:3000/', 'NEXT_LOCALE=zh-CN')
    const result = next(request)
    expect(result.type).toBe('redirect')
    expect(result.url?.href).toBe('http://localhost:3000/zh-CN/')
  })
  it('root url with locale', () => {
    const request = createRequest('http://localhost:3000/zh-CN')
    const result = next(request)
    expect(result.type).toBe('rewrite')
    expect(result?.url?.href).toBe('http://localhost:3000/zh-CN/index.zh-CN')
  })
  it('slash root url with locale', () => {
    const request = createRequest('http://localhost:3000/zh-CN/')
    const result = next(request)
    expect(result?.type).toBe('rewrite')
    expect(result?.url?.href).toBe('http://localhost:3000/zh-CN/index.zh-CN')
  })

  it('url without locale', () => {
    const request = createRequest('http://localhost:3000/docs/getting-started')
    const result = next(request)
    expect(result?.type).toBe('rewrite')
    expect(result?.url?.href).toBe('http://localhost:3000/en-US/docs/getting-started.en-US')
  })
  it('slash root url without locale', () => {
    const request = createRequest('http://localhost:3000/docs/getting-started/')
    const result = next(request)
    expect(result?.type).toBe('rewrite')
    expect(result?.url?.href).toBe('http://localhost:3000/en-US/docs/getting-started.en-US')
  })
  it('url with locale cookie', () => {
    const request = createRequest('http://localhost:3000', 'NEXT_LOCALE=zh-CN')
    const result = next(request)
    expect(result?.type).toBe('redirect')
    expect(result?.url?.href).toBe('http://localhost:3000/zh-CN/')
  })
  it('slash url with locale cookie', () => {
    const request = createRequest('http://localhost:3000/docs/getting-started/', 'NEXT_LOCALE=zh-CN')
    const result = next(request)
    expect(result?.type).toBe('redirect')
    expect(result?.url?.href).toBe('http://localhost:3000/zh-CN/docs/getting-started/')
  })
  it('url with locale', () => {
    const request = createRequest('http://localhost:3000/zh-CN/docs/getting-started')
    const result = next(request)
    expect(result.type).toBe('rewrite')
    expect(result.url?.href).toBe('http://localhost:3000/zh-CN/docs/getting-started.zh-CN')
  })
  it('slash root url with locale', () => {
    const request = createRequest('http://localhost:3000/zh-CN/docs/getting-started/')
    const result = next(request)
    expect(result.type).toBe('rewrite')
    expect(result.url?.href).toBe('http://localhost:3000/zh-CN/docs/getting-started.zh-CN')
  })
})