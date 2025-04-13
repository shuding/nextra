import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { addBasePath } from 'next/dist/client/add-base-path'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = JSON.parse(process.env.NEXTRA_LOCALES!) as string[]

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE!

const HAS_LOCALE_RE = new RegExp(`^\\/(${locales.join('|')})(\\/|$)`)

const COOKIE_NAME = 'NEXT_LOCALE'

function getHeadersLocale(request: NextRequest): string {
  const headers = Object.fromEntries(
    // @ts-expect-error -- this works
    request.headers.entries()
  )

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers }).languages(locales)
  const locale = matchLocale(languages, locales, defaultLocale)

  return locale
}

/**
 *
 * @example
 * ```ts
 * // Basic usage
 * export { middleware } from 'nextra/locales'
 *
 * export const config = {
 *   // Matcher ignoring `/_next/` and `/api/`
 *   matcher: [
 *     '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind).*)'
 *   ]
 * }
 * ```
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = HAS_LOCALE_RE.test(pathname)
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = cookieLocale || getHeadersLocale(request)

    const url = addBasePath(`/${locale}${pathname}`)
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(url, request.url))
  }

  const [, requestLocale] = pathname.split('/', 2)

  if (requestLocale !== cookieLocale) {
    const response = NextResponse.next()
    response.cookies.set(COOKIE_NAME, requestLocale!)
    return response
  }
}
