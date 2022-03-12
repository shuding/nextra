export const getFSRoute = (asPath: string, locale?: string | undefined) => {
  const cleanedPath = locale
    ? asPath.replace(new RegExp(`\.${locale}(\/|$)`), '$1')
    : asPath

  return (
    cleanedPath.replace(new RegExp('/index(/|$)'), '$1').split('#')[0] || '/'
  )
}
