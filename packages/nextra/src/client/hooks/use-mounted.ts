'use client'

import { useEffect, useState } from 'react'

export function useMounted(): boolean {
  'use no memo' // don't need to memoize boolean value
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
