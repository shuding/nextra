'use client'

import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'

export function GoBack(props: ComponentProps<'button'>) {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} {...props}>
      Back
    </button>
  )
}
