'use client'

import type { FC, ReactNode } from 'react'
import { useState } from 'react'

export const Counter: FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      {children}
      {count}
    </button>
  )
}
