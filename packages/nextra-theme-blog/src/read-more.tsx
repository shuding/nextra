'use client'

import Link from 'next/link'
import { useBlogContext } from './blog-context'

export function ReadMore({ route }: { route: string }) {
  const { config } = useBlogContext()
  return (
    config.readMore && (
      <Link href={route} className="post-item-more _ml-2">
        {config.readMore}
      </Link>
    )
  )
}
