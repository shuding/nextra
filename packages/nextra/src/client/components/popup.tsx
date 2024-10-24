import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition
} from '@headlessui/react'
import cn from 'clsx'
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useRef,
  useState,
  type ComponentProps,
  type PointerEvent
} from 'react'

interface ContextValue {
  open: boolean
  handleOpen: (e: PointerEvent) => void
  handleClose: (e: PointerEvent) => void
}

const PopupContext = createContext<ContextValue | null>(null)

function usePopupContext() {
  const ctx = useContext(PopupContext)
  if (!ctx) throw new Error('usePopupContext must be used within a Popup')

  return ctx
}

function useDebounce(fn: () => void, delay = 200) {
  const timeoutRef = useRef<number>()

  return useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(fn, delay)
  }, [fn, delay])
}

export function Popup(props: Omit<ComponentProps<typeof Popover>, 'as'>) {
  const [open, setOpen] = useState(false)

  const handleOpen = useDebounce(() => setOpen(true))
  const handleClose = useDebounce(() => setOpen(false))

  return (
    <PopupContext.Provider
      value={{
        open,
        handleOpen,
        handleClose
      }}
    >
      <Popover as="span" {...props} />
    </PopupContext.Provider>
  )
}

export function PopupTrigger(
  props: Omit<ComponentProps<typeof PopoverButton>, 'as'>
) {
  const { handleOpen, handleClose } = usePopupContext()

  return (
    <PopoverButton
      as="span"
      onPointerEnter={handleOpen}
      onPointerLeave={handleClose}
      {...props}
    />
  )
}

export function PopupPanel({
  className,
  ...props
}: Omit<ComponentProps<typeof PopoverPanel>, 'anchor'>) {
  const { open, handleOpen, handleClose } = usePopupContext()

  return (
    <Transition
      show={open}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <PopoverPanel
        static={true}
        anchor={{ to: 'bottom', gap: -24 }}
        className={cn(
          '!_max-w-[700px]', // override headlessui's computed max-width
          className
        )}
        onPointerEnter={handleOpen}
        onPointerLeave={handleClose}
        {...props}
      />
    </Transition>
  )
}
