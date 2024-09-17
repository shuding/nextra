import type { Dispatch, SetStateAction } from 'react'
import { create } from 'zustand'

const useFocusedRouteStore = create<{
  focused: string
  actions: {
    setFocused: Dispatch<SetStateAction<string>>
  }
}>(set => ({
  focused: '',
  actions: {
    setFocused(focused) {
      set(state =>
        typeof focused === 'function'
          ? { focused: focused(state.focused) }
          : { focused }
      )
    }
  }
}))

export const useFocusedRoute = () =>
  useFocusedRouteStore(state => state.focused)

export const useFocusedRouteActions = () =>
  useFocusedRouteStore(state => state.actions)
