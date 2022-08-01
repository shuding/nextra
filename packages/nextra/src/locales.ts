import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type LegacyMiddlewareCookies = { [key: string]: string }
type StableMiddlewareCookies = Map<string, string>

function getCookie(
  cookies: LegacyMiddlewareCookies | StableMiddlewareCookies,
  key: string
) {
  if (typeof cookies.get === 'function') {
    return cookies.get(key)
  }
  return (cookies as LegacyMiddlewareCookies)[key]
}

export function locales(request: NextRequest) {
  const { nextUrl } = request

  const shouldHandleLocale =
    !/^\/(api|_next)\//.test(nextUrl.pathname) &&
    !/\.(jpe?g|svg|png|webmanifest)$/.test(nextUrl.pathname) &&
    nextUrl.locale !== '' &&
    // not Server-Side Error page
    nextUrl.pathname !== '/500'

  if (!shouldHandleLocale) return

  // The locale code prefixed in the current URL, which can be empty.
  const fullUrl = nextUrl.toString()
  let localeInPath = fullUrl
    // remove host and first slash from url
    .slice(fullUrl.indexOf('//' + nextUrl.host) + nextUrl.host.length + 2)

  // remove pathname, search, and extra slashes from url
  localeInPath = localeInPath
    .replace(nextUrl.pathname + nextUrl.search, '')
    .replace('/', '')

  let finalLocale
  if (localeInPath) {
    // If a locale is explicitly set, we don't do any modifications.
    finalLocale = localeInPath
  } else {
    // If there is a locale cookie, we try to use it. If it doesn't exist or
    // it's invalid, `nextUrl.locale` will be automatically figured out by Next
    // via the `accept-languages` header.
    const clientLocale = getCookie(request.cookies, 'NEXT_LOCALE')
    if (clientLocale) {
      try {
        nextUrl.locale = clientLocale
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
  else if (pathname.endsWith('/')) pathname = pathname.slice(0, -1)

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
