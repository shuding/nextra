import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import type { PopoverPanelProps, PopoverProps } from '@headlessui/react'
import cn from 'clsx'
import type { FC } from 'react'
import { createContext, useContext, useState } from 'react'

const PopupContext = createContext<boolean | null>(null)

function usePopup() {
  const ctx = useContext(PopupContext)
  if (typeof ctx !== 'boolean') {
    throw new Error('usePopupContext must be used within a Popup')
  }
  return ctx
}

export const Popup: FC<PopoverProps> = props => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <PopupContext.Provider value={isOpen}>
      <Popover
        as="span"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        {...props}
      />
    </PopupContext.Provider>
  )
}

export const PopupTrigger = PopoverButton

export const PopupPanel: FC<PopoverPanelProps> = props => {
  const isOpen = usePopup()
  return (
    <PopoverPanel
      static={isOpen}
      anchor={{ to: 'bottom', gap: -24 }}
      {...props}
      className={cn(
        '!_max-w-2xl', // override headlessui's computed max-width
        props.className
      )}
    />
  )
}
