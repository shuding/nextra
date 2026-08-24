export interface PathLocale {
  locale: string
  hasPrefix: boolean
}

export function getLocaleFromPathname(
  pathname: string,
  locales: readonly string[],
  fallbackLocale = locales[0] ?? ''
): PathLocale {
  const pathLocale = pathname.split('/', 2)[1]

  if (pathLocale && locales.includes(pathLocale)) {
    return { locale: pathLocale, hasPrefix: true }
  }

  return { locale: fallbackLocale, hasPrefix: false }
}

export function getPathnameWithLocale(
  pathname: string,
  locale: string,
  targetLocale: string,
  hasPrefix: boolean
): string {
  return hasPrefix
    ? pathname.replace(`/${locale}`, `/${targetLocale}`)
    : `/${targetLocale}${pathname === '/' ? '' : pathname}`
}
