'use client'

// don't need to memoize string `hash` value
'use no memo'

import { useEffect, useState } from 'react'

export function useHash() {
  const [hash, setHash] = useState('')

  useEffect(() => {
    function handleHashChange() {
      setHash(location.hash.replace('#', ''))
    }
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return hash
}
