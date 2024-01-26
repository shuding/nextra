import { addBasePath } from 'next/dist/client/add-base-path'
import { usePathname } from 'next/navigation'
import { GlobeIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useThemeConfig } from '../contexts'
import { Select } from './select'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

interface LocaleSwitchProps {
  lite?: boolean
  className?: string
}

export function LocaleSwitch({
  lite,
  className
}: LocaleSwitchProps): ReactElement | null {
  const themeConfig = useThemeConfig()
  const pathname = usePathname()
  const locale = ''

  const options = themeConfig.i18n
  if (!options.length) return null

  const selected = options.find(l => locale === l.locale)
  return (
    <Select
      title="Change language"
      className={className}
      onChange={option => {
        const date = new Date(Date.now() + ONE_YEAR)
        document.cookie = `NEXT_LOCALE=${
          option.key
        }; expires=${date.toUTCString()}; path=/`
        const href = addBasePath(pathname.replace(`/${locale}`, `/${option.key}`))
        location.href = href
      }}
      selected={{
        key: selected?.locale || '',
        name: (
          <span className="_flex _items-center _gap-2">
            <GlobeIcon />
            <span className={lite ? '_hidden' : ''}>{selected?.name}</span>
          </span>
        )
      }}
      options={options.map(l => ({
        key: l.locale,
        name: l.name
      }))}
    />
  )
}
