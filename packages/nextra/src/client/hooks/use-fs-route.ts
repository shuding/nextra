import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE

export function useFSRoute() {
  const pathname = usePathname()

  return useMemo(
    () =>
      (defaultLocale ? '/' + pathname.split('/').slice(2).join('/') : pathname)
        .replace(/\.html$/, '')
        .replace(/\/index(\/|$)/, '$1')
        .replace(/\/$/, '') || '/',
    [pathname]
  )
}
