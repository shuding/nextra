'use client'

import type { Dispatch, SetStateAction } from 'react'
import { create } from 'zustand'

const useMenuStore = create<{
  hasMenu: boolean
  actions: {
    setMenu: Dispatch<SetStateAction<boolean>>
  }
}>(set => ({
  hasMenu: false,
  actions: {
    setMenu(hasMenu) {
      if (typeof hasMenu === 'function') {
        set(state => {
          const menu = hasMenu(state.hasMenu)
          // Lock background scroll when menu is opened
          document.body.classList.toggle('_overflow-hidden', menu)
          return { hasMenu: menu }
        })
      } else {
        // Lock background scroll when menu is opened
        document.body.classList.toggle('_overflow-hidden', hasMenu)
        set({ hasMenu })
      }
    }
  }
}))

export const useMenu = () => useMenuStore(state => state.hasMenu)

export const useMenuActions = () => useMenuStore(state => state.actions)
