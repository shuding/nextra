import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import type { PopoverPanelProps, PopoverProps } from '@headlessui/react'
import cn from 'clsx'
import { createContext, useCallback, useContext, useState } from 'react'
import type { FC, MouseEventHandler } from 'react'

const PopupContext = createContext<boolean | null>(null)

function usePopup(): boolean {
  const ctx = useContext(PopupContext)
  if (typeof ctx !== 'boolean') {
    throw new Error('`usePopup` must be used within a `<Popup>` component')
  }
  return ctx
}

const Popup_: FC<PopoverProps> = props => {
  const [isOpen, setIsOpen] = useState(false)

  const handleMouse: MouseEventHandler = useCallback(event => {
    setIsOpen(event.type === 'mouseenter')
  }, [])

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

const PopupPanel: FC<PopoverPanelProps> = props => {
  const isOpen = usePopup()
  return (
    <PopoverPanel
      static={isOpen}
      anchor={{ to: 'bottom start', gap: -24 }}
      {...props}
      className={cn(
        '!_max-w-2xl', // override headlessui's computed max-width
        props.className
      )}
    />
  )
}

export const Popup = Object.assign(Popup_, {
  Button: PopoverButton,
  Panel: PopupPanel
})
