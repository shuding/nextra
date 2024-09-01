import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react'
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useMounted } from 'nextra/hooks'
import { InformationCircleIcon, SpinnerIcon } from 'nextra/icons'
import type { FocusEventHandler, ReactElement, SyntheticEvent } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useMenu, useThemeConfig } from '../contexts'
import type { SearchResult } from '../types'
import { renderComponent, renderString } from '../utils'
import { Input } from './input'

type SearchProps = {
  className?: string
  overlayClassName?: string
  value: string
  onChange: (newValue: string) => void
  onActive?: () => void
  loading?: boolean
  error?: boolean
  results: SearchResult[]
}

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
  const { setMenu } = useMenu()
  const router = useRouter()
  const [focused, setFocused] = useState(false)
  const mounted = useMounted()

  const icon = mounted && (
    <kbd
      className={cn(
        '_absolute _my-1.5 _select-none ltr:_right-1.5 rtl:_left-1.5',
        '_h-5 _rounded _bg-white _px-1.5 _font-mono _text-[10px] _font-medium _text-gray-500',
        '_border dark:_border-gray-100/20 dark:_bg-black/50',
        'contrast-more:_border-current contrast-more:_text-current contrast-more:dark:_border-current',
        '_items-center _gap-1 _flex',
        value
          ? '_z-20 _cursor-pointer hover:_opacity-70'
          : '_pointer-events-none max-sm:_hidden'
      )}
      aria-label={value ? 'Cancel' : undefined}
      title={value ? 'Cancel' : undefined}
      onClick={() => onChange('')}
    >
      {value && focused ? (
        'ESC'
      ) : navigator.userAgent.includes('Macintosh') ? (
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
    (e: SyntheticEvent<HTMLInputElement>) => {
      if (!compositionStateRef.current.compositioning) {
        onChange(e.currentTarget.value)
        compositionStateRef.current.emitted = true
        return
      }
      compositionStateRef.current.emitted = false
    },
    [onChange]
  )

  const handleCompositionStart = useCallback(() => {
    compositionStateRef.current.compositioning = true
    compositionStateRef.current.emitted = false
  }, [])

  const handleCompositionEnd = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      compositionStateRef.current.compositioning = false
      if (!compositionStateRef.current.emitted) {
        handleChange(e)
      }
    },
    [handleChange]
  )

  const handleSelect = useCallback(
    (route: string) => {
      if (route) {
        router.push(route)
        setMenu(false)
      }
    },
    [router, setMenu]
  )

  return (
    <Combobox
      as="div"
      onChange={handleSelect}
      className={cn('nextra-search _relative md:_w-64', className)}
    >
      <ComboboxInput
        as={Input}
        autoComplete="off"
        value={value}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleFocus}
        type="search"
        placeholder={renderString(themeConfig.search.placeholder)}
        suffix={icon}
      />
      <ComboboxOptions
        transition
        className={cn(
          '_transition-opacity data-[closed]:_opacity-0 data-[open]:_opacity-100',
          'nextra-search-results nextra-scrollbar empty:_invisible',
          overlayClassName
        )}
      >
        {error ? (
          <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-red-500">
            <InformationCircleIcon className="_size-5" />
            {renderString(themeConfig.search.error)}
          </span>
        ) : loading ? (
          <span className="_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm _text-gray-400">
            <SpinnerIcon className="_size-5 _animate-spin" />
            {renderComponent(themeConfig.search.loading)}
          </span>
        ) : results.length ? (
          results.map(({ route, prefix, children, id }) => (
            <Fragment key={id}>
              {prefix}
              <ComboboxOption
                as={NextLink}
                value={route}
                href={route}
                className={cn(
                  '_mx-2.5 _break-words _rounded-md',
                  'contrast-more:_border',
                  'data-[focus]:_ring data-[focus]:_bg-primary-500/10 data-[focus]:_text-primary-600 data-[focus]:contrast-more:_border-primary-500',
                  '_text-gray-800 contrast-more:_border-transparent dark:_text-gray-300',
                  '_block _scroll-m-12 _px-2.5 _py-2'
                )}
              >
                {children}
              </ComboboxOption>
            </Fragment>
          ))
        ) : (
          renderComponent(themeConfig.search.emptyResult)
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
