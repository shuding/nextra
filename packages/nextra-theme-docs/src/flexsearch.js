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
import { Transition } from '@headlessui/react/dist/index.esm'

const Item = ({ page, title, active, href, onMouseOver, excerpt }) => {
  return (
    <Link href={href}>
      <a className="block no-underline" onMouseOver={onMouseOver}>
        <li className={cn({ active })}>
          <div className="font-bold uppercase text-xs text-gray-400">
            {page}
          </div>
          <div className="font-semibold mb-1 dark:text-white">{title}</div>
          {excerpt ? (
            <div className="text-gray-600 text-sm leading-[1.35rem] dark:text-gray-400">
              {excerpt}
            </div>
          ) : null}
        </li>
      </a>
    </Link>
  )
}

const MemoedStringWithMatchHighlights = memo(
  function StringWithMatchHighlights({ content, search }) {
    const splittedText = content.split('')
    const escappedSearch = search.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    const regexp = RegExp('(' + escappedSearch.split(' ').join('|') + ')', 'ig')
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
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(0)
  const [results, setResults] = useState([])
  const input = useRef(null)

  useEffect(() => {
    if (!search) return

    const localeCode = Router.locale || 'default'
    const index = indexes[localeCode]

    if (!index) return

    const results = []
      .concat(
        ...index
          .search(search, { enrich: true, limit: 10, suggest: true })
          .map(r => r.result)
      )
      .map(item => {
        return {
          route: item.doc.url,
          page: item.doc.page,
          title: (
            <MemoedStringWithMatchHighlights
              content={item.doc.title}
              search={search}
            />
          ),
          excerpt:
            item.doc.title !== item.doc.content ? (
              <MemoedStringWithMatchHighlights
                content={item.doc.content.replace(/ _NEXTRA_ .*$/, '')}
                search={search}
              />
            ) : null
        }
      })

    setResults(results)
  }, [search])

  const handleKeyDown = useCallback(
    e => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (active + 1 < results.length) {
            setActive(active + 1)
            const activeElement = document.querySelector(
              `.nextra-flexsearch ul > :nth-child(${active + 2})`
            )
            if (activeElement && activeElement.scrollIntoViewIfNeeded) {
              activeElement.scrollIntoViewIfNeeded()
            }
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (active - 1 >= 0) {
            setActive(active - 1)
            const activeElement = document.querySelector(
              `.nextra-flexsearch ul > :nth-child(${active})`
            )
            if (activeElement && activeElement.scrollIntoViewIfNeeded) {
              activeElement.scrollIntoViewIfNeeded()
            }
          }
          break
        }
        case 'Enter': {
          router.push(results[active].route)
          break
        }
      }
    },
    [active, results, router]
  )

  const load = async () => {
    const localeCode = Router.locale || 'default'
    if (!indexes[localeCode]) {
      const data = await (
        await fetch(`/_nextra/data-${localeCode}.json`)
      ).json()

      const index = new FlexSearch.Document({
        cache: 100,
        tokenize: 'full',
        document: {
          id: 'id',
          index: 'content',
          store: ['title', 'content', 'url', 'page']
        },
        context: {
          resolution: 9,
          depth: 1,
          bidirectional: true
        },
        filter: ['_NEXTRA_']
      })

      for (let route in data) {
        for (let heading in data[route].data) {
          const [hash, text] = heading.split('#')
          const title = text || data[route].title
          const url = route + (hash ? '#' + hash : '')

          const paragraphs = (data[route].data[heading] || '')
            .split('\n')
            .filter(Boolean)

          if (!paragraphs.length) {
            index.add({
              id: url,
              url: url,
              title,
              content: title,
              page: data[route].title
            })
          }

          for (let i = 0; i < paragraphs.length; i++) {
            index.add({
              id: url + '_' + i,
              url: url,
              title: title,
              content: paragraphs[i] + (i === 0 ? ' _NEXTRA_ ' + title : ''),
              page: data[route].title
            })
          }
        }
      }

      indexes[localeCode] = index
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
        if (e.key === '/') {
          e.preventDefault()
          input.current.focus()
        } else if (e.key === 'Escape') {
          setShow(false)
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
          placeholder="Search documentation..."
          onKeyDown={handleKeyDown}
          onFocus={() => {
            load()
            setShow(true)
          }}
          // onBlur={() => setShow(false)}
          ref={input}
          spellCheck={false}
        />
        {renderList ? null : (
          <div className="hidden sm:flex absolute inset-y-0 right-0 py-1.5 pr-1.5 select-none pointer-events-none">
            <kbd className="inline-flex items-center px-2 font-mono text-sm font-medium bg-white dark:bg-dark dark:bg-opacity-50 text-gray-400 dark:text-gray-500 dark:border-gray-100 dark:border-opacity-20 border rounded">
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
        <ul className="absolute z-20 p-0 m-0 mt-2 top-full">
          {results.length === 0 ? (
            <span className="block p-4 text-center text-gray-400 text-sm select-none">
              No results found.
            </span>
          ) : (
            results.map((res, i) => {
              return (
                <Item
                  key={`search-item-${i}`}
                  page={res.page}
                  title={res.title}
                  href={res.route}
                  excerpt={res.excerpt}
                  active={i === active}
                  onMouseOver={() => setActive(i)}
                />
              )
            })
          )}
        </ul>
      </Transition>
    </div>
  )
}
