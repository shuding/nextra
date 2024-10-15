'use client'

import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import type { ReactElement } from 'react'
import { useEffect } from 'react'

export function Comments({
  appId,
  host = 'https://cusdis.com'
}: {
  appId: string
  host?: string
}): ReactElement | null {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'
  const mounted = useMounted()

  useEffect(() => {
    try {
      // update the theme for the cusdis iframe when theme changed
      window.CUSDIS?.setTheme(theme)
    } catch (error) {
      console.error(error)
    }
  }, [theme])

  if (!appId) {
    console.warn('[nextra/cusdis] `appId` is required')
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
      data-page-title={mounted && document.title}
    >
      {mounted && <script async src="https://cusdis.com/js/cusdis.es.js" />}
    </div>
  )
}
