import {
  Tab as HeadlessTab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/react'
import cn from 'clsx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

type TabItem = string | ReactElement

type TabObjectItem = {
  label: TabItem
  disabled: boolean
}

function isTabObjectItem(item: unknown): item is TabObjectItem {
  return !!item && typeof item === 'object' && 'label' in item
}

function Tabs_({
  items,
  selectedIndex: _selectedIndex,
  defaultIndex = 0,
  onChange,
  children,
  storageKey
}: {
  items: (TabItem | TabObjectItem)[]
  selectedIndex?: number
  defaultIndex?: number
  onChange?: (index: number) => void
  children: ReactNode
  storageKey?: string
}): ReactElement {
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
        className={cn(
          'nextra-scrollbar _overflow-x-auto _overscroll-x-contain _overflow-y-hidden',
          '_mt-4 _flex _w-full _gap-2 _border-b _border-gray-200 _pb-px dark:_border-neutral-800'
        )}
      >
        {items.map((item, index) => (
          <HeadlessTab
            key={index}
            disabled={isTabObjectItem(item) && item.disabled}
            className={cn(
              '_ring-inset',
              '_rounded-t _p-2 _font-medium _leading-5 _transition-colors',
              '_-mb-0.5 _select-none _border-b-2',
              'data-[selected]:!_border-current data-[selected]:!_text-primary-600',
              '_border-transparent _text-gray-600 hover:_border-gray-200 hover:_text-black dark:_text-gray-200 dark:hover:_border-neutral-800 dark:hover:_text-white',
              'disabled:_pointer-events-none disabled:_text-gray-400 disabled:dark:_text-neutral-600'
            )}
          >
            {isTabObjectItem(item) ? item.label : item}
          </HeadlessTab>
        ))}
      </TabList>
      <TabPanels>{children}</TabPanels>
    </TabGroup>
  )
}

function Tab({
  children,
  // For SEO display all the Panel in the DOM and set `display: none;` for those that are not selected
  unmount = false,
  ...props
}: Omit<ComponentProps<typeof TabPanel>, 'static'>): ReactElement {
  return (
    <TabPanel {...props} unmount={unmount} className="_rounded _mt-6">
      {children}
    </TabPanel>
  )
}

export const Tabs = Object.assign(Tabs_, { displayName: 'Tabs', Tab })
