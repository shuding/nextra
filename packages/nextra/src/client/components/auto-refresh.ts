/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps -- dev code will be removed from production build */
'use client'

// Based on https://www.steveruiz.me/posts/nextjs-refresh-content
// and https://github.com/gaearon/overreacted.io/pull/797
import { useRouter } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

export const AutoRefresh: FC<{ children: ReactNode }> = ({ children }) => {
  const port = process.env.NEXTRA_WS_PORT
  if (process.env.NODE_ENV === 'production' || !port) {
    return children
  }
  const router = useRouter()
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:${port}`)
    ws.onmessage = event => {
      if (event.data === 'refresh') {
        router.refresh()
      }
    }
    return () => {
      ws.close()
    }
  }, [])

  return children
}
