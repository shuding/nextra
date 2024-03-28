import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

interface NavOverflow {
  navOverflow: boolean
  setNavOverflow: Dispatch<SetStateAction<boolean>>
}

const NavOverflowContext = createContext<NavOverflow>({
  navOverflow: false,
  setNavOverflow: () => false
})

export const useNavOverflow = () => useContext(NavOverflowContext)

export const NavOverflowProvider = NavOverflowContext.Provider
