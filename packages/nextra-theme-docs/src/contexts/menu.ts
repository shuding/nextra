import { useContext, createContext, Dispatch, SetStateAction } from 'react'

interface Menu {
  menu: boolean
  setMenu: Dispatch<SetStateAction<boolean>>
  defaultMenuCollapsed: boolean
}

const MenuContext = createContext<Menu>({
  menu: false,
  setMenu: () => {},
  defaultMenuCollapsed: true
})

export const useMenu = () => useContext(MenuContext)

export const MenuProvider = MenuContext.Provider
