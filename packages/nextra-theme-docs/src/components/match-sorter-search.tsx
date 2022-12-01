import React, { useMemo, useState, ReactElement } from 'react'
import { matchSorter } from 'match-sorter'
import { Item as NormalItem } from '../utils'
import { Search } from './search'
import { HighlightMatches } from './highlight-matches'
import { SearchResult } from '../types'

export function MatchSorterSearch({
  className,
  directories = []
}: {
  className?: string
  directories: NormalItem[]
}): ReactElement {
  const [search, setSearch] = useState('')
  const results = useMemo<SearchResult[]>(
    () =>
      // Will need to scrape all the headers from each page and search through them here
      // (similar to what we already do to render the hash links in sidebar)
      // We could also try to search the entire string text from each page
      search
        ? matchSorter(directories, search, { keys: ['title'] }).map(
            ({ route, title }) => ({
              id: route + title,
              route,
              children: <HighlightMatches value={title} match={search} />
            })
          )
        : [],
    [search]
  )

  return (
    <Search
      value={search}
      onChange={setSearch}
      className={className}
      overlayClassName="nx-w-full"
      results={results}
    />
  )
}
