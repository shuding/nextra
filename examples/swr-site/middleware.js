import { locales } from 'nextra/locales'

export const middleware = request => {
  const { nextUrl } = request

  if (nextUrl.pathname.startsWith('/remote/')) {
    // The middleware must not handle dynamic routes.
    return
  }

  return locales(request)
}
