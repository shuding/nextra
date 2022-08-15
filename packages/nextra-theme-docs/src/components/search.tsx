import React, {
  ComponentProps,
  ReactElement,
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import cn from 'clsx'
import { Transition } from '@headlessui/react'
import { SpinnerIcon } from 'nextra/icons'
import { Input } from './input'
import { Anchor } from './anchor'
import { renderComponent, renderString, useMounted } from '../utils'
import { useConfig, useMenu } from '../contexts'
import { useRouter } from 'next/router'
import { SearchResult } from '../types'

type SearchProps = {
  className?: string
  value: string
  onChange: (newValue: string) => void
  load?: () => Promise<void>
  loading?: boolean
  results: SearchResult[]
}

const INPUTS = ['input', 'select', 'button', 'textarea']

export function Search({
  className,
  value,
  onChange,
  load,
  loading,
  results
}: SearchProps): ReactElement {
  const [show, setShow] = useState(false)
  const config = useConfig()
  const [active, setActive] = useState(0)
  const router = useRouter()
  const { setMenu } = useMenu()
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setActive(0)
  }, [value])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        input.current &&
        document.activeElement &&
        !INPUTS.includes(document.activeElement.tagName.toLowerCase())
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

  const handleKeyDown = useCallback<
    NonNullable<ComponentProps<'input'>['onKeyDown']>
  >(
    e => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (active + 1 < results.length) {
            setActive(active + 1)
            const activeElement = document.querySelector(
              `.nextra-search li:nth-of-type(${active + 2}) > a`
            )
            activeElement?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (active - 1 >= 0) {
            setActive(active - 1)
            const activeElement = document.querySelector(
              `.nextra-search li:nth-of-type(${active}) > a`
            )
            activeElement?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
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
  const renderList = show && !!value

  const icon = (
    <Transition
      show={mounted && (!show || !!value)}
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
              '/'
            ))}
      </kbd>
    </Transition>
  )

  return (
    <div className="nextra-search relative md:w-64">
      {renderList && (
        <div className="fixed inset-0 z-10" onClick={() => setShow(false)} />
      )}

      <Input
        ref={input}
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setShow(true)
        }}
        type="search"
        placeholder={renderString(config.searchPlaceholder)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          load?.()
          setShow(true)
        }}
        onBlur={() => {
          setShow(false)
        }}
        suffix={icon}
      />

      <Transition
        show={renderList}
        as={Fragment}
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {/* Transition.Child is required here, otherwise popup will still present in DOM after focus out */}
        <Transition.Child>
          <ul
            className={cn(
              // Using bg-white as background-color when the browser didn't support backdrop-filter
              'bg-white text-gray-100 ring-1 ring-black/5',
              'dark:bg-neutral-900 dark:ring-white/10',
              'absolute top-full z-20 mt-2 overscroll-contain rounded-xl py-2.5 shadow-xl overflow-auto',
              'right-0 left-0 ltr:md:left-auto rtl:md:right-auto',
              'contrast-more:border contrast-more:border-gray-900 contrast-more:dark:border-gray-50',
              className
            )}
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
                      'mx-2.5 px-2.5 py-2 rounded-md break-words',
                      'contrast-more:border',
                      i === active
                        ? 'bg-primary-500/10 text-primary-500 contrast-more:border-primary-500'
                        : 'text-gray-800 dark:text-gray-300 contrast-more:border-transparent'
                    )}
                  >
                    <Anchor
                      className="block no-underline scroll-m-12 !text-current hover:!bg-transparent !p-0"
                      href={router.basePath + route}
                      onMouseMove={() => setActive(i)}
                      onClick={finishSearch}
                    >
                      {children}
                    </Anchor>
                  </li>
                </Fragment>
              ))
            ) : (
              renderComponent(config.unstable_searchResultEmpty)
            )}
          </ul>
        </Transition.Child>
      </Transition>
    </div>
  )
}
