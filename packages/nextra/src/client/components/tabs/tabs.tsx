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
import type { FC, ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

type TabItem = string | ReactElement

type TabObjectItem = {
  label: TabItem
  disabled: boolean
}

function isTabObjectItem(item: unknown): item is TabObjectItem {
  return !!item && typeof item === 'object' && 'label' in item
}

export const Tabs: FC<
  {
    items: (TabItem | TabObjectItem)[]
    children: ReactNode
    storageKey?: string
    className?: TabListProps['className']
    tabClassName?: HeadlessTabProps['className']
  } & Pick<TabGroupProps, 'defaultIndex' | 'selectedIndex' | 'onChange'>
> = ({
  items,
  children,
  storageKey,
  defaultIndex = 0,
  selectedIndex: _selectedIndex,
  onChange,
  className,
  tabClassName
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)

  useEffect(() => {
    if (_selectedIndex !== undefined) {
      setSelectedIndex(_selectedIndex)
    }
  }, [_selectedIndex])

  useEffect(() => {
    if (!storageKey) {
      // Do not listen storage events if there is no storage key
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

  const handleChange = useCallback((index: number) => {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      defaultIndex={defaultIndex}
      onChange={handleChange}
      tabIndex={-1} // disables focus in Firefox
    >
      <TabList
        className={args =>
          cn(
            'nextra-scrollbar _overflow-x-auto _overscroll-x-contain _overflow-y-hidden',
            '_mt-4 _flex _w-full _gap-2 _border-b _border-gray-200 _pb-px dark:_border-neutral-800',
            'nextra-focus',
            typeof className === 'function' ? className(args) : className
          )
        }
      >
        {items.map((item, index) => (
          <HeadlessTab
            key={index}
            disabled={isTabObjectItem(item) && item.disabled}
            className={args => {
              const { selected, disabled, hover, focus } = args
              return cn(
                focus && 'nextra-focusable _ring-inset',
                selected && '_outline-none',
                '_whitespace-nowrap',
                '_rounded-t _p-2 _font-medium _leading-5 _transition-colors',
                '_-mb-0.5 _select-none _border-b-2',
                selected
                  ? '_border-current'
                  : hover
                    ? '_border-gray-200 dark:_border-neutral-800'
                    : '_border-transparent',
                selected
                  ? '_text-primary-600'
                  : disabled
                    ? '_text-gray-400 dark:_text-neutral-600 _pointer-events-none'
                    : hover
                      ? '_text-black dark:_text-white'
                      : '_text-gray-600 dark:_text-gray-200',
                typeof tabClassName === 'function'
                  ? tabClassName(args)
                  : tabClassName
              )
            }}
          >
            {isTabObjectItem(item) ? item.label : item}
          </HeadlessTab>
        ))}
      </TabList>
      <TabPanels>{children}</TabPanels>
    </TabGroup>
  )
}

export const Tab: FC<TabPanelProps> = ({
  children,
  // For SEO display all the Panel in the DOM and set `display: none;` for those that are not selected
  unmount = false,
  className,
  ...props
}) => {
  return (
    <TabPanel
      {...props}
      unmount={unmount}
      className={args =>
        cn(
          '_rounded _mt-6',
          args.focus && 'nextra-focusable',
          typeof className === 'function' ? className(args) : className
        )
      }
    >
      {children}
    </TabPanel>
  )
}
