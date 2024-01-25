'use client'

import { useEffect, useRef } from 'react'

export function DynamicCode({ children }) {
  const ref = useRef<HTMLDivElement>(null)
  const tokenRef = useRef<HTMLSpanElement>()
  // Find the corresponding token from the DOM
  useEffect(() => {
    if (ref.current) {
      // @ts-expect-error -- fixme
      const token = [...ref.current.querySelectorAll('code span')].find(
        el => el.innerText === '1'
      )
      tokenRef.current = token
    }
  }, [])
  return (
    <>
      <div ref={ref} className="_mt-6">
        {children}
      </div>
      <button
        onClick={() => {
          tokenRef.current!.innerText =
            String(parseInt(tokenRef.current!.innerText) || 0) + 1
        }}
        className="_text-primary-600 _select-none _mt-6"
      >
        Increase the number
      </button>
      <button
        onClick={() => {
          tokenRef.current!.innerText = '1 + 1'
        }}
        className="_text-primary-600 _select-none _ml-2 _mt-6"
      >
        Change to `1 + 1`
      </button>
    </>
  )
}
