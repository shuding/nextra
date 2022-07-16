import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

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
  const hasEndingSlash = nextUrl.pathname.endsWith('/')
  let localeInPath = fullUrl
    .slice(fullUrl.indexOf('//' + nextUrl.host) + nextUrl.host.length + 3)
    .slice(0, -(nextUrl.pathname + nextUrl.search).length + (hasEndingSlash ? 1 : 0))

  let finalLocale

  if (localeInPath) {
    // If a locale is explicitly set, we don't do any modifications.
    finalLocale = localeInPath
  } else {
    // If there is a locale cookie, we try to use it. If it doesn't exist or
    // it's invalid, `nextUrl.locale` will be automatically figured out by Next
    // via the `accept-languages` header.
    if (request.cookies.has('NEXT_LOCALE')) {
      try {
        nextUrl.locale = request.cookies.get('NEXT_LOCALE')!
      } catch (err) {
        // The locale from the cookie isn't valid.
        // https://github.com/vercel/next.js/blob/e5dee17f776dcc79ebb269f7b7341fa6e2b6c3f1/packages/next/server/web/next-url.ts#L122-L129
      }
    }
    finalLocale = nextUrl.locale
  }

  let pathname = nextUrl.pathname
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
