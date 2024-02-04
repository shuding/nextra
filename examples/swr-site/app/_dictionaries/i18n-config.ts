import type EnglishLocale from './en'

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'ru']
} as const

export type Locale = (typeof i18n)['locales'][number]

export type Dictionary = typeof EnglishLocale

export type Dictionaries = Record<
  Locale,
  () => Promise<{ default: Dictionary }>
>
