import { PageOpt } from 'nextra'
import React from 'react'
import { DocsThemeConfig } from './types'
interface Config extends DocsThemeConfig {
  unstable_flexsearch?: PageOpt['unstable_flexsearch']
}
export const ThemeConfigContext = React.createContext<Config>({})
export const useConfig = () => React.useContext(ThemeConfigContext)
