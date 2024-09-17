import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE

export function useFSRoute() {
  const pathname = usePathname()

  return useMemo(() => {
    const filtered = defaultLocale
      ? '/' + pathname.split('/').slice(2).join('/')
      : pathname
    return filtered.replace(/\/$/, '') || '/'
  }, [pathname])
}
