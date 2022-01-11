import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function locales(request: NextRequest) {
  const shouldHandleLocale =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.includes('/api/') &&
    !request.nextUrl.pathname.includes('/.nextra/')

  if (shouldHandleLocale) {
    let href = request.nextUrl.href || '/'
    if (href.endsWith('/' + request.nextUrl.locale)) href += '/'
    if (href.endsWith('/')) href += 'index'

const locale = '.' + (request.cookies['NEXT_LOCALE'] || request.nextUrl.locale)
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
