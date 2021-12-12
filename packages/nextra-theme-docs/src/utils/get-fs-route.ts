export const getFSRoute = (asPath: string, locale: string) => {
  if (!locale) return asPath.replace(new RegExp('/index(/|$)'), '$1')

  return asPath
    .replace(new RegExp(`\.${locale}(\/|$)`), '$1')
    .replace(new RegExp('/index(/|$)'), '$1')
}
