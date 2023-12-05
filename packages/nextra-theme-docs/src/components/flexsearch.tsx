import type { ReactElement } from 'react'
import { useState } from 'react'
import type { SearchResult } from '../types'
import { Search } from './search'

async function preload() {
  if (window.pagefind) return
  try {
    window.pagefind = await import(
      // @ts-expect-error pagefind.js generated after build
      /* webpackIgnore: true */ './pagefind/pagefind.js'
    )
  } catch {
    window.pagefind = { search: async () => ({ results: [] }) }
  }
}

export function Flexsearch({
  className
}: {
  className?: string
}): ReactElement {
  const [loading, _setLoading] = useState(false)
  const [error, _setError] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')

  async function handleSearch(newValue: string) {
    setSearch(newValue)
    const { results } = await window.pagefind.search(newValue)
    setResults(results)
  }

  return (
    <Search
      loading={loading}
      error={error}
      value={search}
      onChange={handleSearch}
      onActive={preload}
      className={className}
      overlayClassName="_w-screen _min-h-[100px] _max-w-[min(calc(100vw-2rem),calc(100%+20rem))]"
      results={results}
    />
  )
}
