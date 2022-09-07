import React, { ReactElement, ReactNode } from 'react'
import cn from 'clsx'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from 'nextra/icons'
import { usePopper } from '../utils'
import { createPortal } from 'react-dom'
import { useMounted } from 'nextra/hooks'

interface MenuOption {
  key: string
  name: ReactElement | string
}

interface MenuProps {
  selected: MenuOption
  onChange: (option: MenuOption) => void
  options: MenuOption[]
  title?: string
  className?: string
}

export function Select({
  options,
  selected,
  onChange,
  title,
  className
}: MenuProps): ReactElement {
  const [trigger, container] = usePopper({
    strategy: 'fixed',
    placement: 'top-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 10] } },
      {
        name: 'sameWidth',
        enabled: true,
        fn({ state }) {
          state.styles.popper.minWidth = `${state.rects.reference.width}px`
        },
        phase: 'beforeWrite',
        requires: ['computeStyles']
      }
    ]
  })

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <Listbox.Button
          ref={trigger}
          title={title}
          className={cn(
            'h-7 rounded-md px-2 text-left text-xs font-medium text-gray-600 transition-colors dark:text-gray-400',
            open
              ? 'bg-gray-200 text-gray-900 dark:bg-primary-100/10 dark:text-gray-50'
              : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-primary-100/5 dark:hover:text-gray-50',
            className
          )}
        >
          {selected.name}
          <Portal>
            <Transition
              // @ts-ignore
              ref={container}
              show={open}
              as={Listbox.Options}
              className="z-20 max-h-64 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg dark:bg-neutral-800"
              leave="transition-opacity"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
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
                      'relative cursor-pointer whitespace-nowrap py-1.5',
                      'ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9'
                    )
                  }
                >
                  {option.name}
                  {option.key === selected.key && (
                    <span className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center">
                      <CheckIcon />
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Transition>
          </Portal>
        </Listbox.Button>
      )}
    </Listbox>
  )
}

function Portal(props: { children: ReactNode }): ReactElement | null {
  const mounted = useMounted()
  if (!mounted) return null
  return createPortal(props.children, document.body)
}
