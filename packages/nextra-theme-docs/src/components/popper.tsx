import React, { ReactNode, ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { Menu } from '@headlessui/react'
import { usePopper } from '../utils'
import { useMounted } from 'nextra/hooks'

export function Popper(): ReactElement {
  const [trigger, container] = usePopper({
    placement: 'bottom-end',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
  })

  return (
    <Menu>
      <span className="inline-flex rounded-md shadow-sm">
        <Menu.Button
          ref={trigger}
          className="focus:shadow-outline-blue inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out hover:text-gray-500 focus:border-blue-300 focus:outline-none active:bg-gray-50 active:text-gray-800"
        >
          button
        </Menu.Button>
      </span>

      <Portal>
        <Menu.Items
          className="w-56 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg outline-none"
          ref={container}
        >
          dadadada
        </Menu.Items>
      </Portal>
    </Menu>
  )
}

function Portal(props: { children: ReactNode }): ReactElement | null {
  const mounted = useMounted()
  if (!mounted) return null
  return createPortal(props.children, document.body)
}
