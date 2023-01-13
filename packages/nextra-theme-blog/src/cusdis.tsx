import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ReactCusdis } from 'react-cusdis'
import { useBlogContext } from './blog-context'

const Cusdis = dynamic(
  () => import('react-cusdis').then(mod => mod.ReactCusdis),
  { ssr: false }
) as typeof ReactCusdis

const Comments = () => {
  const { config, opts } = useBlogContext()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { cusdis } = config
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
        theme: resolvedTheme === 'dark' ? 'dark' : 'light'
      }}
    />
  )
}

export default Comments
