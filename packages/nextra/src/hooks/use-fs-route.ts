import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { DEFAULT_LOCALE, ERROR_ROUTES } from '../constants'

const template = 'https://nextra.vercel.app'

export const useFSRoute = () => {
  const { locale = DEFAULT_LOCALE, asPath, route } = useRouter()

  return useMemo(() => {
    // because for the 404 route `asPath` will be redirected URL and `normalizePages` will never return correct pageItem
    const clientRoute = ERROR_ROUTES.has(route) ? route : asPath

    const { pathname } = new URL(clientRoute, template)

    const cleanedPath = locale
      ? pathname.replace(new RegExp(`\\.${locale}(\\/|$)`), '$1')
      : pathname

    return cleanedPath.replace(/\/index(\/|$)/, '$1').replace(/\/$/, '') || '/'
  }, [asPath, locale, route])
}
