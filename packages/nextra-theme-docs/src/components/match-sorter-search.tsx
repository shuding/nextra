import React, { useMemo, useState, ReactElement } from 'react'
import matchSorter from 'match-sorter'
import { Item as NormalItem } from '../utils'
import { Search } from './search'

export function MatchSorterSearch({
  directories = []
}: {
  directories: NormalItem[]
}): ReactElement {
  const [search, setSearch] = useState('')
  const results = useMemo<{ route: string; title: string }[]>(
    () =>
      // Will need to scrape all the headers from each page and search through them here
      // (similar to what we already do to render the hash links in sidebar)
      // We could also try to search the entire string text from each page
      search ? matchSorter(directories, search, { keys: ['title'] }) : [],
    [search]
  )

  return (
    <Search
      loading={false}
      value={search}
      onChange={setSearch}
      className="w-full"
      results={results.map(({ route, title }, i) => {
        const highlight = title.toLowerCase().indexOf(search.toLowerCase())
        return {
          route,
          children: (
            <>
              {title.substring(0, highlight)}
              <span className="highlight">
                {title.substring(highlight, highlight + search.length)}
              </span>
              {title.substring(highlight + search.length)}
            </>
          )
        }
      })}
    />
  )
}
