import { useContext, createContext, Dispatch, SetStateAction } from 'react'

interface Menu {
  menu: boolean
  setMenu: Dispatch<SetStateAction<boolean>>
}

const MenuContext = createContext<Menu>({
  menu: false,
  setMenu: () => {},
})

export const useMenu = () => useContext(MenuContext)

export const MenuProvider = MenuContext.Provider
