import { useRouter } from 'nextra/hooks'

export function useDraw(paths = {}, name = '') {
  const { locale, defaultLocale } = useRouter()

  if (!locale) throw new Error('locale is undefined')
  if (!defaultLocale) throw new Error('defaultLocale is undefined')

  if (!Object.hasOwn(paths, defaultLocale)) {
    throw new Error(
      `Please provide '${defaultLocale}' locale inside '${paths}'.`
    )
  }

  if (
    typeof paths[locale] === 'string' &&
    typeof paths[defaultLocale] === 'string'
  ) {
    return paths[locale] || paths[defaultLocale]
  }

  return paths[locale]?.[name] || paths[defaultLocale][name]
}
