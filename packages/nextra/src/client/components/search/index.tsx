'use client'

import type { Document } from 'flexsearch'
import type { ReactElement, ReactNode } from 'react'
import { useCallback, useState } from 'react'
import type { SearchData } from '../../../types.js'
import type { SearchResult } from './search.js'
import { Search } from './search.js'

type SectionIndex = Document<
  {
    id: string
    url: string
    title: string
    pageId: string
    content: string
    display?: string
  },
  ['title', 'content', 'url', 'display']
>

type PageIndex = Document<
  {
    id: number
    title: string
    content: string
  },
  ['title']
>

type Result = Omit<SearchResult, 'id'> & {
  _page_rk: number
  _section_rk: number
}

// This can be global for better caching.
const indexes: {
  [locale: string]: [PageIndex, SectionIndex]
} = Object.create(null)

// Caches promises that load the index
const loadIndexesPromises = new Map<string, Promise<void>>()
const loadIndexes = (basePath: string, locale: string): Promise<void> => {
  const key = basePath + '@' + locale
  if (loadIndexesPromises.has(key)) {
    return loadIndexesPromises.get(key)!
  }
  const promise = loadIndexesImpl(basePath, locale)
  loadIndexesPromises.set(key, promise)
  return promise
}

const loadIndexesImpl = async (
  basePath: string,
  locale: string
): Promise<void> => {
  const [searchData, Document] = await Promise.all([
    fetch(`${basePath}/_next/static/chunks/nextra-data-${locale}.json`).then(
      response => response.json() as Promise<SearchData>
    ),
    import('flexsearch').then(mod => mod.default.Document)
  ])

  const pageIndex: PageIndex = new Document({
    cache: 100,
    tokenize: 'full',
    document: {
      id: 'id',
      index: 'content',
      store: ['title']
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  })

  const sectionIndex: SectionIndex = new Document({
    cache: 100,
    tokenize: 'full',
    document: {
      id: 'id',
      index: 'content',
      tag: 'pageId',
      store: ['title', 'content', 'url', 'display']
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  })

  let pageId = 0

  for (const [route, structurizedData] of Object.entries(searchData)) {
    let pageContent = ''
    ++pageId

    for (const [key, content] of Object.entries(structurizedData.data)) {
      const [headingId, headingValue] = key.split('#')
      const url = route + (headingId ? '#' + headingId : '')
      const title = headingValue || structurizedData.title
      const paragraphs = content.split('\n')

      sectionIndex.add({
        id: url,
        url,
        title,
        pageId: `page_${pageId}`,
        content: title,
        ...(paragraphs[0] && { display: paragraphs[0] })
      })

      for (let i = 0; i < paragraphs.length; i++) {
        sectionIndex.add({
          id: `${url}_${i}`,
          url,
          title,
          pageId: `page_${pageId}`,
          content: paragraphs[i]
        })
      }

      // Add the page itself.
      pageContent += ` ${title} ${content}`
    }

    pageIndex.add({
      id: pageId,
      title: structurizedData.title,
      content: pageContent
    })
  }

  indexes[locale] = [pageIndex, sectionIndex]
}

export type FlexsearchProps = {
  emptyResult?: ReactNode
  errorText?: string
  loading?: ReactNode
  placeholder?: string
  className?: string
}

export function Flexsearch(props: FlexsearchProps): ReactElement {
  const locale = 'en-US'
  const basePath = ''
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')

  const doSearch = (search: string) => {
    if (!search) {
      setResults([])
      return
    }
    const [pageIndex, sectionIndex] = indexes[locale]

    // Show the results for the top 5 pages
    const pageResults =
      pageIndex.search<true>(search, 5, {
        enrich: true,
        suggest: true
      })[0]?.result || []

    const results: Result[] = []
    const pageTitleMatches: Record<number, number> = {}

    for (let i = 0; i < pageResults.length; i++) {
      const result = pageResults[i]
      pageTitleMatches[i] = 0

      // Show the top 5 results for each page
      const sectionResults =
        sectionIndex.search<true>(search, 5, {
          enrich: true,
          suggest: true,
          tag: `page_${result.id}`
        })[0]?.result || []

      let isFirstItemOfPage = true
      const occurred: Record<string, boolean> = {}

      for (let j = 0; j < sectionResults.length; j++) {
        const { doc } = sectionResults[j]
        const isMatchingTitle = doc.display !== undefined
        if (isMatchingTitle) {
          pageTitleMatches[i]++
        }
        const { url, title } = doc
        const content = doc.display || doc.content
        if (occurred[url + '@' + content]) continue
        occurred[url + '@' + content] = true
        results.push({
          _page_rk: i,
          _section_rk: j,
          route: url,
          prefix: isFirstItemOfPage ? result.doc.title : undefined,
          title,
          content
        })
        isFirstItemOfPage = false
      }
    }

    setResults(
      results
        .sort((a, b) => {
          // Sort by number of matches in the title.
          if (a._page_rk === b._page_rk) {
            return a._section_rk - b._section_rk
          }
          if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
            return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk]
          }
          return a._page_rk - b._page_rk
        })
        .map(({ _page_rk: pageRank, _section_rk: sectionRank, ...res }) => ({
          id: `${pageRank}_${sectionRank}`,
          ...res
        }))
    )
  }

  const handleChange = useCallback(
    async (value: string) => {
      setSearch(value)
      if (!indexes[locale]) {
        setIsLoading(true)
        try {
          await loadIndexes(basePath, locale)
        } catch {
          setHasError(true)
        }
        setIsLoading(false)
      }
      doSearch(value)
    },
    [locale, basePath]
  )

  return (
    <Search
      isLoading={isLoading}
      error={hasError}
      value={search}
      onChange={handleChange}
      results={results}
      {...props}
    />
  )
}
