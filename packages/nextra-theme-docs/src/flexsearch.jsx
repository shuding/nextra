import React, {
  memo,
  useCallback,
  useRef,
  useState,
  useEffect,
  Fragment
} from 'react'
import Router, { useRouter } from 'next/router'
import cn from 'classnames'
import Link from 'next/link'
import FlexSearch from 'flexsearch'
import { Transition } from '@headlessui/react'

import { useConfig } from './config'
import renderComponent from './utils/render-component'
import useMenuContext from './utils/menu-context'
import { SpinnerIcon } from 'nextra/icons'

const Item = ({
  page,
  first,
  title,
  active,
  href,
  onHover,
  onClick,
  excerpt
}) => {
  return (
    <>
      {first ? (
        <div className="nextra-search-section mx-2.5 px-2.5 pb-1.5 mb-2 mt-6 first:mt-0 font-semibold uppercase text-xs text-gray-500 select-none dark:text-gray-300">
          {page}
        </div>
      ) : null}
      <Link href={Router.basePath + href}>
        <a
          className="block no-underline"
          onMouseMove={onHover}
          onClick={onClick}
        >
          <li className={cn({ active })}>
            <div className="font-semibold dark:text-white leading-5">
              {title}
            </div>
            {excerpt ? (
              <div className="excerpt mt-1 text-gray-600 text-sm leading-[1.35rem] dark:text-gray-400">
                {excerpt}
              </div>
            ) : null}
          </li>
        </a>
      </Link>
    </>
  )
}

const MemoedStringWithMatchHighlights = memo(
  function StringWithMatchHighlights({ content, search }) {
    const splittedText = content.split('')
    const escapedSearch = search.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    const regexp = RegExp('(' + escapedSearch.split(' ').join('|') + ')', 'ig')
    let match
    let id = 0
    let index = 0
    const res = []

    while ((match = regexp.exec(content)) !== null) {
      res.push(
        <Fragment key={id++}>
          {splittedText.splice(0, match.index - index).join('')}
        </Fragment>
      )
      res.push(
        <span className="highlight" key={id++}>
          {splittedText.splice(0, regexp.lastIndex - match.index).join('')}
        </span>
      )
      index = regexp.lastIndex
    }

    res.push(<Fragment key={id++}>{splittedText.join('')}</Fragment>)

    return res
  }
)

// This can be global for better caching.
const indexes = {}

export default function Search() {
  const config = useConfig()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(0)
  const [results, setResults] = useState([])
  const input = useRef(null)
  const { setMenu } = useMenuContext()

  const finishSearch = () => {
    if (input.current) {
      input.current.value = ''
      input.current.blur()
    }
    setSearch('')
    setShow(false)
    setMenu(false)
  }

  const doSearch = () => {
    if (!search) return

    const localeCode = Router.locale || 'default'
    const index = indexes[localeCode]

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
  }
  useEffect(doSearch, [search])

  const handleKeyDown = useCallback(
    e => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (active + 1 < results.length) {
            setActive(active + 1)
            const activeElement = document.querySelector(
              `.nextra-flexsearch ul > a:nth-of-type(${active + 2})`
            )
            if (activeElement && activeElement.scrollIntoView) {
              activeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
              })
            }
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (active - 1 >= 0) {
            setActive(active - 1)
            const activeElement = document.querySelector(
              `.nextra-flexsearch ul > a:nth-of-type(${active})`
            )
            if (activeElement && activeElement.scrollIntoView) {
              activeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
              })
            }
          }
          break
        }
        case 'Enter': {
          router.push(results[active].route)
          finishSearch()
          break
        }
        case 'Escape': {
          setShow(false)
          input.current.blur()
          break
        }
      }
    },
    [active, results, router]
  )

  const load = async () => {
    const localeCode = Router.locale || 'default'
    if (!indexes[localeCode] && !loading) {
      setLoading(true)
      const response = await fetch(
        `${Router.basePath}/_next/static/chunks/nextra-data-${localeCode}.json`
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

      indexes[localeCode] = [pageIndex, sectionIndex]

      setLoading(false)
      setSearch(s => (s ? s + ' ' : s)) // Trigger the effect
    }
  }

  useEffect(() => {
    setActive(0)
  }, [search])

  useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea']

    const down = e => {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase()) === -1
      ) {
        if (e.key === '/' || (e.key === 'k' && e.metaKey)) {
          e.preventDefault()
          input.current.focus()
        } else if (e.key === 'Escape') {
          setShow(false)
          input.current.blur()
        }
      }
    }

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  const renderList = show && !!search

  return (
    <div className="relative w-full nextra-search nextra-flexsearch md:w-64">
      {renderList && (
        <div className="z-10 search-overlay" onClick={() => setShow(false)} />
      )}
      <div className="relative flex items-center">
        <input
          onChange={e => {
            setSearch(e.target.value)
            setShow(true)
          }}
          className="block w-full px-3 py-2 leading-tight rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-200 focus:bg-white hover:bg-opacity-5 transition-colors dark:focus:bg-dark dark:focus:ring-gray-100 dark:focus:ring-opacity-20"
          type="search"
          placeholder={renderComponent(
            config.searchPlaceholder,
            {
              locale: router.locale
            },
            true
          )}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            load()
            setShow(true)
          }}
          ref={input}
          spellCheck={false}
        />
        {!renderList && (
          <div className="hidden sm:flex absolute inset-y-0 right-0 py-1.5 pr-1.5 select-none pointer-events-none">
            <kbd className="inline-flex items-center px-1.5 font-mono text-sm font-medium bg-white dark:bg-dark dark:bg-opacity-50 text-gray-400 dark:text-gray-500 dark:border-gray-100 dark:border-opacity-20 border rounded">
              /
            </kbd>
          </div>
        )}
      </div>
      <Transition
        show={renderList}
        as={React.Fragment}
        leave="transition duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ul className="absolute z-20 px-0 py-2.5 m-0 mt-2 top-full rounded-xl overflow-hidden overscroll-contain shadow-xl list-none">
          {loading ? (
            <span className="p-8 text-center text-gray-400 text-sm select-none flex justify-center">
              <SpinnerIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-400" />
              <span>Loading...</span>
            </span>
          ) : results.length === 0 ? (
            renderComponent(config.unstable_searchResultEmpty, {
              locale: router.locale
            })
          ) : (
            results.map((res, i) => {
              return (
                <Item
                  first={res.first}
                  key={`search-item-${i}`}
                  page={res.page}
                  title={res.title}
                  href={res.route}
                  excerpt={res.excerpt}
                  active={i === active}
                  onHover={() => setActive(i)}
                  onClick={finishSearch}
                />
              )
            })
          )}
        </ul>
      </Transition>
    </div>
  )
}
