import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useBlogContext } from './blog-context'

const Cusdis = dynamic(
  () => import('react-cusdis').then(mod => mod.ReactCusdis),
  { ssr: false }
)

const Comments = () => {
  const { config, opts } = useBlogContext()
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const { cusdis } = config
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  // when resolvedTheme changes, update the theme for the cusdis iframe
  useEffect(() => {
    window.CUSDIS?.setTheme(theme)
  }, [theme])

  if (!cusdis) {
    return null
  }
  if (!cusdis.appId) {
    console.warn('[nextra/cusdis] `appId` is required')
    return null
  }
  return (
    <Cusdis
      lang={cusdis.lang}
      style={{ marginTop: '4rem' }}
      attrs={{
        host: cusdis.host || 'https://cusdis.com',
        appId: cusdis.appId,
        pageId: router.pathname,
        pageTitle: opts.title,
        theme
      }}
    />
  )
}

export default Comments
