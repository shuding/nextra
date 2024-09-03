import { useEffect, useRef, useState } from 'react'

export function useIsWindowResizing() {
  const [isWindowResizing, setIsWindowResizing] = useState(false)
  const innerState = useRef(false)

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      if (innerState.current === false) {
        innerState.current = true
        setIsWindowResizing(true)
      }

      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        innerState.current = false
        setIsWindowResizing(false)
      }, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isWindowResizing
}
