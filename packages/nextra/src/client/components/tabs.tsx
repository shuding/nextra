import { Tab as HeadlessTab } from '@headlessui/react'
import cn from 'clsx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

type TabItem = string | ReactNode

type TabObjectItem = {
  label: TabItem
  disabled: boolean
}

function isTabObjectItem(item: unknown): item is TabObjectItem {
  return !!item && typeof item === 'object' && 'label' in item
}

function _Tabs({
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
    <HeadlessTab.Group
      selectedIndex={selectedIndex}
      defaultIndex={defaultIndex}
      onChange={handleChange}
    >
      <div className="nextra-scrollbar _overflow-x-auto _overflow-y-hidden _overscroll-x-contain">
        <HeadlessTab.List className="_mt-4 _flex _w-max _min-w-full _border-b _border-gray-200 _pb-px dark:_border-neutral-800">
          {items.map((item, index) => {
            const disabled = isTabObjectItem(item) && item.disabled
            return (
              <HeadlessTab
                key={index}
                disabled={disabled}
                className={({ selected }) =>
                  cn(
                    '_mr-2 _rounded-t _p-2 _font-medium _leading-5 _transition-colors',
                    '_-mb-0.5 _select-none _border-b-2',
                    selected
                      ? '_border-primary-500 _text-primary-600'
                      : '_border-transparent _text-gray-600 hover:_border-gray-200 hover:_text-black dark:_text-gray-200 dark:hover:_border-neutral-800 dark:hover:_text-white',
                    disabled &&
                      '_pointer-events-none _text-gray-400 dark:_text-neutral-600'
                  )
                }
              >
                {isTabObjectItem(item) ? item.label : item}
              </HeadlessTab>
            )
          })}
        </HeadlessTab.List>
      </div>
      <HeadlessTab.Panels>{children}</HeadlessTab.Panels>
    </HeadlessTab.Group>
  )
}

function Tab({
  children,
  ...props
}: ComponentProps<typeof HeadlessTab.Panel>): ReactElement {
  return (
    <HeadlessTab.Panel {...props} className="_rounded _pt-6">
      {children}
    </HeadlessTab.Panel>
  )
}

export const Tabs = Object.assign(_Tabs, { displayName: 'Tabs', Tab })
