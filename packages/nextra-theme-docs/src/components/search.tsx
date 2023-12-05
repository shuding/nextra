import { Transition } from '@headlessui/react'
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
// import { useRouter } from 'next/router'
import { useMounted } from 'nextra/hooks'
import { InformationCircleIcon, SpinnerIcon } from 'nextra/icons'
import type { CompositionEvent, KeyboardEvent, ReactElement } from 'react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useMenu, useThemeConfig } from '../contexts'
import type { PagefindResult, SearchResult } from '../types'
import { renderComponent, renderString } from '../utils'
import { Input } from './input'

type SearchProps = {
  className?: string
  overlayClassName?: string
  value: string
  onChange: (newValue: string) => void
  onActive?: (active: boolean) => void
  loading?: boolean
  error?: boolean
  results: SearchResult[]
}

const INPUTS = ['input', 'select', 'button', 'textarea']

export function Search({
  className,
  overlayClassName,
  value,
  onChange,
  onActive,
  loading,
  error,
  results
}: SearchProps): ReactElement {
  const themeConfig = useThemeConfig()
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(0)
  // const router = useRouter()
  const { setMenu } = useMenu()
  const input = useRef<HTMLInputElement>(null)
  const ulRef = useRef<HTMLUListElement>(null)
  const [focused, setFocused] = useState(false)
  //  Trigger the search after the Input is complete for languages like Chinese
  const [composition, setComposition] = useState(true)

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

  const finishSearch = useCallback(() => {
    input.current?.blur()
    onChange('')
    setShow(false)
    setMenu(false)
  }, [onChange, setMenu])

  const handleActive = useCallback(
    (e: { currentTarget: { dataset: DOMStringMap } }) => {
      const { index } = e.currentTarget.dataset
      setActive(Number(index))
    },
    []
  )

  const handleKeyDown = useCallback(
    <T,>(e: KeyboardEvent<T>) => {
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
          if (result && composition) {
            // TODO: fix this
            // void router.push(result.route)
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
    [active, results, finishSearch, handleActive, composition]
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
          '_absolute _my-1.5 _select-none ltr:_right-1.5 rtl:_left-1.5',
          '_h-5 _rounded _bg-white _px-1.5 _font-mono _text-[10px] _font-medium _text-gray-500',
          '_border dark:_border-gray-100/20 dark:_bg-dark/50',
          'contrast-more:_border-current contrast-more:_text-current contrast-more:dark:_border-current',
          '_items-center _gap-1 _transition-opacity _flex',
          value
            ? '_z-20 _cursor-pointer hover:_opacity-70'
            : '_pointer-events-none max-sm:_hidden'
        )}
        title={value ? 'Clear' : undefined}
        onClick={() => {
          onChange('')
        }}
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
  const handleComposition = useCallback(
    (e: CompositionEvent<HTMLInputElement>) => {
      setComposition(e.type === 'compositionend')
    },
    []
  )

  return (
    <div className={cn('nextra-search _relative md:_w-64', className)}>
      {renderList && (
        <div className="_fixed _inset-0 _z-10" onClick={() => setShow(false)} />
      )}

      <Input
        ref={input}
        value={value}
        onChange={e => {
          const { value } = e.target
          onChange(value)
          setShow(Boolean(value))
        }}
        onFocus={() => {
          onActive?.(true)
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        type="search"
        placeholder={renderString(themeConfig.search.placeholder)}
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
            'nextra-scrollbar',
            // Using bg-white as background-color when the browser didn't support backdrop-filter
            '_border _border-gray-200 _bg-white _text-gray-100 dark:_border-neutral-800 dark:_bg-neutral-900',
            '_absolute _top-full _z-20 _mt-2 _overflow-auto _overscroll-contain _rounded-xl _py-2.5 _shadow-xl',
            '_max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)]',
            'md:_max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)]',
            '_inset-x-0 ltr:md:_left-auto rtl:md:_right-auto',
            'contrast-more:_border contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50',
            overlayClassName
          )}
          ref={ulRef}
          style={{
            transition: 'max-height .2s ease' // don't work with tailwindcss
          }}
        >
          {error ? (
            <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-red-500">
              <InformationCircleIcon className="_h-5 _w-5" />
              {renderString(themeConfig.search.error)}
            </span>
          ) : loading ? (
            <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-gray-400">
              <SpinnerIcon className="_h-5 _w-5 _animate-spin" />
              {renderComponent(themeConfig.search.loading)}
            </span>
          ) : results.length > 0 ? (
            results.map((result, i) => (
              <Result
                key={result.id}
                index={i}
                result={result}
                active={active}
                onActive={handleActive}
                onClick={finishSearch}
                onKeyDown={handleKeyDown}
              />
            ))
          ) : (
            renderComponent(themeConfig.search.emptyResult)
          )}
        </ul>
      </Transition>
    </div>
  )
}

function Result({
  result,
  index: i,
  active,
  onActive,
  onClick,
  onKeyDown
}: {
  result: SearchResult
  index: number
  active: number
  onActive: (event: { currentTarget: { dataset: DOMStringMap } }) => void
  onClick: () => void
  onKeyDown: <T>(event: KeyboardEvent<T>) => void
}) {
  const [data, setData] = useState<PagefindResult | null>(null)

  useEffect(() => {
    result.data().then(setData)
  }, [result])

  if (!data) return null

  return (
    <>
      <div
        className={cn(
          '_mx-2.5 _mb-2 _mt-6 _select-none _border-b _border-black/10 _px-2.5 _pb-1.5 _text-xs _font-semibold _uppercase _text-gray-500 first:_mt-0 dark:_border-white/20 dark:_text-gray-300',
          'contrast-more:_border-gray-600 contrast-more:_text-gray-900 contrast-more:dark:_border-gray-50 contrast-more:dark:_text-gray-50'
        )}
      >
        {data.meta.title}
      </div>
      {data.sub_results.map(subResult => (
        <li
          key={subResult.url}
          className={cn(
            '_mx-2.5 _break-words _rounded-md',
            'contrast-more:_border',
            i === active
              ? '_bg-primary-500/10 _text-primary-600 contrast-more:_border-primary-500'
              : '_text-gray-800 contrast-more:_border-transparent dark:_text-gray-300'
          )}
        >
          <NextLink
            className="_block _scroll-m-12 _px-2.5 _py-2 [&_mark]:_text-primary-600 [&_mark]:_bg-transparent"
            href={subResult.url
              .replace('/_next/static/chunks/pages', '')
              .replace(/\.html#/, '#')}
            data-index={i}
            onFocus={onActive}
            onMouseMove={onActive}
            onClick={onClick}
            onKeyDown={onKeyDown}
          >
            <div className="_text-base _font-semibold _leading-5">
              {subResult.title}
            </div>
            <div
              className="excerpt _mt-1 _text-sm _leading-[1.35rem] _text-gray-600 dark:_text-gray-400 contrast-more:dark:_text-gray-50"
              dangerouslySetInnerHTML={{ __html: subResult.excerpt }}
            />
          </NextLink>
        </li>
      ))}
    </>
  )
}
