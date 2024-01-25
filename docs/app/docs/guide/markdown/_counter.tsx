'use client'

import { useState } from 'react'

export function Counter({ children }) {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      {children}
      {count}
    </button>
  )
}
