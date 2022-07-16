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

type NextResult = { type: 'next', url: undefined } | { type: 'rewrite', url: URL } | { type: 'redirect', url: URL }

export function next(request: NextRequest): NextResult {
  const { nextUrl } = request

  const shouldHandleLocale =
    !PUBLIC_FILE.test(nextUrl.pathname) &&
    !nextUrl.pathname.includes('/api/') &&
    !nextUrl.pathname.includes('/_next/') &&
    nextUrl.locale !== ''

  if (!shouldHandleLocale) return {
    type: 'next',
    url: undefined
  }

  // The locale code prefixed in the current URL, which can be empty.
  const fullUrl = nextUrl.toString()
  const localeInPath = fullUrl
    .slice(fullUrl.indexOf("//" + nextUrl.host) + nextUrl.host.length + 2)
    .replace(nextUrl.pathname + nextUrl.search, "");

  let finalLocale;
  if (localeInPath) {
    finalLocale = localeInPath.replace("/", "");
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
      return {
        type: 'redirect',
        url: new URL(
          '/' + finalLocale + nextUrl.pathname + nextUrl.search,
          request.url
        )
      }
    }
  }
  let pathname = nextUrl.pathname || '/'
  if (pathname === '/') pathname += 'index'
  // If we are not showing the correct localed page, rewrite the current request.
  if (!pathname.endsWith('.' + finalLocale)) {
    const originHref = finalLocale + pathname
    const href = originHref.endsWith('/') ? originHref.slice(0, -1) : originHref
    return {
      type: 'rewrite',
      url: new URL(
        '/' + href + '.' + finalLocale + nextUrl.search,
        request.url
      )
    }
  }
  return {
    type: 'next',
    url: undefined
  }
}

export function locales(request: NextRequest) {
  const result = next(request)
  if (result.type === 'next') {
    return
  }
  return NextResponse[result.type](result.url)
}

export function withLocales(middleware: any) {
  return (...args: any[]) => {
    return locales(args[0]) || middleware(...args)
  }
}
