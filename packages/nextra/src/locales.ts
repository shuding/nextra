import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

type LegacyMiddlewareCookies = { [key: string]: string }
type StableMiddlewareCookies = Map<string, string>
function getCookie(cookies: LegacyMiddlewareCookies | StableMiddlewareCookies, key: string) {
  if (typeof cookies.get === 'function') {
    return cookies.get(key)
  }
  return (cookies as LegacyMiddlewareCookies)[key]
}

export function locales(request: NextRequest) {
  const { nextUrl } = request

  const shouldHandleLocale =
    !PUBLIC_FILE.test(nextUrl.pathname) &&
    !nextUrl.pathname.includes('/api/') &&
    !nextUrl.pathname.includes('/_next/') &&
    nextUrl.locale !== ''

  if (!shouldHandleLocale) return

  // The locale code prefixed in the current URL, which can be empty.
  const fullUrl = nextUrl.toString()
  let localeInPath = fullUrl
    // remove host from url
    .slice(fullUrl.indexOf('//' + nextUrl.host) + nextUrl.host.length + 3)

  // remove pathname and search from url
  const firstSlashIndex = localeInPath.indexOf('/')
  if (firstSlashIndex !== -1) {
    localeInPath = localeInPath.slice(0, firstSlashIndex)
  }

  let finalLocale

  if (localeInPath) {
    // If a locale is explicitly set, we don't do any modifications.
    finalLocale = localeInPath
  } else {
    // If there is a locale cookie, we try to use it. If it doesn't exist or
    // it's invalid, `nextUrl.locale` will be automatically figured out by Next
    // via the `accept-languages` header.
    if (getCookie(request.cookies, 'NEXT_LOCALE')) {
      try {
        nextUrl.locale = getCookie(request.cookies, 'NEXT_LOCALE')!
      } catch (err) {
        // The locale from the cookie isn't valid.
        // https://github.com/vercel/next.js/blob/e5dee17f776dcc79ebb269f7b7341fa6e2b6c3f1/packages/next/server/web/next-url.ts#L122-L129
      }
    }
    finalLocale = nextUrl.locale

    // Now we want to display the locale. If it's not the default one, we have
    // to prefix the URL with that locale since it's missing. Only the default
    // locale can be missing from there for consistency.
    if (finalLocale !== nextUrl.defaultLocale) {
      return NextResponse.redirect(
        new URL(
          '/' + finalLocale + nextUrl.pathname + nextUrl.search,
          request.url
        )
      )
    }
  }

  let pathname = nextUrl.pathname || '/'
  if (pathname === '/') pathname += 'index'
  // If we are not showing the correct localed page, rewrite the current request.
  if (!pathname.endsWith('.' + finalLocale)) {
    return NextResponse.rewrite(
      new URL(
        '/' + finalLocale + pathname + '.' + finalLocale + nextUrl.search,
        request.url
      )
    )
  }
}

export function withLocales(middleware: any) {
  return (...args: any[]) => {
    return locales(args[0]) || middleware(...args)
  }
}
