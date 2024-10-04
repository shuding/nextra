'use client'

import { Button } from 'nextra/components'
import { useEffect, useRef } from 'react'

export function DynamicCode({ children }) {
  const ref = useRef<HTMLDivElement>(null!)
  const tokenRef = useRef<HTMLSpanElement>()
  // Find the corresponding token from the DOM
  useEffect(() => {
    tokenRef.current = [
      // @ts-expect-error -- fixme
      ...ref.current.querySelectorAll('code > span > span')
    ].find(el => el.textContent === '1')
  }, [])
  return (
    <>
      <div ref={ref} className="_mt-6">
        {children}
      </div>
      <div className="flex mt-3 gap-3 justify-center text-sm">
        <Button
          variant="outline"
          onClick={() => {
            const token = tokenRef.current!
            const prev = token.textContent!
            token.textContent = String((+prev || 0) + 1)
          }}
        >
          Increase the number
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            tokenRef.current!.textContent = '1 + 1'
          }}
        >
          Change to `1 + 1`
        </Button>
      </div>
    </>
  )
}