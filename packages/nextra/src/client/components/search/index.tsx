'use client'

import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import type { SearchResult } from './search.js'
import { Search } from './search.js'

export type FlexsearchProps = {
  emptyResult?: ReactNode
  errorText?: string
  loading?: ReactNode
  placeholder?: string
  className?: string
}

export function Flexsearch(props: FlexsearchProps): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')

  async function handleSearch(newValue: string) {
    setSearch(newValue)
    if (!window.pagefind) {
      setIsLoading(true)
      setError(null)
      try {
        window.pagefind = await import(
          // @ts-expect-error pagefind.js generated after build
          /* webpackIgnore: true */ './pagefind/pagefind.js'
        )
      } catch (error) {
        setError(error as Error)
        setIsLoading(false)
        return
      }
    }
    const { results } = await window.pagefind.search(newValue)
    setResults(results)
    setIsLoading(false)
  }

  return (
    <Search
      isLoading={isLoading}
      error={error}
      value={search}
      onChange={handleSearch}
      results={results}
      {...props}
    />
  )
}
