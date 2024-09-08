'use client'

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
      <div className="flex _text-primary-600 _underline _decoration-from-font [text-underline-position:from-font] mt-3 gap-3 justify-center">
        <button
          onClick={() => {
            const token = tokenRef.current!
            const prev = token.textContent!
            token.textContent = String(+prev + 1)
          }}
        >
          Increase the number
        </button>
        <button
          onClick={() => {
            tokenRef.current!.textContent = '1 + 1'
          }}
        >
          Change to `1 + 1`
        </button>
      </div>
    </>
  )
}
