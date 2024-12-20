'use client'

import { Popover, PopoverPanel } from '@headlessui/react'
import type { PopoverPanelProps, PopoverProps } from '@headlessui/react'
import cn from 'clsx'
import { createContext, useContext, useState } from 'react'
import type { FC, MouseEventHandler } from 'react'

const PopupContext = createContext<boolean | null>(null)

function usePopup(): boolean {
  const ctx = useContext(PopupContext)
  if (typeof ctx !== 'boolean') {
    // eslint-disable-next-line unicorn/prefer-type-error -- Doesn't fit in this case
    throw new Error('`usePopup` must be used within a `<Popup>` component')
  }
  return ctx
}

export const Popup: FC<PopoverProps> = props => {
  const [isOpen, setIsOpen] = useState(false)

  const handleMouse: MouseEventHandler = event => {
    setIsOpen(event.type === 'mouseenter')
  }

  return (
    <PopupContext.Provider value={isOpen}>
      <Popover
        as="span"
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        {...props}
      />
    </PopupContext.Provider>
  )
}

export const PopupPanel: FC<PopoverPanelProps> = props => {
  const isOpen = usePopup()
  return (
    <PopoverPanel
      static={isOpen}
      anchor={{ to: 'bottom start', gap: -24 }}
      {...props}
      className={cn(
        'x:max-w-2xl!', // Override headlessui's computed max-width
        props.className
      )}
    />
  )
}
