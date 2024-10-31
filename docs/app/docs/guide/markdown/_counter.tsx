'use client'

import { FC, ReactNode, useState } from 'react'

export const Counter: FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      {children}
      {count}
    </button>
  )
}
