import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function locales(request: NextRequest) {
  const shouldHandleLocale =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.includes('/api/') &&
    !request.nextUrl.pathname.includes('/.nextra/') &&
    request.nextUrl.locale !== ''

  if (shouldHandleLocale) {
    let href = request.nextUrl.href || '/'
    if (href.endsWith('/' + request.nextUrl.locale)) href += '/'
    if (href.endsWith('/')) href += 'index'

    if (request.cookies['NEXT_LOCALE']) {
      try {
        request.nextUrl.locale = request.cookies['NEXT_LOCALE']
      } catch (err) {
        // The locale from the cookie isn't valid.
        // https://github.com/vercel/next.js/blob/e5dee17f776dcc79ebb269f7b7341fa6e2b6c3f1/packages/next/server/web/next-url.ts#L122-L129
      }
    }

    const locale = '.' + request.nextUrl.locale
    if (!href.endsWith(locale)) {
      return NextResponse.rewrite(href + locale)
    }
  }
}

export function withLocales(middleware: any) {
  return (...args: any[]) => {
    return locales(args[0]) || middleware(...args)
  }
}
