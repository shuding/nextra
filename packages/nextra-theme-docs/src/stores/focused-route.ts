'use no memo'

import type { Dispatch } from 'react'
import { create } from 'zustand'

const useFocusedRouteStore = create<{
  focused: string
}>(() => ({
  focused: ''
}))

export const useFocusedRoute = () =>
  useFocusedRouteStore(state => state.focused)

export const setFocusedRoute: Dispatch<string> = focused => {
  useFocusedRouteStore.setState({ focused })
}
