import React, { memo, useState, useEffect, Fragment, ReactElement } from 'react'
import { useRouter } from 'next/router'
import FlexSearch from 'flexsearch'
import cn from 'clsx'
import { Search } from './search'
import { DEFAULT_LOCALE } from '../constants'

const MemoizedStringWithMatchHighlights = memo<{
  content: string
  search: string
  // @ts-expect-error -- Is totally valid return array of ReactElement's from component
}>(function StringWithMatchHighlights({ content, search }) {
  const splittedText = content.split('')
  const escapedSearch = search.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  const regexp = RegExp('(' + escapedSearch.replaceAll(' ', '|') + ')', 'ig')
  let match
  let id = 0
  let index = 0
  const res = []

  while ((match = regexp.exec(content)) !== null) {
    res.push(
      <Fragment key={id++}>
        {splittedText.splice(0, match.index - index).join('')}
        <span className="highlight">
          {splittedText.splice(0, regexp.lastIndex - match.index).join('')}
        </span>
      </Fragment>
    )
    index = regexp.lastIndex
  }
  res.push(<Fragment key={id++}>{splittedText.join('')}</Fragment>)

  return res
})

type SectionIndex = FlexSearch.Document<
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

type PageIndex = FlexSearch.Document<
  {
    id: number
    title: string
    content: string
  },
  ['title']
>

type Result = {
  _page_rk: number
  _section_rk: number
  first: boolean
  route: string
  page: string
  title: ReactElement
  excerpt: ReactElement | null
}

type NextraData = {
  [route: string]: {
    title: string
    data: Record<string, string>
  }
}

// This can be global for better caching.
const indexes: Record<string, [PageIndex, SectionIndex]> = {}

export function Flexsearch() {
  const router = useRouter()
  const { locale = DEFAULT_LOCALE } = router
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    if (!search) return
    const index = indexes[locale]
    if (!index) return

    const [pageIndex, sectionIndex] = index

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
          tag: 'page_' + result.id
        })[0]?.result || []

      let firstItemOfPage = true
      const occurred: Record<string, boolean> = {}

      for (let j = 0; j < sectionResults.length; j++) {
        const { doc } = sectionResults[j]
        const isMatchingTitle = doc.display !== undefined
        const content = doc.display || doc.content
        const { url, title } = doc
        if (isMatchingTitle) {
          pageTitleMatches[i]++
        }

        if (occurred[url + '@' + content]) continue
        occurred[url + '@' + content] = true

        results.push({
          _page_rk: i,
          _section_rk: j,
          first: firstItemOfPage,
          route: url,
          page: result.doc.title,
          title: (
            <MemoizedStringWithMatchHighlights
              content={title}
              search={search}
            />
          ),
          excerpt: (
            <MemoizedStringWithMatchHighlights
              content={content}
              search={search}
            />
          )
        })

        firstItemOfPage = false
      }
    }

    setResults(
      results.sort((a, b) => {
        // Sort by number of matches in the title.
        if (a._page_rk === b._page_rk) {
          return a._section_rk - b._section_rk
        }
        if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
          return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk]
        }
        return a._page_rk - b._page_rk
      })
    )
  }, [search])

  const load = async () => {
    if (!indexes[locale] && !loading) {
      setLoading(true)
      const response = await fetch(
        `${router.basePath}/_next/static/chunks/nextra-data-${locale}.json`
      )
      const data = (await response.json()) as NextraData

      const pageIndex: PageIndex = new FlexSearch.Document({
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

      const sectionIndex: SectionIndex = new FlexSearch.Document({
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
      for (const route in data) {
        let pageContent = ''
        ++pageId

        for (const heading in data[route].data) {
          const [hash, text] = heading.split('#')
          const url = route + (hash ? '#' + hash : '')
          const title = text || data[route].title

          const content = data[route].data[heading] || ''
          const paragraphs = content.split('\n').filter(Boolean)

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
              id: url + '_' + i,
              url,
              title,
              pageId: `page_${pageId}`,
              content: paragraphs[i]
            })
          }

          // Add the page itself.
          pageContent += ' ' + title + ' ' + content
        }

        pageIndex.add({
          id: pageId,
          title: data[route].title,
          content: pageContent
        })
      }

      indexes[locale] = [pageIndex, sectionIndex]

      setLoading(false)
      setSearch(s => (s ? s + ' ' : s)) // Trigger the effect
    }
  }

  return (
    <Search
      load={load}
      loading={loading}
      value={search}
      onChange={setSearch}
      className="w-screen max-w-[min(calc(100vw-2rem),calc(100%+20rem))]"
      results={results.map(res => ({
        route: res.route,
        prefix: (
          <>
            {res.first ? (
              <div
                className={cn(
                  'border-b border-black/10 dark:border-white/20 mx-2.5 mb-2 mt-6 select-none px-2.5 pb-1.5 text-xs font-semibold uppercase text-gray-500 first:mt-0 dark:text-gray-300',
                  'contrast-more:border-gray-600 contrast-more:text-gray-900 contrast-more:dark:border-gray-50 contrast-more:dark:text-gray-50'
                )}
              >
                {res.page}
              </div>
            ) : null}
          </>
        ),
        children: (
          <>
            <div className="font-semibold leading-5 text-base">{res.title}</div>
            {res.excerpt ? (
              <div className="excerpt mt-1 text-sm leading-[1.35rem] text-gray-600 dark:text-gray-400">
                {res.excerpt}
              </div>
            ) : null}
          </>
        )
      }))}
    />
  )
}
