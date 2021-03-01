import React, { useMemo, useCallback, useRef, useState, useEffect, Fragment } from 'react'
import Router, { useRouter } from 'next/router'
import cn from 'classnames'
import Link from 'next/link'
import GraphemeSplitter from 'grapheme-splitter'

const splitter = new GraphemeSplitter()

const TextWithHighlights = React.memo(({ content, ranges }) => {
  const splittedText = content ? splitter.splitGraphemes(content) : []
  const res = []

  let id = 0, index = 0
  for (const range of ranges) {
    res.push(<Fragment key={id++}>{splittedText.splice(0, range.beginning - index).join('')}</Fragment>)
    res.push(<span className="highlight" key={id++}>{splittedText.splice(0, range.end - range.beginning).join('')}</span>)
    index = range.end
  }
  res.push(<Fragment key={id++}>{splittedText.join('')}</Fragment>)

  return res
})

const Item = ({ title, active, href, onMouseOver, excerpt }) => {
  return (
    <Link href={href}>
      <a className="block no-underline" onMouseOver={onMouseOver}>
        <li className={cn('p-2', { active })}>
          <span className="font-semibold">{title}</span>
          {excerpt ? <div className="text-gray-600">
            <TextWithHighlights content={excerpt.text} ranges={excerpt.highlight_ranges} />
          </div> : null}
        </li>
      </a>
    </Link>
  )
}

// This can be global for better caching.
const stork = {}

export default function Search () {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(0)
  const setStork = useState({})[1]
  const input = useRef(null)

  const results = useMemo(() => {
    if (!search) return []

    const localeCode = Router.locale || 'default'
    if (!stork[localeCode]) return []

    const json = stork[localeCode].wasm_search(`index-${localeCode}`, search)
    const obj = JSON.parse(json)
    
    if (!obj.results) return []
    return obj.results.map(result => {
      return {
        title: result.entry.title,
        route: result.entry.url,
        excerpt: result.excerpts[0]
      }
    })
  }, [search])

  const handleKeyDown = useCallback(
    e => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (active + 1 < results.length) {
            setActive(active + 1)
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (active - 1 >= 0) {
            setActive(active - 1)
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
    if (!stork[localeCode]) {
      stork[localeCode] = await import('./wasm-loader')
      setStork({})

      const init = stork[localeCode].init('/stork.wasm')
      const res = await fetch(`/index-${localeCode}.st`)
      const buf = await res.arrayBuffer()
      await init
      stork[localeCode].wasm_register_index(`index-${localeCode}`, new Uint8Array(buf))
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
        inputs.indexOf(document.activeElement.tagName.toLowerCase() !== -1)
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

  const renderList = show && results.length > 0

  return (
    <div className="nextra-search relative w-full md:w-64">
      {renderList && (
        <div className="search-overlay z-1" onClick={() => setShow(false)} />
      )}
      <input
        onChange={e => {
          setSearch(e.target.value)
          setShow(true)
        }}
        className="appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:ring w-full"
        type="search"
        placeholder='Search ("/" to focus)'
        onKeyDown={handleKeyDown}
        onFocus={() => {
          load()
          setShow(true)
        }}
        ref={input}
      />
      {renderList && (
        <ul className="shadow-md list-none p-0 m-0 absolute left-0 md:right-0 rounded mt-1 border top-100 divide-y z-2">
          {results.map((res, i) => {
            return (
              <Item
                key={`search-item-${i}`}
                title={res.title}
                href={res.route}
                excerpt={res.excerpt}
                active={i === active}
                onMouseOver={() => setActive(i)}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}
