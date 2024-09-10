'use client'

import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import type { SearchResult } from './search.js'
import { Search } from './search.js'

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

export type FlexsearchProps = {
  emptyResult?: ReactNode
  errorText?: string
  loading?: ReactNode
  placeholder?: string
  className?: string
}

export function Flexsearch(props: FlexsearchProps): ReactElement {
  const [isLoading, _setLoading] = useState(false)
  const [hasError, _setError] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')

  async function handleSearch(newValue: string) {
    setSearch(newValue)
    const { results } = await window.pagefind.search(newValue)
    setResults(results)
  }

  return (
    <Search
      isLoading={isLoading}
      error={hasError}
      value={search}
      onChange={handleSearch}
      results={results}
      {...props}
    />
  )
}
