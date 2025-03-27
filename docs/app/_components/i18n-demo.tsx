'use client'

import { ArrowRightIcon } from '@components/icons'
import cn from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'
import styles from '../page.module.css'

const LANGUAGES = [
  { lang: 'en', name: 'English' },
  { lang: 'de', name: 'Deutsch' },
  { lang: 'ja', name: '日本語' }
]

export const I18n: FC = () => {
  const [active, setActive] = useState('')

  return (
    <div className={styles.comparison}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {LANGUAGES.map(({ lang }) => (
          <span
            key={lang}
            onPointerOver={() => setActive(lang)}
            className={cn(styles.file, active === lang && styles.active)}
          >
            /{lang}/hello.mdx
          </span>
        ))}
      </div>
      <ArrowRightIcon width="1.2em" />
      <div className="overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/20">
        {LANGUAGES.map(({ lang, name }) => (
          <div
            key={lang}
            onPointerOver={() => setActive(lang)}
            className={cn(
              'relative cursor-default select-none whitespace-nowrap px-4 py-1.5',
              active === lang
                ? 'x:text-primary-600 x:bg-primary-50 x:dark:bg-primary-500/10'
                : 'text-gray-800 dark:text-gray-100'
            )}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}
