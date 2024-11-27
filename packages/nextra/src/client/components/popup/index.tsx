'use no memo'

import { PopoverButton } from '@headlessui/react'
import type { ComponentProps } from 'react'
import { Popup as _Popup, PopupPanel } from './index.client.js'

// Workaround to fix
// Error: Cannot access Popup.Button on the server. You cannot dot into a client
// module from a server component. You can only pass the imported name through.
export const Popup = Object.assign(
  (props: ComponentProps<typeof _Popup>) => <_Popup {...props} />,
  {
    Button: PopoverButton,
    Panel: PopupPanel
  }
)
