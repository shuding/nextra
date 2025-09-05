'use client'

import { useEffect, useState } from 'react'

export function useCopy({
  timeout = 2000
}: {
  /** @default 2000 */
  timeout?: number
} = {}) {
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return
    const timerId = setTimeout(() => {
      setCopied(false)
    }, timeout)

    return () => {
      clearTimeout(timerId)
    }
  }, [isCopied]) // eslint-disable-line react-hooks/exhaustive-deps -- ignore timeout

  async function copy(content: string) {
    setCopied(true)
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      console.error('Failed to copy!')
    }
  }

  return {
    copy,
    isCopied
  }
}
