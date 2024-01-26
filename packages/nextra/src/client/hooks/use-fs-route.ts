import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const useFSRoute = () => {
  const pathname = usePathname()

  return useMemo(
    () =>
      pathname
        .replace(/\.html$/, '')
        .replace(/\/index(\/|$)/, '$1')
        .replace(/\/$/, '') || '/',
    [pathname]
  )
}
