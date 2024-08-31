'use client'

import { Transition } from '@headlessui/react'
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useMounted } from 'nextra/hooks'
import { InformationCircleIcon, SpinnerIcon } from 'nextra/icons'
import type {
  ChangeEvent,
  CompositionEvent,
  FocusEventHandler,
  KeyboardEvent,
  ReactElement
} from 'react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useMenu } from '../../contexts'
import type { SearchResult } from '../../types'
import { renderComponent } from '../../utils'
import { Input } from '../input'
import type { FlexsearchProps } from './index'

type SearchProps = FlexsearchProps & {
  className?: string
  overlayClassName?: string
  value: string
  onChange: (newValue: string) => void
  onActive?: () => void
  isLoading?: boolean
  error?: boolean
  results: SearchResult[]
}

const INPUTS = ['input', 'select', 'button', 'textarea']

export function Search({
  className,
  overlayClassName,
  value,
  onChange: onChangeProp,
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

  useEffect(() => {
    setActive(0)
  }, [value])

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent): void => {
      const activeElement = document.activeElement as HTMLElement
      const tagName = activeElement?.tagName.toLowerCase()
      if (
        !input.current ||
        !tagName ||
        INPUTS.includes(tagName) ||
        activeElement?.isContentEditable
      )
        return
      if (
        e.key === '/' ||
        (e.key === 'k' &&
          (e.metaKey /* for Mac */ || /* for non-Mac */ e.ctrlKey))
      ) {
        e.preventDefault()
        // prevent to scroll to top
        input.current.focus({ preventScroll: true })
      } else if (e.key === 'Escape') {
        setShow(false)
        input.current.blur()
      }
    }

    window.addEventListener('keydown', down)
    return () => {
      window.removeEventListener('keydown', down)
    }
  }, [])

  const clearValue = useCallback(() => {
    onChangeProp('')
  }, [onChangeProp])
  const finishSearch = useCallback(() => {
    input.current?.blur()
    clearValue()
    setShow(false)
    setMenu(false)
  }, [clearValue, setMenu])

  const handleActive = useCallback(
    (e: { currentTarget: { dataset: DOMStringMap } }) => {
      const { index } = e.currentTarget.dataset
      setActive(Number(index))
    },
    []
  )

  const handleKeyDown = useCallback(
    <T,>(e: KeyboardEvent<T>) => {
      // skip the character selection process in the IME for CJK language users.
      if (e.nativeEvent.isComposing) return

      switch (e.key) {
        case 'ArrowDown': {
          if (active + 1 < results.length) {
            const el = ulRef.current?.querySelector<HTMLAnchorElement>(
              `li:nth-of-type(${active + 2}) > a`
            )
            if (el) {
              e.preventDefault()
              handleActive({ currentTarget: el })
              el.focus()
            }
          }
          break
        }
        case 'ArrowUp': {
          if (active - 1 >= 0) {
            const el = ulRef.current?.querySelector<HTMLAnchorElement>(
              `li:nth-of-type(${active}) > a`
            )
            if (el) {
              e.preventDefault()
              handleActive({ currentTarget: el })
              el.focus()
            }
          }
          break
        }
        case 'Enter': {
          const result = results[active]
          if (result) {
            void router.push(result.route)
            finishSearch()
          }
          break
        }
        case 'Escape': {
          setShow(false)
          input.current?.blur()
          break
        }
      }
    },
    [active, results, router, finishSearch, handleActive]
  )

  const mounted = useMounted()
  const renderList = show && Boolean(value)

  const icon = (
    <Transition
      show={mounted && (!show || Boolean(value))}
      as={Fragment}
      enter="_transition-opacity"
      enterFrom="_opacity-0"
      enterTo="_opacity-100"
      leave="_transition-opacity"
      leaveFrom="_opacity-100"
      leaveTo="_opacity-0"
    >
      <kbd
        className={cn(
          '_absolute _my-1.5 _select-none _end-1.5',
          '_h-5 _rounded _bg-white _px-1.5 _font-mono _text-[10px] _font-medium _text-gray-500',
          '_border dark:_border-gray-100/20 dark:_bg-black/50',
          'contrast-more:_border-current contrast-more:_text-current contrast-more:dark:_border-current',
          '_items-center _gap-1 _transition-opacity _flex',
          value
            ? '_z-20 _cursor-pointer hover:_opacity-70'
            : '_pointer-events-none max-sm:_hidden'
        )}
        title={value ? 'Clear' : undefined}
        onClick={clearValue}
      >
        {value && focused
          ? 'ESC'
          : mounted &&
            (navigator.userAgent.includes('Macintosh') ? (
              <>
                <span className="_text-xs">⌘</span>K
              </>
            ) : (
              'CTRL K'
            ))}
      </kbd>
    </Transition>
  )

  const handleFocus = useCallback<FocusEventHandler>(
    event => {
      const isFocus = event.type === 'focus'
      const htmlStyle = document.documentElement.style
      // Fixes page scroll jump https://github.com/shuding/nextra/issues/2840
      htmlStyle.scrollPaddingTop = isFocus ? '0' : 'var(--nextra-navbar-height)'
      if (isFocus) onActive?.()
      setFocused(isFocus)
    },
    [onActive]
  )

  // To handle CJK language users, refer to the following approach: https://github.com/SukkaW/foxact/commit/fe17304b410cddc4803d4fdbebf3cd5ecb070618
  // An explicit explanation can be found here: https://github.com/SukkaW/foxact/blob/2b54157187d33ef873c1ab4a9b8700dfdb2e7288/docs/src/pages/use-composition-input.mdx
  const compositionStateRef = useRef({
    compositioning: false,
    emitted: false
  })
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | CompositionEvent<HTMLInputElement>) => {
      if (!compositionStateRef.current.compositioning) {
        const { value } = e.target as HTMLInputElement
        onChangeProp(value)
        setShow(Boolean(value))
        compositionStateRef.current.emitted = true
        return
      }
      compositionStateRef.current.emitted = false
    },
    [onChangeProp]
  )

  const handleCompositionStart = useCallback(() => {
    compositionStateRef.current.compositioning = true
    compositionStateRef.current.emitted = false
  }, [])

  const handleCompositionEnd = useCallback(
    (e: CompositionEvent<HTMLInputElement>) => {
      compositionStateRef.current.compositioning = false
      if (!compositionStateRef.current.emitted) {
        handleChange(e)
      }
    },
    [handleChange]
  )

  return (
    <div className={cn('nextra-search _relative md:_w-64', className)}>
      {renderList && (
        <div className="_fixed _inset-0 _z-10" onClick={() => setShow(false)} />
      )}

      <Input
        ref={input}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleFocus}
        type="search"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        suffix={icon}
      />

      <Transition
        show={renderList}
        // Transition.Child is required here, otherwise popup will be still present in DOM after focus out
        as={Transition.Child}
        leave="_transition-opacity _duration-100"
        leaveFrom="_opacity-100"
        leaveTo="_opacity-0"
      >
        <ul
          className={cn(
            'nextra-search-results nextra-scrollbar',
            overlayClassName
          )}
          ref={ulRef}
          style={{
            transition: 'max-height .2s ease' // don't work with tailwindcss
          }}
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
          ) : results.length > 0 ? (
            results.map(({ route, prefix, children, id }, i) => (
              <Fragment key={id}>
                {prefix}
                <li
                  className={cn(
                    '_mx-2.5 _break-words _rounded-md',
                    'contrast-more:_border',
                    i === active
                      ? '_bg-primary-500/10 _text-primary-600 contrast-more:_border-primary-500'
                      : '_text-gray-800 contrast-more:_border-transparent dark:_text-gray-300'
                  )}
                >
                  <NextLink
                    className="_block _scroll-m-12 _px-2.5 _py-2"
                    href={route}
                    data-index={i}
                    onFocus={handleActive}
                    onMouseMove={handleActive}
                    onClick={finishSearch}
                    onKeyDown={handleKeyDown}
                  >
                    {children}
                  </NextLink>
                </li>
              </Fragment>
            ))
          ) : (
            renderComponent(emptyResult)
          )}
        </ul>
      </Transition>
    </div>
  )
}
