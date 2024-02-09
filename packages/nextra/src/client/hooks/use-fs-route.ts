import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE

export const useFSRoute = () => {
  const pathname = usePathname()

  const result = useMemo(
    () =>
      (defaultLocale ? '/' + pathname.split('/').slice(2).join('/') : pathname)
        .replace(/\.html$/, '')
        .replace(/\/index(\/|$)/, '$1')
        .replace(/\/$/, '') || '/',
    [pathname]
  )

  return result
}
