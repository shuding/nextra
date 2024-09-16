'use client'

import { create } from 'zustand'

const useMenuStore = create<{
  hasMenu: boolean
  actions: {
    setMenu: (menu: boolean) => void
  }
}>(set => ({
  hasMenu: false,
  actions: {
    setMenu(menu) {
      // Lock background scroll when menu is opened
      document.body.classList.toggle('_overflow-hidden', menu)

      set({ hasMenu: menu })
    }
  }
}))

export const useMenu = () => useMenuStore(state => state.hasMenu)

export const useMenuActions = () => useMenuStore(state => state.actions)
