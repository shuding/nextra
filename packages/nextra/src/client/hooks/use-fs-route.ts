import { usePathname } from 'next/navigation'

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE

export function useFSRoute() {
  const pathname = usePathname()
  return (
    (process.env.NEXTRA_SHOULD_ADD_LOCALE_TO_LINKS !== 'true' && defaultLocale
      ? '/' + pathname.split('/').slice(2).join('/')
      : pathname
    )
      .replace(/\.html$/, '')
      .replace(/\/index(\/|$)/, '$1')
      .replace(/\/$/, '') || '/'
  )
}
