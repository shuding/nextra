import {
  Content,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Trigger
} from '@radix-ui/react-dropdown-menu'
import cn from 'clsx'
import { CheckIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useState } from 'react'

interface MenuOption {
  key: string
  name: ReactElement | string
}

interface MenuProps {
  selected: MenuOption
  onChange: (value: string) => void
  options: MenuOption[]
  title: string
  className?: string
}

export function Select({
  options,
  selected,
  onChange,
  title,
  className
}: MenuProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Root open={isOpen} onOpenChange={setIsOpen}>
      <Trigger asChild>
        <button
          title={title}
          className={cn(
            '_h-7 _rounded-md _px-2 _text-left _text-xs _font-medium _text-gray-600 _transition-colors dark:_text-gray-400',
            isOpen
              ? '_bg-gray-200 _text-gray-900 dark:_bg-primary-100/10 dark:_text-gray-50'
              : 'hover:_bg-gray-100 hover:_text-gray-900 dark:hover:_bg-primary-100/5 dark:hover:_text-gray-50',
            className
          )}
        >
          {selected.name}
        </button>
      </Trigger>

      <Portal>
        <Content
          sideOffset={5}
          align="start"
          className="_z-20 _max-h-64 _overflow-auto _rounded-md _ring-1 _ring-black/5 _bg-white _py-1 _text-sm _shadow-lg dark:_ring-white/20 dark:_bg-neutral-800 _min-w-[--radix-dropdown-menu-trigger-width]"
          asChild
        >
          <RadioGroup value={selected.key} onValueChange={onChange}>
            {options.map(option => (
              <RadioItem
                key={option.key}
                value={option.key}
                className={cn(
                  'hover:_bg-primary-50 hover:_text-primary-600 dark:hover:_bg-primary-500/10',
                  '_text-gray-800 dark:_text-gray-100',
                  '_relative _cursor-pointer _whitespace-nowrap _py-1.5',
                  '_transition-colors ltr:_pl-3 ltr:_pr-9 rtl:_pr-3 rtl:_pl-9'
                )}
              >
                {option.name}
                {option.key === selected.key && (
                  <span className="_absolute _inset-y-0 _flex _items-center ltr:_right-3 rtl:_left-3">
                    <CheckIcon />
                  </span>
                )}
              </RadioItem>
            ))}
          </RadioGroup>
        </Content>
      </Portal>
    </Root>
  )
}
