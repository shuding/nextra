'use client'

import { useTransitionRouter } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { Button } from 'nextra/components'

export function GoBack() {
  const router = useTransitionRouter()
  const pathname = usePathname()

  const isNestedPage = pathname.length > 1 && pathname.split('/').length > 1
  if (!isNestedPage) return null

  return (
    <Button onClick={router.back} className="print:_hidden _underline">
      Back
    </Button>
  )
}
