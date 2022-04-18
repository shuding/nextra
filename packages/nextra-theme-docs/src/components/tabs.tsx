import React from 'react'
import cn from 'classnames'
import { Tab as HeadlessTab } from '@headlessui/react'

type TabItem = {
  label: React.ReactElement
  disabled?: boolean
}

export function Tabs({
  items,
  defaultIndex,
  onChange,
  children
}: {
  items: React.ReactNode[] | TabItem[]
  defaultIndex?: number
  onChange?: (index: number) => void
  children: React.ReactNode
}) {
  return (
    <HeadlessTab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <div className="p-2 -m-2 overscroll-x-contain overflow-x-auto overflow-y-hidden no-scrollbar">
        <HeadlessTab.List className="flex mt-4 pb-[1px] border-b border-gray-200 dark:border-neutral-800 w-max min-w-full">
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
                    'p-2 mr-2 leading-5 font-medium text-md transition-colors',
                    'select-none border-b-2 mb-[-2px] focus:outline-none focus-visible:ring ring-offset-2 rounded-[1px]',
                    selected
                      ? 'text-primary-500 border-primary-500'
                      : 'text-gray-600 dark:text-gray-200 hover:border-gray-200 dark:hover:border-neutral-800 border-transparent hover:text-black dark:hover:text-white',
                    disabled
                      ? 'pointer-events-none text-gray-400 dark:text-neutral-600'
                      : ''
                  )
                }
              >
                {item && typeof item === 'object' && 'label' in item
                  ? item.label
                  : item}
              </HeadlessTab>
            )
          })}
        </HeadlessTab.List>
      </div>
      <HeadlessTab.Panels>{children}</HeadlessTab.Panels>
    </HeadlessTab.Group>
  )
}

export function Tab({ children }: { children: React.ReactNode }) {
  return (
    <HeadlessTab.Panel className="focus:outline-none focus-visible:ring">
      {children}
    </HeadlessTab.Panel>
  )
}
