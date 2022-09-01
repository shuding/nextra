import React, {
  ReactElement,
  KeyboardEvent,
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import cn from 'clsx'
import { Transition } from '@headlessui/react'
import { SpinnerIcon } from 'nextra/icons'
import { useMounted } from 'nextra/hooks'
import { Input } from './input'
import { Anchor } from './anchor'
import { renderComponent, renderString } from '../utils'
import { useConfig, useMenu } from '../contexts'
import { useRouter } from 'next/router'
import { SearchResult } from '../types'

type SearchProps = {
  className?: string
  overlayClassName?: string
  value: string
  onChange: (newValue: string) => void
  loading?: boolean
  results: SearchResult[]
}

const INPUTS = ['input', 'select', 'button', 'textarea']

export function Search({
  className,
  overlayClassName,
  value,
  onChange,
  loading,
  results
}: SearchProps): ReactElement {
  const [show, setShow] = useState(false)
  const config = useConfig()
  const [active, setActive] = useState(0)
  const router = useRouter()
  const { setMenu } = useMenu()
  const input = useRef<HTMLInputElement>(null)
  const ulRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setActive(0)
  }, [value])

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent): void => {
      const tagName = document.activeElement?.tagName.toLowerCase()
      if (!input.current || !tagName || INPUTS.includes(tagName)) return
      if (e.key === '/' || (e.key === 'k' && e.metaKey)) {
        e.preventDefault()
        input.current.focus()
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

  const handleKeyDown = useCallback(
    function <T>(e: KeyboardEvent<T>) {
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
            router.push(result.route)
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
    [active, results, router]
  )

  const finishSearch = () => {
    input.current?.blur()
    onChange('')
    setShow(false)
    setMenu(false)
  }

  const mounted = useMounted()
  const renderList = show && Boolean(value)

  const icon = (
    <Transition
      show={mounted && (!show || Boolean(value))}
      as={React.Fragment}
      enter="transition-opacity"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <kbd
        className={cn(
          'absolute ltr:right-1.5 rtl:left-1.5 my-1.5 select-none',
          'rounded bg-white px-1.5 h-5 font-mono font-medium text-gray-500 text-[10px]',
          'border dark:bg-dark/50 dark:border-gray-100/20',
          'contrast-more:border-current contrast-more:text-current contrast-more:dark:border-current',
          'items-center gap-1 transition-opacity',
          value
            ? 'cursor-pointer hover:opacity-70 z-20 flex'
            : 'hidden sm:flex pointer-events-none'
        )}
        title={value ? 'Clear' : undefined}
        onClick={() => {
          onChange('')
        }}
      >
        {value
          ? 'ESC'
          : mounted &&
            (navigator.userAgent.includes('Macintosh') ? (
              <>
                <span className="text-xs">⌘</span>K
              </>
            ) : (
              'CTRL K'
            ))}
      </kbd>
    </Transition>
  )

  const handleActive = useCallback(
    (e: { currentTarget: { dataset: DOMStringMap } }) => {
      const { index } = e.currentTarget.dataset
      setActive(Number(index))
    },
    []
  )

  return (
    <div className={cn('nextra-search relative md:w-64', className)}>
      {renderList && (
        <div className="fixed inset-0 z-10" onClick={() => setShow(false)} />
      )}

      <Input
        ref={input}
        value={value}
        onChange={e => {
          const { value } = e.target
          onChange(value)
          setShow(Boolean(value))
        }}
        type="search"
        placeholder={renderString(config.search.placeholder)}
        onKeyDown={handleKeyDown}
        suffix={icon}
      />

      <Transition
        show={renderList}
        as={Fragment}
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {/* Transition.Child is required here, otherwise popup will be still present in DOM after focus out */}
        <Transition.Child>
          <ul
            className={cn(
              // Using bg-white as background-color when the browser didn't support backdrop-filter
              'bg-white text-gray-100 dark:bg-neutral-900',
              'absolute top-full z-20 mt-2 overscroll-contain rounded-xl py-2.5 shadow-xl overflow-auto',
              'max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)]',
              'md:max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)]',
              'right-0 left-0 ltr:md:left-auto rtl:md:right-auto',
              'contrast-more:border contrast-more:border-gray-900 contrast-more:dark:border-gray-50',
              overlayClassName
            )}
            ref={ulRef}
            style={{
              transition: 'max-height .2s ease' // don't work with tailwindcss
            }}
          >
            {loading ? (
              <span className="flex select-none justify-center p-8 text-center text-sm text-gray-400 gap-2">
                <SpinnerIcon className="h-5 w-5 animate-spin" />
                Loading...
              </span>
            ) : results.length > 0 ? (
              results.map(({ route, prefix, children, id }, i) => (
                <Fragment key={id}>
                  {prefix}
                  <li
                    className={cn(
                      'mx-2.5 rounded-md break-words',
                      'contrast-more:border',
                      i === active
                        ? 'bg-primary-500/10 text-primary-500 contrast-more:border-primary-500'
                        : 'text-gray-800 dark:text-gray-300 contrast-more:border-transparent'
                    )}
                  >
                    <Anchor
                      className="block px-2.5 py-2 scroll-m-12"
                      href={route}
                      data-index={i}
                      onFocus={handleActive}
                      onMouseMove={handleActive}
                      onClick={finishSearch}
                      onKeyDown={handleKeyDown}
                    >
                      {children}
                    </Anchor>
                  </li>
                </Fragment>
              ))
            ) : (
              renderComponent(config.search.emptyResult)
            )}
          </ul>
        </Transition.Child>
      </Transition>
    </div>
  )
}
