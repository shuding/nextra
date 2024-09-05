import { useEffect, useRef, useState } from 'react'

export function useIsWindowResizing() {
  const [isWindowResizing, setIsWindowResizing] = useState(false)
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const handleResize = () => {
      if (!resizeTimerRef.current) {
        setIsWindowResizing(true)
      }

      clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => {
        resizeTimerRef.current = undefined
        setIsWindowResizing(false)
      }, 200)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(resizeTimerRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isWindowResizing
}
