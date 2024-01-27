'use client'

import Link from 'next/link'
import { useThemeConfig } from './contexts'

export function ReadMore({ route }: { route: string }) {
  const { readMore } = useThemeConfig()
  return (
    readMore && (
      <Link href={route} className="post-item-more _ml-2">
        {readMore}
      </Link>
    )
  )
}
