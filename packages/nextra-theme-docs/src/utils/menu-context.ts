import { useContext, createContext } from 'react'

interface MenuContextValue {
  menu: boolean
  setMenu: (data: boolean) => any
  defaultMenuCollapsed: boolean
}
export const MenuContext = createContext<MenuContextValue>({
  menu: false,
  setMenu: () => {},
  defaultMenuCollapsed: true
})
export default function useMenuContext() {
  return useContext(MenuContext)
}
