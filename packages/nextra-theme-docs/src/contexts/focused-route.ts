import type { Dispatch, SetStateAction } from 'react'
import { create } from 'zustand'

const useFocusedRouteStore = create<{
  focused: string
  actions: {
    setFocused: Dispatch<string>
  }
}>(set => ({
  focused: '',
  actions: {
    setFocused(focused) {
      set({ focused })
    }
  }
}))

export const useFocusedRoute = () =>
  useFocusedRouteStore(state => state.focused)

export const useFocusedRouteActions = () =>
  useFocusedRouteStore(state => state.actions)
