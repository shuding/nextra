import { createContext, useContext } from 'react'
import { Config } from './types'

export const ThemeConfigContext = createContext<Config>({
  title: '',
  meta: {}
})
export const useConfig = () => useContext(ThemeConfigContext)
