import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { useBlogContext } from './blog-context'

const Cusdis = dynamic(
  () => import('react-cusdis').then(mod => mod.ReactCusdis),
  { ssr: false }
)

function Comments({
  appId,
  host = 'https://cusdis.com',
  lang
}: {
  appId: string
  host?: string
  lang: string
}): ReactElement | null {
  const { opts } = useBlogContext()
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  // update the theme for the cusdis iframe when theme changed
  useEffect(() => {
    window.CUSDIS?.setTheme(theme)
  }, [theme])

  if (!appId) {
    console.warn('[nextra/cusdis] `appId` is required')
    return null
  }
  return (
    <Cusdis
      lang={lang}
      style={{ marginTop: '4rem' }}
      attrs={{
        host,
        appId,
        pageId: router.pathname,
        pageTitle: opts.title,
        theme
      }}
    />
  )
}

export default Comments
