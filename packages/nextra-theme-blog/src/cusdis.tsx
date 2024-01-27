'use client'

import { usePathname } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { ReactCusdis } from 'react-cusdis'
import { useTheme } from './contexts'

export function Comments({
  appId,
  host = 'https://cusdis.com',
  lang
}: {
  appId: string
  host?: string
  lang: string
}): ReactElement | false {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'
  const mounted = useMounted()
  // update the theme for the cusdis iframe when theme changed
  useEffect(() => {
    try {
      window.CUSDIS?.setTheme(theme)
    } catch {}
  }, [theme])

  if (!appId) {
    console.warn('[nextra/cusdis] `appId` is required')
    return false
  }
  return (
    mounted && (
      <ReactCusdis
        lang={lang}
        style={{ marginTop: '4rem' }}
        attrs={{
          host,
          appId,
          pageId: pathname,
          pageTitle: document.title,
          theme
        }}
      />
    )
  )
}
