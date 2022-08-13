import React, { memo, useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import FlexSearch from 'flexsearch'
import cn from 'clsx'
import { Search } from './search'
import { DEFAULT_LOCALE } from '../constants'

const MemoedStringWithMatchHighlights = memo(
  function StringWithMatchHighlights({ content, search }) {
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
        </Fragment>,
        <span className="highlight" key={id++}>
          {splittedText.splice(0, regexp.lastIndex - match.index).join('')}
        </span>
      )
      index = regexp.lastIndex
    }

    res.push(<Fragment key={id++}>{content}</Fragment>)

    return res
  }
)

// This can be global for better caching.
const indexes = {}

export function Flexsearch() {
  const router = useRouter()
  const { locale = DEFAULT_LOCALE } = router
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!search) return
    const index = indexes[locale]
    if (!index) return

    const [pageIndex, sectionIndex] = index

    // Show the results for the top 5 pages
    const pageResults = (
      pageIndex.search(search, {
        enrich: true,
        suggest: true
      })[0]?.result || []
    ).slice(0, 5)

    const results = []

    const pageTitleMatches = {}

    for (let i = 0; i < pageResults.length; i++) {
      const result = pageResults[i]
      pageTitleMatches[i] = 0

      // Show the top 5 results for each page
      const sectionResults = (
        sectionIndex.search(search, {
          enrich: true,
          suggest: true,
          tag: 'page_' + result.id
        })[0]?.result || []
      ).slice(0, 5)

      let firstItemOfPage = true
      const occurred = {}

      for (let j = 0; j < sectionResults.length; j++) {
        const section = sectionResults[j]
        const isMatchingTitle = typeof section.doc.display !== 'undefined'
        const content = section.doc.display || section.doc.content
        const url = section.doc.url

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
            <MemoedStringWithMatchHighlights
              content={section.doc.title}
              search={search}
            />
          ),
          excerpt: content ? (
            <MemoedStringWithMatchHighlights
              content={content}
              search={search}
            />
          ) : null
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
      const data = await response.json()

      const pageIndex = new FlexSearch.Document({
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

      const sectionIndex = new FlexSearch.Document({
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
      for (let route in data) {
        let pageContent = ''
        ++pageId

        for (let heading in data[route].data) {
          const [hash, text] = heading.split('#')
          const url = route + (hash ? '#' + hash : '')
          const title = text || data[route].title

          const paragraphs = (data[route].data[heading] || '')
            .split('\n')
            .filter(Boolean)

          sectionIndex.add({
            id: url,
            url,
            title,
            pageId: `page_${pageId}`,
            content: title,
            display: paragraphs[0] || ''
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
          pageContent += ' ' + title + ' ' + (data[route].data[heading] || '')
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
            <div className="font-semibold leading-5 text-base">
              {res.title}
            </div>
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
