'use client'

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import cn from 'clsx'
import type { Dispatch, FC, ReactNode } from 'react'
import { Fragment } from 'react'
import { CheckIcon } from '../icons/index.js'

interface MenuOption {
  id: string
  name: string
}

interface MenuProps {
  selectedOption: ReactNode
  value: string
  onChange: Dispatch<string>
  options: MenuOption[]
  title?: string
  className?: string
}

export const Select: FC<MenuProps> = ({
  options,
  onChange,
  selectedOption,
  value,
  title,
  className
}) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        title={title}
        className={({ hover, open, focus }) =>
          cn(
            'x:cursor-pointer',
            'x:h-7 x:rounded-md x:px-2 x:text-xs x:font-medium x:transition-colors',
            open
              ? 'x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/10 x:dark:text-gray-50'
              : hover
                ? 'x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/5 x:dark:text-gray-50'
                : 'x:text-gray-600 x:dark:text-gray-400',
            focus && 'x:nextra-focus',
            className
          )
        }
      >
        {selectedOption}
      </ListboxButton>
      <ListboxOptions
        as="ul"
        transition
        anchor={{ to: 'top start', gap: 10 }}
        className={({ open }) =>
          cn(
            'x:focus-visible:nextra-focus',
            open ? 'x:opacity-100' : 'x:opacity-0',
            'x:motion-reduce:transition-none x:transition-opacity x:min-w-(--button-width) x:z-20 x:max-h-64 x:rounded-md x:border x:border-black/5 x:backdrop-blur-md x:bg-nextra-bg/70 x:py-1 x:text-sm x:shadow-lg x:dark:border-white/20'
          )
        }
      >
        {options.map(option => (
          <ListboxOption key={option.id} value={option.id} as={Fragment}>
            {({ selected, focus }) => (
              <li
                className={cn(
                  focus
                    ? 'x:bg-primary-100 x:text-primary-800 x:dark:text-primary-500 x:dark:bg-primary-500/10'
                    : 'x:text-gray-800 x:dark:text-gray-100',
                  'x:cursor-pointer x:whitespace-nowrap x:py-1.5 x:px-3',
                  'x:transition-colors',
                  selected && 'x:flex x:items-center x:justify-between x:gap-3'
                )}
              >
                {option.name}
                {selected && <CheckIcon height="1em" />}
              </li>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
