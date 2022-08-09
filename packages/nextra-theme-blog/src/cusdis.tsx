import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import { ReactCusdis } from 'react-cusdis'
import { useBlogContext } from './blog-context'

const Cusdis = dynamic(
  () => import('react-cusdis').then(mod => mod.ReactCusdis),
  { ssr: false }
) as typeof ReactCusdis

const Comments = () => {
  const { config, opts } = useBlogContext()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  if (config.cusdis && !config.cusdis.appId) {
    console.warn('[nextra/cusdis] `appId` is required')
  }
  return config.cusdis?.appId ? (
    <Cusdis
      lang={config.cusdis.lang}
      style={{ marginTop: '4rem' }}
      attrs={{
        host: config.cusdis.host || 'https://cusdis.com',
        appId: config.cusdis.appId,
        pageId: router.pathname,
        pageTitle: opts.title,
        theme: theme === 'dark' || resolvedTheme === 'dark' ? 'dark' : 'light'
      }}
    />
  ) : null
}

export default Comments
