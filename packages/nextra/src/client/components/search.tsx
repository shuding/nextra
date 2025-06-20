'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  type ComboboxInputProps
} from '@headlessui/react'
import cn from 'clsx'
import { addBasePath } from 'next/dist/client/add-base-path'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type {
  FC,
  FocusEventHandler,
  ReactElement,
  ReactNode,
  SyntheticEvent
} from 'react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import type { PagefindSearchOptions } from '../../types.js'
import { useMounted } from '../hooks/use-mounted.js'
import { InformationCircleIcon, SpinnerIcon } from '../icons/index.js'

// Fix React Compiler (BuildHIR::lowerExpression) Handle Import expressions
export async function importPagefind() {
  window.pagefind = await import(
    /* webpackIgnore: true */ addBasePath('/_pagefind/pagefind.js')
  )
  await window.pagefind!.options({
    baseUrl: '/'
    // ... more search options
  })
}

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

type InputProps = Omit<
  ComboboxInputProps,
  'className' | 'onChange' | 'onFocus' | 'onBlur' | 'value' | 'placeholder'
>

interface SearchProps extends InputProps {
  /**
   * Not found text.
   * @default 'No results found.'
   */
  emptyResult?: ReactNode
  /**
   * Error text.
   * @default 'Failed to load search index.'
   * */
  errorText?: ReactNode
  /**
   * Loading text.
   * @default 'Loading…'
   */
  loading?: ReactNode
  /**
   * Placeholder text.
   * @default 'Search documentation…'
   */
  placeholder?: string
  /** Input container CSS class name. */
  className?: string
  searchOptions?: PagefindSearchOptions
  /**
   * Callback function that triggers whenever the search input changes.
   *
   * This prop is **not serializable** and cannot be used directly in a server-side layout.
   *
   * To use this prop, wrap the component in a **client-side** wrapper. Example:
   *
   * ```tsx filename="search-with-callback.jsx"
   * 'use client'
   *
   * import { Search } from 'nextra/components'
   *
   * export function SearchWithCallback() {
   *   return (
   *     <Search
   *       onSearch={query => {
   *         console.log('Search query:', query)
   *       }}
   *     />
   *   )
   * }
   * ```
   *
   * Then pass the wrapper to the layout:
   *
   * ```tsx filename="app/layout.jsx"
   * import { SearchWithCallback } from '../path/to/your/search-with-callback'
   * // ...
   * <Layout search={<SearchWithCallback />} {...rest} />
   * ```
   *
   * @param query - The current search input string.
   */
  onSearch?: (query: string) => void
}

const INPUTS = new Set(['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'])

const DEV_SEARCH_NOTICE = (
  <>
    <p>
      Search isn&apos;t available in development because Nextra&nbsp;4 uses
      Pagefind package, which indexes built `.html` files instead of
      `.md`/`.mdx`.
    </p>
    <p className="x:mt-2">
      To test search during development, run `next build` and then restart your
      app with `next dev`.
    </p>
  </>
)

/**
 * A built-in search component provides a seamless and fast search
 * experience out of the box. Under the hood, it leverages the
 * [Pagefind package](https://pagefind.app) — a fully client-side search engine optimized for static
 * sites. Pagefind indexes your content at build time and enables highly performant,
 * zero-JavaScript-dependency searches at runtime.
 *
 * @see [Nextra search setup guide](https://nextra.site/docs/guide/search)
 */
export const Search: FC<SearchProps> = ({
  className,
  emptyResult = 'No results found.',
  errorText = 'Failed to load search index.',
  loading = 'Loading…',
  placeholder = 'Search documentation…',
  searchOptions,
  onSearch,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ReactElement | string>('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [search, setSearch] = useState('')
  // https://github.com/shuding/nextra/pull/3514
  // defer pagefind results update for prioritizing user input state
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const handleSearch = async (value: string) => {
      if (!value) {
        setResults([])
        setError('')
        return
      }
      setIsLoading(true)
      if (!window.pagefind) {
        try {
          await importPagefind()
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
      const response = await window.pagefind!.debouncedSearch<PagefindResult>(
        value,
        searchOptions
      )
      if (!response) return

      const data = await Promise.all(response.results.map(o => o.data()))
      setIsLoading(false)
      setError('')
      setResults(
        data.map(newData => ({
          ...newData,
          sub_results: newData.sub_results.map(r => {
            const url = r.url.replace(/\.html$/, '').replace(/\.html#/, '#')

            return { ...r, url }
          })
        }))
      )
    }
    handleSearch(deferredSearch)
  }, [deferredSearch]) // eslint-disable-line react-hooks/exhaustive-deps -- ignore searchOptions

  const router = useRouter()
  const [focused, setFocused] = useState(false)
  const mounted = useMounted()
  const inputRef = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const el = document.activeElement
      if (
        !el ||
        INPUTS.has(el.tagName) ||
        (el as HTMLElement).isContentEditable
      ) {
        return
      }
      if (
        event.key === '/' ||
        (event.key === 'k' &&
          !event.shiftKey &&
          (navigator.userAgent.includes('Mac') ? event.metaKey : event.ctrlKey))
      ) {
        event.preventDefault()
        // prevent to scroll to top
        inputRef.current.focus({ preventScroll: true })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const shortcut = (
    <kbd
      className={cn(
        'x:absolute x:my-1.5 x:select-none x:pointer-events-none x:end-1.5 x:transition-all',
        'x:h-5 x:rounded x:bg-nextra-bg x:px-1.5 x:font-mono x:text-[11px] x:font-medium x:text-gray-600 x:dark:text-gray-400',
        'x:border nextra-border',
        'x:contrast-more:text-current',
        'x:items-center x:gap-1 x:flex',
        'x:max-sm:hidden not-prose',
        (!mounted || focused) && 'x:invisible x:opacity-0'
      )}
    >
      {mounted && navigator.userAgent.includes('Mac') ? (
        <>
          <span className="x:text-xs">⌘</span>K
        </>
      ) : (
        'CTRL K'
      )}
    </kbd>
  )

  const handleFocus: FocusEventHandler = event => {
    const isFocus = event.type === 'focus'
    setFocused(isFocus)
  }

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    onSearch?.(value)
  }

  const handleSelect = (searchResult: PagefindResult | null) => {
    if (!searchResult) return
    // Calling before navigation so selector `html:not(:has(*:focus))` in styles.css will work,
    // and we'll have padding top since input is not focused
    inputRef.current.blur()
    const [url, hash] = searchResult.url.split('#')
    const isSamePathname = location.pathname === url
    // `useHash` hook doesn't work with NextLink, and clicking on search
    // result from same page doesn't scroll to the heading
    if (isSamePathname) {
      location.href = `#${hash}`
    } else {
      router.push(searchResult.url)
    }
    setSearch('')
  }

  return (
    <Combobox onChange={handleSelect}>
      <div
        className={cn(
          'nextra-search',
          'x:relative x:flex x:items-center',
          'x:text-gray-900 x:dark:text-gray-300',
          'x:contrast-more:text-gray-800 x:contrast-more:dark:text-gray-300',
          className
        )}
      >
        <ComboboxInput
          spellCheck={false}
          autoComplete="off"
          type="search"
          {...props}
          ref={inputRef}
          className={({ focus }) =>
            cn(
              'x:rounded-lg x:px-3 x:py-2 x:transition-all',
              'x:w-full x:md:w-64',
              'x:text-base x:leading-tight x:md:text-sm',
              focus
                ? 'x:bg-transparent x:nextra-focus'
                : 'x:bg-black/[.05] x:dark:bg-gray-50/10',
              'x:placeholder:text-gray-600 x:dark:placeholder:text-gray-400',
              'x:contrast-more:border x:contrast-more:border-current',
              'x:[&::-webkit-search-cancel-button]:appearance-none'
            )
          }
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          value={search}
          placeholder={placeholder}
        />
        {shortcut}
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: 'top end', gap: 10, padding: 16 }}
        className={cn(
          'nextra-search-results', // for user styling
          'nextra-scrollbar x:max-md:h-full',
          'x:border x:border-gray-200 x:text-gray-100 x:dark:border-neutral-800',
          'x:z-30 x:rounded-xl x:py-2.5 x:shadow-xl',
          'x:contrast-more:border x:contrast-more:border-gray-900 x:contrast-more:dark:border-gray-50',
          'x:backdrop-blur-md x:bg-nextra-bg/70',
          'x:motion-reduce:transition-none',
          // From https://headlessui.com/react/combobox#adding-transitions
          'x:origin-top x:transition x:duration-200 x:ease-out x:data-closed:scale-95 x:data-closed:opacity-0 x:empty:invisible',
          error || isLoading || !results.length
            ? [
                'x:md:min-h-28 x:grow x:flex x:justify-center x:text-sm x:gap-2 x:px-8',
                error
                  ? 'x:text-red-500 x:items-start'
                  : 'x:text-gray-400 x:items-center'
              ]
            : // headlessui adds max-height as style, use !important to override
              'x:md:max-h-[min(calc(100vh-5rem),400px)]!',
          'x:w-full x:md:w-[576px]'
        )}
      >
        {error ? (
          <>
            <InformationCircleIcon height="1.25em" className="x:shrink-0" />
            <div className="x:grid">
              <b className="x:mb-2">{errorText}</b>
              {error}
            </div>
          </>
        ) : isLoading ? (
          <>
            <SpinnerIcon height="20" className="x:shrink-0 x:animate-spin" />
            {loading}
          </>
        ) : results.length ? (
          results.map(searchResult => (
            <Result key={searchResult.url} data={searchResult} />
          ))
        ) : (
          deferredSearch && emptyResult
        )}
      </ComboboxOptions>
    </Combobox>
  )
}

const Result: FC<{ data: PagefindResult }> = ({ data }) => {
  return (
    <>
      <div
        className={cn(
          'x:mx-2.5 x:mb-2 x:not-first:mt-6 x:select-none x:border-b x:border-black/10 x:px-2.5 x:pb-1.5 x:text-xs x:font-semibold x:uppercase x:text-gray-600 x:dark:border-white/20 x:dark:text-gray-300',
          'x:contrast-more:border-gray-600 x:contrast-more:text-gray-900 x:contrast-more:dark:border-gray-50 x:contrast-more:dark:text-gray-50'
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
              'x:mx-2.5 x:break-words x:rounded-md',
              'x:contrast-more:border',
              focus
                ? 'x:text-primary-600 x:contrast-more:border-current x:bg-primary-500/10'
                : 'x:text-gray-800 x:dark:text-gray-300 x:contrast-more:border-transparent',
              'x:block x:scroll-m-12 x:px-2.5 x:py-2'
            )
          }
        >
          <div className="x:text-base x:font-semibold x:leading-5">
            {subResult.title}
          </div>
          <div
            className={cn(
              'x:mt-1 x:text-sm x:leading-[1.35rem] x:text-gray-600 x:dark:text-gray-400 x:contrast-more:dark:text-gray-50',
              'x:[&_mark]:bg-primary-600/80 x:[&_mark]:text-white'
            )}
            dangerouslySetInnerHTML={{ __html: subResult.excerpt }}
          />
        </ComboboxOption>
      ))}
    </>
  )
}
