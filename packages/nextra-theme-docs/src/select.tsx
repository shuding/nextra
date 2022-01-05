import React from 'react'
import cn from 'classnames'
import { Listbox, Transition } from '@headlessui/react/dist/index.esm'
import Check from './icons/check'

interface MenuOption {
  key: string
  name: React.ReactElement | string
}

interface MenuProps {
  selected: MenuOption
  onChange: (option: MenuOption) => void
  options: MenuOption[]
}

export default function Menu({ options, selected, onChange }: MenuProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Button
            className={cn(
              'rounded-md px-2 w-full text-left font-medium cursor-default text-xs h-7 transition-colors text-gray-600 dark:text-gray-400 focus:outline-none',
              open
                ? 'bg-gray-200 dark:bg-prime-100 dark:bg-opacity-10 text-gray-900 dark:text-gray-50'
                : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-prime-100 dark:hover:bg-opacity-5 dark:hover:text-gray-50'
            )}
          >
            {selected.name}
          </Listbox.Button>
          <Transition
            show={open}
            as={React.Fragment}
            leave="transition"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={
                'absolute bottom-[130%] right-0 min-w-full z-10 mt-1 bg-white dark:bg-neutral-800 dark:ring-white dark:ring-opacity-20 shadow-lg max-h-64 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm'
              }
            >
              {options.map(option => (
                <Listbox.Option
                  key={option.key}
                  value={option}
                  className={({ active }) =>
                    cn(
                      option.key === selected.key ? '' : '',
                      active
                        ? 'text-prime-500 bg-prime-50 dark:bg-prime-500 dark:bg-opacity-10'
                        : 'text-gray-800 dark:text-gray-100',
                      'cursor-default select-none relative py-1.5 pl-3 pr-9'
                    )
                  }
                >
                  {option.name}
                  {option.key === selected.key ? (
                    <span
                      className={cn(
                        'absolute inset-y-0 right-0 flex items-center pr-3'
                      )}
                    >
                      <Check />
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
