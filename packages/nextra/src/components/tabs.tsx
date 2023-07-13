import { Tab as HeadlessTab } from '@headlessui/react'
import cn from 'clsx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

type TabItem = {
  label: string
  disabled?: boolean
}

function isTabItem(item: unknown): item is TabItem {
  if (item && typeof item === 'object' && 'label' in item) return true
  return false
}

const renderTab = (item: string | TabItem) => {
  if (isTabItem(item)) {
    return item.label
  }
  return item
}

export function Tabs({
  items,
  selectedIndex: _selectedIndex,
  defaultIndex = 0,
  onChange,
  children,
  storageKey
}: {
  items: (string | TabItem)[]
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
        setSelectedIndex(
          items.findIndex(
            item => (isTabItem(item) ? item.label : item) === event.newValue!
          )
        )
      }
    }

    const index = items.indexOf(localStorage.getItem(storageKey)!)
    setSelectedIndex(index === -1 ? 0 : index)

    window.addEventListener('storage', fn)
    return () => {
      window.removeEventListener('storage', fn)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  const handleChange = useCallback((index: number) => {
    if (storageKey) {
      const newTabValue = items[index]
      const newValue = isTabItem(newTabValue) ? newTabValue.label : newTabValue
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
      <div className="nextra-scrollbar nx-overflow-x-auto nx-overflow-y-hidden nx-overscroll-x-contain">
        <HeadlessTab.List className="nx-mt-4 nx-flex nx-w-max nx-min-w-full nx-border-b nx-border-gray-200 nx-pb-px dark:nx-border-neutral-800">
          {items.map((item, index) => {
            const disabled = !!(
              item &&
              typeof item === 'object' &&
              'disabled' in item &&
              item.disabled
            )

            return (
              <HeadlessTab
                key={index}
                disabled={disabled}
                className={({ selected }) =>
                  cn(
                    'nx-mr-2 nx-rounded-t nx-p-2 nx-font-medium nx-leading-5 nx-transition-colors',
                    '-nx-mb-0.5 nx-select-none nx-border-b-2',
                    selected
                      ? 'nx-border-primary-500 nx-text-primary-600'
                      : 'nx-border-transparent nx-text-gray-600 hover:nx-border-gray-200 hover:nx-text-black dark:nx-text-gray-200 dark:hover:nx-border-neutral-800 dark:hover:nx-text-white',
                    disabled &&
                      'nx-pointer-events-none nx-text-gray-400 dark:nx-text-neutral-600'
                  )
                }
              >
                {renderTab(item)}
              </HeadlessTab>
            )
          })}
        </HeadlessTab.List>
      </div>
      <HeadlessTab.Panels>{children}</HeadlessTab.Panels>
    </HeadlessTab.Group>
  )
}

export function Tab({
  children,
  ...props
}: ComponentProps<'div'>): ReactElement {
  return (
    <HeadlessTab.Panel {...props} className="nx-rounded nx-pt-6">
      {children}
    </HeadlessTab.Panel>
  )
}
