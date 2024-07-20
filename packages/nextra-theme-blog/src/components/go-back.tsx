'use client'

import { usePathname, useRouter } from 'next/navigation'

export function GoBack() {
  const router = useRouter()
  const pathname = usePathname()

  const isNestedPage = pathname.length > 1 && pathname.split('/').length > 1
  if (!isNestedPage) return null

  return (
    <button onClick={router.back} className="print:_hidden _underline">
      Back
    </button>
  )
}
