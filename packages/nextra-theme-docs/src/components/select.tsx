import React, { ReactElement } from 'react'
import cn from 'clsx'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from 'nextra/icons'

interface MenuOption {
  key: string
  name: React.ReactElement | string
}

interface MenuProps {
  selected: MenuOption
  onChange: (option: MenuOption) => void
  options: MenuOption[]
  position?: 'left' | 'right'
}

export function Select({
  options,
  selected,
  position,
  onChange
}: MenuProps): ReactElement {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Button
            className={cn(
              'h-7 w-full cursor-pointer rounded-md px-2 text-left text-xs font-medium text-gray-600 transition-colors focus:outline-none dark:text-gray-400',
              open
                ? 'bg-gray-200 text-gray-900 dark:bg-primary-100/10 dark:text-gray-50'
                : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-primary-100/5 dark:hover:text-gray-50'
            )}
          >
            {selected.name}
          </Listbox.Button>
          <Transition
            show={open}
            as={React.Fragment}
            leave="transition-opacity"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cn(
                'absolute bottom-[130%] z-20 mt-1 max-h-64 min-w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-800 dark:ring-white/20',
                position &&
                  {
                    left: 'rtl:right-0 ltr:left-0',
                    right: 'ltr:right-0 rtl:left-0'
                  }[position]
              )}
            >
              {options.map(option => (
                <Listbox.Option
                  key={option.key}
                  value={option}
                  className={({ active }) =>
                    cn(
                      active
                        ? 'bg-primary-50 text-primary-500 dark:bg-primary-500/10'
                        : 'text-gray-800 dark:text-gray-100',
                      'relative cursor-pointer select-none whitespace-nowrap py-1.5',
                      'ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9'
                    )
                  }
                >
                  {option.name}
                  {option.key === selected.key ? (
                    <span className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center">
                      <CheckIcon />
                    </span>
                  ) : null}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  )
}
