import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { DEFAULT_LOCALE, ERROR_ROUTES } from '../constants'

const template = 'https://nextra.vercel.app'

export const useFSRoute = () => {
  const { locale = DEFAULT_LOCALE, asPath, route } = useRouter()

  return useMemo(() => {
    // asPath can return redirected url
    const clientRoute = ERROR_ROUTES.has(route) ? route : asPath

    const { pathname } = new URL(clientRoute, template)
    const cleanedPath = locale
      ? pathname.replace(new RegExp(`\\.${locale}(\\/|$)`), '$1')
      : pathname
    return cleanedPath.replace(/\/index(\/|$)/, '$1').split('#')[0] || '/'
  }, [asPath, locale, route])
}
