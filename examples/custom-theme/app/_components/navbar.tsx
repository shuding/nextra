'use client'

import { usePathname } from 'next/navigation'
import type { PageMapItem } from 'nextra'
import { Anchor } from 'nextra/components'
import { normalizePages } from 'nextra/normalize-pages'
import type { FC } from 'react'

export const Navbar: FC<{ pageMap: PageMapItem[] }> = ({ pageMap }) => {
  const pathname = usePathname()
  const { topLevelNavbarItems } = normalizePages({
    list: pageMap,
    route: pathname
  })

  return (
    <ul
      style={{
        display: 'flex',
        listStyleType: 'none',
        padding: 20,
        gap: 20,
        background: 'lightcoral',
        margin: 0
      }}
    >
      {topLevelNavbarItems.map(item => {
        const route = item.route || ('href' in item ? item.href! : '')
        return (
          <li key={route}>
            <Anchor href={route} style={{ textDecoration: 'none' }}>
              {item.title}
            </Anchor>
          </li>
        )
      })}
    </ul>
  )
}
