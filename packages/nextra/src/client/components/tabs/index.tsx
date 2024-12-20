'use no memo'

import type { ComponentProps } from 'react'
import { Tabs as _Tabs, Tab } from './index.client.js'

// Workaround to fix
// Error: Cannot access Tab.propTypes on the server. You cannot dot into a client module from a
// server component. You can only pass the imported name through.
export const Tabs = Object.assign(
  (props: ComponentProps<typeof _Tabs>) => <_Tabs {...props} />,
  { Tab }
)
