import { renderHook } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import type { Mock } from 'vitest'
import { useFSRoute } from '../hooks/use-fs-route.js'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn()
}))

function mockAndRenderHook(pathname: string) {
  ;(usePathname as Mock).mockReturnValue(pathname)
  const { result } = renderHook(useFSRoute)
  return result.current
}

describe('getFSRoute', () => {
  it('replace index', () => {
    const withIndex = mockAndRenderHook('/bar/index')
    expect(withIndex).toEqual('/bar')
  })

  it('remove trailing slash', () => {
    const value = mockAndRenderHook('/foo/')
    expect(value).toEqual('/foo')
  })

  it('should strip .html file extension', () => {
    const value = mockAndRenderHook('/foo.html')
    expect(value).toEqual('/foo')
  })

  it('should strip .html file extension and replace index', () => {
    const value = mockAndRenderHook('/foo/index.html')
    expect(value).toEqual('/foo')
  })
})
