import type { ReactElement, ReactNode } from 'react'
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
            'nx-h-7 nx-rounded-md nx-px-2 nx-text-left nx-text-xs nx-font-medium nx-text-gray-600 nx-transition-colors dark:nx-text-gray-400',
            open
              ? 'nx-bg-gray-200 nx-text-gray-900 dark:nx-bg-primary-100/10 dark:nx-text-gray-50'
              : 'hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
            className
          )}
        >
          {selected.name}
          <Portal>
            <Transition
              // @ts-expect-error TODO: fix Property 'ref' does not exist on type
              ref={container}
              show={open}
              as={Listbox.Options}
              className="nx-z-20 nx-max-h-64 nx-overflow-auto nx-rounded-md nx-ring-1 nx-ring-black/5 nx-bg-white nx-py-1 nx-text-sm nx-shadow-lg dark:nx-ring-white/20 dark:nx-bg-neutral-800"
              leave="nx-transition-opacity"
              leaveFrom="nx-opacity-100"
              leaveTo="nx-opacity-0"
            >
              {options.map(option => (
                <Listbox.Option
                  key={option.key}
                  value={option}
                  className={({ active }) =>
                    cn(
                      active
                        ? 'nx-bg-primary-50 nx-text-primary-600 dark:nx-bg-primary-500/10'
                        : 'nx-text-gray-800 dark:nx-text-gray-100',
                      'nx-relative nx-cursor-pointer nx-whitespace-nowrap nx-py-1.5',
                      'nx-transition-colors ltr:nx-pl-3 ltr:nx-pr-9 rtl:nx-pr-3 rtl:nx-pl-9'
                    )
                  }
                >
                  {option.name}
                  {option.key === selected.key && (
                    <span className="nx-absolute nx-inset-y-0 nx-flex nx-items-center ltr:nx-right-3 rtl:nx-left-3">
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
