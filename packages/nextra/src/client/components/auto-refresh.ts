'use client'

// Based on https://www.steveruiz.me/posts/nextjs-refresh-content
import { useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

export const AutoRefresh: FC<{ children: ReactNode }> = ({ children }) => {
  if (process.env.NODE_ENV === 'production') {
    return children
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- this code will be removed from production
  const router = useRouter()

  // eslint-disable-next-line react-hooks/rules-of-hooks -- this code will be removed from production
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:1337')
    ws.onmessage = event => {
      if (event.data === 'refresh') {
        router.refresh()
      }
    }
    return () => {
      ws.close()
    }
  }, [router])

  return children
}
