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
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useMounted } from '../../hooks/index.js'
import { InformationCircleIcon, SpinnerIcon } from '../../icons/index.js'
import { renderComponent } from '../render.js'
import { HighlightMatches } from './highlight-matches.js'
import type { FlexsearchProps } from './index.js'

export type SearchResult = {
  data: () => Promise<PagefindResult>
  id: string
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

type SearchProps = FlexsearchProps & {
  value: string
  onChange: (newValue: string) => void
  isLoading?: boolean
  error?: boolean
  results: SearchResult[]
}

const INPUTS = new Set(['input', 'select', 'button', 'textarea'])

export function Search({
  className,
  value,
  onChange,
  isLoading,
  error,
  results,
  emptyResult = (
    <span className="_block _select-none _p-8 _text-center _text-sm _text-gray-400">
      No results found.
    </span>
  ),
  errorText = 'Failed to load search index.',
  loading = 'Loading…',
  placeholder = 'Search documentation…'
}: SearchProps): ReactElement {
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
    async (searchResult: SearchResult | null) => {
      if (!searchResult) return
      // Calling before navigation so selector `html:not(:has(*:focus))` in styles.css will work,
      // and we'll have padding top since input is not focused
      inputRef.current?.blur()
      await router.push(searchResult.route)
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
              focus ? '_bg-transparent' : '_bg-black/[.05] dark:_bg-gray-50/10',
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
          value={value}
          placeholder={placeholder}
        />
        {icon}
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: 'top end', gap: 10, padding: 16 }}
        className={({ open }) =>
          cn(
            'nextra-scrollbar max-md:_h-full',
            '_border _border-gray-200 _text-gray-100 dark:_border-neutral-800',
            '_z-20 _rounded-xl _py-2.5 _shadow-xl',
            'contrast-more:_border contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50',
            '_backdrop-blur-lg _bg-[rgb(var(--nextra-bg),.8)]',
            'motion-reduce:_transition-none _transition-opacity',
            open ? '_opacity-100' : '_opacity-0',
            error || isLoading || !results.length
              ? 'md:_h-[100px]'
              : // headlessui adds max-height as style, use !important to override
                'md:!_max-h-[min(calc(100vh-5rem),400px)]',
            '_w-full md:_w-[576px]',
            'empty:_invisible'
          )
        }
      >
        {error ? (
          <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-red-500">
            <InformationCircleIcon className="_size-5" />
            {errorText}
          </span>
        ) : isLoading ? (
          <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-gray-400">
            <SpinnerIcon className="_size-5 _animate-spin" />
            {renderComponent(loading)}
          </span>
        ) : results.length ? (
          results.map(searchResult => (
            <Fragment key={searchResult.id}>
              {searchResult.prefix && (
                <div
                  className={cn(
                    '_mx-2.5 _mb-2 [&:not(:first-child)]:_mt-6 _select-none _border-b _border-black/10 _px-2.5 _pb-1.5 _text-xs _font-semibold _uppercase _text-gray-500 dark:_border-white/20 dark:_text-gray-300',
                    'contrast-more:_border-gray-600 contrast-more:_text-gray-900 contrast-more:dark:_border-gray-50 contrast-more:dark:_text-gray-50'
                  )}
                >
                  {searchResult.prefix}
                </div>
              )}
              <ComboboxOption
                as={NextLink}
                value={searchResult}
                href={searchResult.route}
                className={({ focus }) =>
                  cn(
                    '_mx-2.5 _break-words _rounded-md',
                    'contrast-more:_border',
                    focus
                      ? '_text-primary-600 contrast-more:_border-current _bg-primary-500/10 _ring'
                      : '_text-gray-800 dark:_text-gray-300 contrast-more:_border-transparent',
                    '_block _scroll-m-12 _px-2.5 _py-2'
                  )
                }
              >
                <div className="_text-base _font-semibold _leading-5">
                  <HighlightMatches match={value} value={searchResult.title} />
                </div>
                {searchResult.content && (
                  <div className="_mt-1 _text-sm _leading-[1.35rem] _text-gray-600 dark:_text-gray-400 contrast-more:dark:_text-gray-50">
                    <HighlightMatches
                      match={value}
                      value={searchResult.content}
                    />
                  </div>
                )}
              </ComboboxOption>
            </Fragment>
          ))
        ) : (
          value && renderComponent(emptyResult)
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
