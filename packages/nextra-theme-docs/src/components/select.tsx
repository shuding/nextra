import { Listbox, Transition } from '@headlessui/react'
import cn from 'clsx'
import { useMounted } from 'nextra/hooks'
import { CheckIcon } from 'nextra/icons'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from '../utils'

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
            '_h-7 _rounded-md _px-2 _text-left _text-xs _font-medium _text-gray-600 _transition-colors dark:_text-gray-400',
            open
              ? '_bg-gray-200 _text-gray-900 dark:_bg-primary-100/10 dark:_text-gray-50'
              : 'hover:_bg-gray-100 hover:_text-gray-900 dark:hover:_bg-primary-100/5 dark:hover:_text-gray-50',
            className
          )}
        >
          {selected.name}
          <Portal>
            <Transition
              ref={container}
              show={open}
              as={Listbox.Options}
              className="_z-20 _max-h-64 _overflow-auto _rounded-md _ring-1 _ring-black/5 _bg-white _py-1 _text-sm _shadow-lg dark:_ring-white/20 dark:_bg-neutral-800"
              leave="_transition-opacity"
              leaveFrom="_opacity-100"
              leaveTo="_opacity-0"
            >
              {options.map(option => (
                <Listbox.Option
                  key={option.key}
                  value={option}
                  className={({ active }) =>
                    cn(
                      active
                        ? '_bg-primary-50 _text-primary-600 dark:_bg-primary-500/10'
                        : '_text-gray-800 dark:_text-gray-100',
                      '_relative _cursor-pointer _whitespace-nowrap _py-1.5',
                      '_transition-colors ltr:_pl-3 ltr:_pr-9 rtl:_pr-3 rtl:_pl-9'
                    )
                  }
                >
                  {option.name}
                  {option.key === selected.key && (
                    <span className="_absolute _inset-y-0 _flex _items-center ltr:_right-3 rtl:_left-3">
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
