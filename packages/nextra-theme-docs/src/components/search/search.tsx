'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react'
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import { InformationCircleIcon, SpinnerIcon } from 'nextra/icons'
import type { FocusEventHandler, ReactElement, SyntheticEvent } from 'react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useMenu } from '../../contexts'
import type { SearchResult } from '../../types'
import { renderComponent } from '../../utils'
import { Input } from '../input'
import type { FlexsearchProps } from './index'

type SearchProps = FlexsearchProps & {
  className?: string
  value: string
  onChange: (newValue: string) => void
  onActive?: () => void
  isLoading?: boolean
  error?: boolean
  results: SearchResult[]
}

const INPUTS = new Set(['input', 'select', 'button', 'textarea'])

export function Search({
  className,
  value,
  onChange,
  onActive,
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
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(0)
  const router = useRouter()
  const { setMenu } = useMenu()
  const input = useRef<HTMLInputElement>(null)
  const ulRef = useRef<HTMLUListElement>(null)
  const [focused, setFocused] = useState(false)
  const mounted = useMounted()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function down(event: globalThis.KeyboardEvent) {
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

    window.addEventListener('keydown', down)
    return () => {
      window.removeEventListener('keydown', down)
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

  const handleFocus = useCallback<FocusEventHandler>(
    event => {
      const isFocus = event.type === 'focus'
      if (isFocus) onActive?.()
      setFocused(isFocus)
    },
    [onActive]
  )

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
      setMenu(false)
      onChange('')
    },
    [router, setMenu, onChange]
  )

  // const [selected, setSelected] = useState<SearchResult | null>(null)
  //
  // useEffect(() => {
  //   setSelected(results[0] || null)
  // }, [results])

  return (
    <Combobox
      as="div"
      // value={selected}
      onChange={handleSelect}
      className={cn('nextra-search _relative md:_w-64', className)}
    >
      <ComboboxInput
        ref={inputRef}
        as={Input}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleFocus}
        type="search"
        placeholder={placeholder}
        suffix={icon}
      />
      <ComboboxOptions
        transition
        anchor={{ to: 'top end', gap: 10, padding: 16 }}
        className={cn(
          'nextra-search-results nextra-scrollbar max-md:_h-full',
          error || loading || !results.length
            ? 'md:_h-[100px]'
            : // headlessui adds max-height as style, use !important to override
              'md:!_max-h-[min(calc(100vh-5rem),400px)]',
          '_w-[--input-width] md:_w-[576px]',
          'empty:_invisible'
        )}
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
              {searchResult.prefix}
              <ComboboxOption
                as={NextLink}
                value={searchResult}
                href={searchResult.route}
                className={cn(
                  '_mx-2.5 _break-words _rounded-md',
                  'contrast-more:_border',
                  'data-[focus]:_ring data-[focus]:_bg-primary-500/10 data-[focus]:!_text-primary-600 data-[focus]:contrast-more:_border-primary-500',
                  '_text-gray-800 contrast-more:_border-transparent dark:_text-gray-300',
                  '_block _scroll-m-12 _px-2.5 _py-2'
                )}
              >
                {searchResult.children}
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
