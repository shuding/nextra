import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { DEFAULT_LOCALE, ERROR_ROUTES } from '../../constants.js'

const template = 'https://nextra.site'

export const useFSRoute = () => {
  const pathname = usePathname()

  return useMemo(() => {
    // because for the 404 route `asPath` will be redirected URL and `normalizePages` will never return correct pageItem
    // const clientRoute = ERROR_ROUTES.has(route) ? route : asPath

    // const { pathname } = new URL(clientRoute, template)

    // const cleanedPath = locale
    //   ? pathname.replace(new RegExp(`\\.${locale}(\\/|$)`), '$1')
    //   : pathname

    return (
      pathname
        .replace(/\.html$/, '')
        .replace(/\/index(\/|$)/, '$1')
        .replace(/\/$/, '') || '/'
    )
  }, [
    // asPath, locale, route
    pathname
  ])
}
