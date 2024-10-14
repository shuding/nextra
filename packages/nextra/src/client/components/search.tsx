'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react'
import cn from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { FocusEventHandler, ReactElement, SyntheticEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMounted } from '../hooks/index.js'
import { InformationCircleIcon, SpinnerIcon } from '../icons/index.js'

type PagefindResult = {
  excerpt: string
  meta: {
    title: string
  }
  raw_url: string
  sub_results: {
    excerpt: string
    title: string
    url: string
  }[]
  url: string
}

type SearchProps = {
  emptyResult?: ReactElement | string
  errorText?: ReactElement | string
  loading?: ReactElement | string
  placeholder?: string
  className?: string
}

const INPUTS = new Set(['input', 'select', 'button', 'textarea'])

const DEV_SEARCH_NOTICE = (
  <>
    Search is not available in development because Nextra&nbsp;4 uses Pagefind
    package which indexes built .html files rather than .md/.mdx content.
    <p className="_mt-2">
      If you really need to test search during development, follow these steps:
    </p>
    <ol className="_mt-2 _list-decimal">
      <li>Build your app with `next build`</li>
      <li>
        Copy `.next/static/chunks/pagefind` folder to a different location
      </li>
      <li>Start your app in dev mode using `next dev`</li>
      <li>
        Copy `pagefind` folder into `.next/static/chunks/<b>app</b>` or
        `.next/static/chunks/<b>app/[lang]</b>` for i18n website
      </li>
    </ol>
  </>
)

export function Search({
  className,
  emptyResult = 'No results found.',
  errorText = 'Failed to load search index.',
  loading = 'Loading…',
  placeholder = 'Search documentation…'
}: SearchProps): ReactElement {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ReactElement | string>('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [search, setSearch] = useState('')

  const onChange = useCallback(async (value: string) => {
    setSearch(value)

    if (!value) {
      setResults([])
      setError('')
      return
    }

    if (!window.pagefind) {
      setIsLoading(true)
      setError('')
      try {
        window.pagefind = await import(
          // @ts-expect-error pagefind.js generated after build
          /* webpackIgnore: true */ './pagefind/pagefind.js'
        )
        await window.pagefind.options({
          baseUrl: '/'
          // ... more search options
        })
      } catch (error) {
        const message =
          error instanceof Error
            ? process.env.NODE_ENV !== 'production' &&
              error.message.includes('Failed to fetch')
              ? DEV_SEARCH_NOTICE // This error will be tree-shaked in production
              : `${error.constructor.name}: ${error.message}`
            : String(error)
        setError(message)
        setIsLoading(false)
        return
      }
    }
    const { results } = await window.pagefind.search<PagefindResult>(value)
    const data = await Promise.all(results.map(o => o.data()))

    setResults(
      data.map(newData => ({
        ...newData,
        sub_results: newData.sub_results.map(r => {
          const url = r.url.replace(/\.html$/, '').replace(/\.html#/, '#')

          return { ...r, url }
        })
      }))
    )
    setIsLoading(false)
  }, [])

  const router = useRouter()
  const [focused, setFocused] = useState(false)
  const mounted = useMounted()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      const input = inputRef.current
      const activeElement = document.activeElement as HTMLElement
      const tagName = activeElement?.tagName.toLowerCase()
      if (
        !input ||
        !tagName ||
        INPUTS.has(tagName) ||
        activeElement?.isContentEditable
      )
        return
      if (
        event.key === '/' ||
        (event.key === 'k' &&
          (event.metaKey /* for Mac */ || /* for non-Mac */ event.ctrlKey))
      ) {
        event.preventDefault()
        // prevent to scroll to top
        input.focus({ preventScroll: true })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const icon = mounted && !focused && (
    <kbd
      className={cn(
        '_absolute _my-1.5 _select-none _end-1.5',
        '_h-5 _rounded _bg-white _px-1.5 _font-mono _text-[11px] _font-medium _text-gray-500',
        '_border dark:_border-gray-100/20 dark:_bg-black/50',
        'contrast-more:_border-current contrast-more:_text-current contrast-more:dark:_border-current',
        '_items-center _gap-1 _flex',
        'max-sm:_hidden'
      )}
    >
      {navigator.userAgent.includes('Mac') ? (
        <>
          <span className="_text-xs">⌘</span>K
        </>
      ) : (
        'CTRL K'
      )}
    </kbd>
  )

  const handleFocus = useCallback<FocusEventHandler>(event => {
    const isFocus = event.type === 'focus'
    setFocused(isFocus)
  }, [])

  const handleChange = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      onChange(value)
    },
    [onChange]
  )

  const handleSelect = useCallback(
    async (searchResult: PagefindResult | null) => {
      if (!searchResult) return
      // Calling before navigation so selector `html:not(:has(*:focus))` in styles.css will work,
      // and we'll have padding top since input is not focused
      inputRef.current?.blur()
      await router.push(searchResult.url)
      // Clear input after navigation completes
      onChange('')
    },
    [router, onChange]
  )

  return (
    <Combobox onChange={handleSelect}>
      <div
        className={cn(
          '_not-prose', // for blog
          '_relative _flex _items-center',
          '_text-gray-900 dark:_text-gray-300',
          'contrast-more:_text-gray-800 contrast-more:dark:_text-gray-300',
          className
        )}
      >
        <ComboboxInput
          ref={inputRef}
          spellCheck={false}
          className={({ focus }) =>
            cn(
              '_rounded-lg _px-3 _py-2 _transition-colors',
              '_w-full md:_w-64',
              '_text-base _leading-tight md:_text-sm',
              focus
                ? '_bg-transparent nextra-focus'
                : '_bg-black/[.05] dark:_bg-gray-50/10',
              'placeholder:_text-gray-500 dark:placeholder:_text-gray-400',
              'contrast-more:_border contrast-more:_border-current',
              '[&::-webkit-search-cancel-button]:_appearance-none'
            )
          }
          autoComplete="off"
          type="search"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          value={search}
          placeholder={placeholder}
        />
        {icon}
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: 'top end', gap: 10, padding: 16 }}
        className={({ open }) =>
          cn(
            'nextra-search-results', // for user styling
            'nextra-scrollbar max-md:_h-full',
            '_border _border-gray-200 _text-gray-100 dark:_border-neutral-800',
            '_z-20 _rounded-xl _py-2.5 _shadow-xl',
            'contrast-more:_border contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50',
            '_backdrop-blur-md _bg-[rgba(var(--nextra-bg),.7)]',
            'motion-reduce:_transition-none _transition-opacity',
            open ? '_opacity-100' : '_opacity-0',
            error || isLoading || !results.length
              ? [
                  'md:_min-h-28 _grow _flex _justify-center _text-sm _gap-2 _px-8',
                  error ? '_text-red-500' : '_text-gray-400 _items-center'
                ]
              : // headlessui adds max-height as style, use !important to override
                'md:!_max-h-[min(calc(100vh-5rem),400px)]',
            '_w-full md:_w-[576px]',
            'empty:_invisible'
          )
        }
      >
        {error ? (
          <>
            <InformationCircleIcon height="20" className="_shrink-0" />
            <div className="_grid">
              <b className="_mb-2">{errorText}</b>
              {error}
            </div>
          </>
        ) : isLoading ? (
          <>
            <SpinnerIcon height="20" className="_shrink-0 _animate-spin" />
            {loading}
          </>
        ) : results.length ? (
          results.map(searchResult => (
            <Result key={searchResult.url} data={searchResult} />
          ))
        ) : (
          search && emptyResult
        )}
      </ComboboxOptions>
    </Combobox>
  )
}

function Result({ data }: { data: PagefindResult }) {
  return (
    <>
      <div
        className={cn(
          '_mx-2.5 _mb-2 [&:not(:first-child)]:_mt-6 _select-none _border-b _border-black/10 _px-2.5 _pb-1.5 _text-xs _font-semibold _uppercase _text-gray-500 dark:_border-white/20 dark:_text-gray-300',
          'contrast-more:_border-gray-600 contrast-more:_text-gray-900 contrast-more:dark:_border-gray-50 contrast-more:dark:_text-gray-50'
        )}
      >
        {data.meta.title}
      </div>
      {data.sub_results.map(subResult => (
        <ComboboxOption
          key={subResult.url}
          as={NextLink}
          value={subResult}
          href={subResult.url}
          className={({ focus }) =>
            cn(
              '_mx-2.5 _break-words _rounded-md',
              'contrast-more:_border',
              focus
                ? '_text-primary-600 contrast-more:_border-current _bg-primary-500/10'
                : '_text-gray-800 dark:_text-gray-300 contrast-more:_border-transparent',
              '_block _scroll-m-12 _px-2.5 _py-2'
            )
          }
        >
          <div className="_text-base _font-semibold _leading-5">
            {subResult.title}
          </div>
          <div
            className={cn(
              '_mt-1 _text-sm _leading-[1.35rem] _text-gray-600 dark:_text-gray-400 contrast-more:dark:_text-gray-50',
              '[&_mark]:_bg-primary-600/80 [&_mark]:_text-white'
            )}
            dangerouslySetInnerHTML={{ __html: subResult.excerpt }}
          />
        </ComboboxOption>
      ))}
    </>
  )
}
