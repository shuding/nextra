'use client'

import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import type { FC } from 'react'
import { useEffect } from 'react'

export const Comments: FC<{
  appId: string
  host?: string
}> = ({ appId, host = 'https://cusdis.com' }) => {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  useEffect(() => {
    try {
      // update the theme for the cusdis iframe when theme changed
      if (window.CUSDIS) {
        // window.CUSDIS? doesn't work with react-compiler
        window.CUSDIS.setTheme(resolvedTheme as 'dark' | 'light')
      }
    } catch (error) {
      console.error(error)
    }
  }, [resolvedTheme])

  if (!appId) {
    console.warn('[nextra/cusdis] `appId` is required')
    return null
  }
  if (!mounted) {
    return null
  }

  return (
    <div
      style={{ marginTop: '4rem' }}
      id="cusdis_thread"
      data-host={host}
      data-app-id={appId}
      data-page-id={pathname}
      data-page-url={pathname}
      data-page-title={document.title}
      data-theme={resolvedTheme}
    >
      <script async src="https://cusdis.com/js/cusdis.es.js" />
    </div>
  )
}
