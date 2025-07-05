'use client'

import {
  Tab as HeadlessTab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/react'
import type {
  TabProps as HeadlessTabProps,
  TabGroupProps,
  TabListProps,
  TabPanelProps
} from '@headlessui/react'
import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { Children, Fragment, useEffect, useState } from 'react'
import { useHash } from '../../hooks/use-hash.js'

// eslint-disable-next-line sonarjs/redundant-type-aliases
type TabItem = string

interface TabObjectItem {
  label: TabItem
  disabled: boolean
}

function isTabObjectItem(item: unknown): item is TabObjectItem {
  return !!item && typeof item === 'object' && 'label' in item
}

export const Tabs: FC<
  {
    /**
     * @deprecated Use `Tabs.Tab#label` and `Tabs.Tab#disabled` props instead.
     */
    items?: (TabItem | TabObjectItem)[]
    children: ReactNode
    /** LocalStorage key for persisting the selected tab. */
    storageKey?: string
    /** Tabs CSS class name. */
    className?: TabListProps['className']
    /** Tab CSS class name. */
    tabClassName?: HeadlessTabProps['className']
  } & Pick<TabGroupProps, 'defaultIndex' | 'selectedIndex' | 'onChange'>
> = ({
  children,
  storageKey,
  defaultIndex = 0,
  selectedIndex: _selectedIndex,
  onChange,
  className,
  tabClassName,
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
  const hash = useHash()

  useEffect(() => {
    if (_selectedIndex !== undefined) {
      setSelectedIndex(_selectedIndex)
    }
  }, [_selectedIndex])

  const hasLabelPropInTab = Children.toArray(children).some(
    child => (child as any).props.label
  )
  const items: TabObjectItem[] = hasLabelPropInTab
    ? (children as any).map((child: any) => child.props as TabObjectItem)
    : // eslint-disable-next-line @typescript-eslint/no-deprecated
      props.items!.map(item => {
        if (!isTabObjectItem(item)) {
          return { id: item }
        }
        return {
          id: item.label,
          disabled: item.disabled
        }
      })

  useEffect(() => {
    if (!hash) return
    const index = items.findIndex(item => item.label === hash)
    if (index === -1) return
    setSelectedIndex(index)

    // Clear hash first, otherwise the page isn't scrolled
    location.hash = ''
    // Execute on next tick after `selectedIndex` update
    requestAnimationFrame(() => {
      location.hash = `#${hash}`
    })
  }, [hash]) // eslint-disable-line react-hooks/exhaustive-deps -- check only hash

  useEffect(() => {
    if (!storageKey) {
      // Do not listen to storage events if there is no storage key
      return
    }

    function fn(event: StorageEvent) {
      if (event.key === storageKey) {
        setSelectedIndex(Number(event.newValue))
      }
    }

    const index = Number(localStorage.getItem(storageKey))
    setSelectedIndex(Number.isNaN(index) ? 0 : index)

    window.addEventListener('storage', fn)
    return () => {
      window.removeEventListener('storage', fn)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  const handleChange = (index: number) => {
    if (storageKey) {
      const newValue = String(index)
      localStorage.setItem(storageKey, newValue)

      // the storage event only get picked up (by the listener) if the localStorage was changed in
      // another browser's tab/window (of the same app), but not within the context of the current tab.
      window.dispatchEvent(
        new StorageEvent('storage', { key: storageKey, newValue })
      )
      return
    }
    setSelectedIndex(index)
    onChange?.(index)
  }

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      defaultIndex={defaultIndex}
      onChange={handleChange}
      as={Fragment}
    >
      <TabList
        className={args =>
          cn(
            'nextra-scrollbar x:overflow-x-auto x:overscroll-x-contain x:overflow-y-hidden',
            'x:mt-4 x:flex x:w-full x:gap-2 x:border-b x:border-gray-200 x:pb-px x:dark:border-neutral-800',
            'x:focus-visible:nextra-focus',
            typeof className === 'function' ? className(args) : className
          )
        }
      >
        {items.map((item, index) => {
          return (
            <HeadlessTab
              onClick={() => {
                history.replaceState(null, '', `#${item.label}`)
              }}
              key={index}
              disabled={item.disabled}
              className={args => {
                const { selected, disabled, hover, focus } = args
                return cn(
                  focus && 'x:nextra-focus x:ring-inset',
                  'x:whitespace-nowrap x:cursor-pointer',
                  'x:rounded-t x:p-2 x:font-medium x:leading-5 x:transition-colors',
                  'x:-mb-0.5 x:select-none x:border-b-2',
                  selected
                    ? 'x:border-current x:outline-none'
                    : hover
                      ? 'x:border-gray-200 x:dark:border-neutral-800'
                      : 'x:border-transparent',
                  selected
                    ? 'x:text-primary-600'
                    : disabled
                      ? 'x:text-gray-400 x:dark:text-neutral-600 x:pointer-events-none'
                      : hover
                        ? 'x:text-black x:dark:text-white'
                        : 'x:text-gray-600 x:dark:text-gray-200',
                  typeof tabClassName === 'function'
                    ? tabClassName(args)
                    : tabClassName
                )
              }}
            >
              <h3
                // Subtitle for pagefind search
                id={item.label}
                className="x:size-0 x:invisible"
              >
                {item.label}
              </h3>
              {item.label}
            </HeadlessTab>
          )
        })}
      </TabList>
      <TabPanels>{children}</TabPanels>
    </TabGroup>
  )
}

export const Tab: FC<TabPanelProps & { label: string }> = ({
  children,
  // For SEO display all the Panel in the DOM and set `display: none;` for those that are not selected
  unmount = false,
  className,
  label: _label,
  ...props
}) => {
  return (
    <TabPanel
      {...props}
      unmount={unmount}
      className={args =>
        cn(
          'x:rounded x:mt-[1.25em]',
          args.focus && 'x:nextra-focus',
          typeof className === 'function' ? className(args) : className
        )
      }
    >
      {children}
    </TabPanel>
  )
}
