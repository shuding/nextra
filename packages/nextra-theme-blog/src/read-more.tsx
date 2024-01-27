'use client'

import Link from 'next/link'
import { useBlogContext } from './blog-context'

export function ReadMore({ route }: { route: string }) {
  const { readMore } = useBlogContext()
  return (
    readMore && (
      <Link href={route} className="post-item-more _ml-2">
        {readMore}
      </Link>
    )
  )
}
