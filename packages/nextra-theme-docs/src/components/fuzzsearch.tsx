import type { ReactElement, ReactNode } from 'react'
import { Searcher } from 'fast-fuzzy'
import { useState, useCallback, useTransition, useMemo } from 'react'
import { useRouter } from 'next/router'
import cn from 'clsx'
import { Search } from './search'
import { HighlightMatches } from './highlight-matches'
import { DEFAULT_LOCALE } from '../constants'
import type { SearchResult } from '../types'

const RESULT_PAGE_SIZE = 10
const RESULT_SECTION_SIZE = 3

type Result = {
  route: string
  prefix: ReactNode
  children: ReactNode
}

type NextraData = {
  [route: string]: {
    title: string
    data: {
      [slugAndHeading: string]: string
    }
  }
}

type PageSearchItem = {
  route: string
  title: string
  sectionTitles: string[]
  content: string
  weight: number
  data: any
}

type SectionSearchItem = {
  pageRoute: string
  route: string
  title: string
  content: string
}

// This can be global for better caching.
const indexes: {
  [locale: string]: [
    Searcher<PageSearchItem, any>,
    Searcher<SectionSearchItem, any>
  ]
} = {}

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
  const response = await fetch(
    `${basePath}/_next/static/chunks/nextra-data-${locale}.json`
  )

  const data = (await response.json()) as NextraData

  const pageSearcher = new Searcher<PageSearchItem, any>([], {
    keySelector: (item: PageSearchItem) => [
      item.title,
      item.content,
      ...item.sectionTitles
    ]
  })
  const sectionSearcher = new Searcher<SectionSearchItem, any>([], {
    keySelector: (item: SectionSearchItem) => [item.title, item.content]
  })

  for (const route in data) {
    let pageContent = ''
    const sectionTitles = []

    const page = data[route]
    for (const heading in page.data) {
      const [hash, text] = heading.split('#')
      const title = text || page.title || ''
      const sectionRoute = route + (hash ? '#' + hash : '')
      const content = page.data[heading] || ''

      sectionSearcher.add({
        pageRoute: route,
        route: sectionRoute,
        title,
        content
      })

      sectionTitles.push(title)

      // Add the page itself.
      pageContent += ` ${title} ${content}`
    }

    pageSearcher.add({
      route,
      sectionTitles,
      title: data[route].title || '',
      content: pageContent,
      weight: 1,
      data: data[route].data
    })
  }

  indexes[locale] = [pageSearcher, sectionSearcher]
}

export function Fuzzsearch({
  className
}: {
  className?: string
}): ReactElement {
  const { locale = DEFAULT_LOCALE, basePath } = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [value, setValue] = useState('')

  const results = useMemo(() => {
    if (!search || !indexes[locale]) return []
    const [pageSearcher, sectionSearcher] = indexes[locale]

    // Show the results for the top 10 pages
    const pageResults = pageSearcher
      .search(search, {
        returnMatchData: true,
        threshold: 0.8
      })
      .map((r, index) => {
        return {
          item: r.item,
          score: r.score * r.item.weight,
          index: index
        }
      })
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score
        return a.index - b.index
      })
      .slice(0, RESULT_PAGE_SIZE)

    const pageRank: Record<string, number> = {}
    const pageTitle: Record<string, string> = {}
    for (let i = 0; i < pageResults.length; i++) {
      pageRank[pageResults[i].item.route] = i
      pageTitle[pageResults[i].item.route] = pageResults[i].item.title
    }

    const results: Result[] = []
    const sectionResults = sectionSearcher
      .search(search, {
        returnMatchData: true,
        threshold: 0.9
      })
      .sort((a, b) => {
        const pageRankA = pageRank[a.item.pageRoute]
        const pageRankB = pageRank[b.item.pageRoute]
        if (pageRankA !== pageRankB) return pageRankA - pageRankB
        return b.score - a.score
      })

    let sectionsForCurrentPage = 0
    let previousPageRoute = ''
    for (let i = 0; i < sectionResults.length; i++) {
      const { item } = sectionResults[i]
      const { pageRoute, route, title, content } = item
      if (pageRoute === previousPageRoute) {
        sectionsForCurrentPage++
      } else {
        sectionsForCurrentPage = 1
      }
      if (sectionsForCurrentPage > RESULT_SECTION_SIZE) continue
      if (pageRank[pageRoute] === undefined) continue

      previousPageRoute = pageRoute
      const isFirstItemForPage = sectionsForCurrentPage === 1

      results.push({
        route,
        prefix: isFirstItemForPage && (
          <div
            className={cn(
              'nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300',
              'contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50'
            )}
          >
            {pageTitle[pageRoute]}
          </div>
        ),
        children: (
          <>
            <div className="nx-text-base nx-font-semibold nx-leading-5">
              <HighlightMatches match={search} value={title} />
            </div>
            {content && (
              <div className="nextra-excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50">
                <HighlightMatches match={search} value={content} />
              </div>
            )}
          </>
        )
      })
    }

    return results.map((res, i) => ({
      id: `${i}_${res.route}`,
      route: res.route,
      prefix: res.prefix,
      children: res.children
    }))
  }, [search, !!indexes[locale]])

  const preload = useCallback(
    async (active: boolean) => {
      if (active && !indexes[locale]) {
        setLoading(true)
        try {
          await loadIndexes(basePath, locale)
        } catch (e) {
          setError(true)
        }
        setLoading(false)
      }
    },
    [locale, basePath]
  )

  const [isPending, startTransition] = useTransition()

  const handleChange = async (value: string) => {
    setValue(value)
    startTransition(() => {
      setSearch(value)
    })
    if (!loading) {
      if (!indexes[locale]) {
        setLoading(true)
        try {
          await loadIndexes(basePath, locale)
        } catch (e) {
          setError(true)
        }
        setLoading(false)
      }
    }
  }

  return (
    <Search
      loading={loading || (isPending && results.length === 0)}
      error={error}
      value={value}
      onChange={handleChange}
      onActive={preload}
      className={className}
      overlayClassName="nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]"
      results={results}
    />
  )
}
