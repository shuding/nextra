import { PageOpts } from 'nextra'
import { createContext, useContext } from 'react'
import { DocsThemeConfig } from './types'

interface Config extends DocsThemeConfig {
  unstable_flexsearch?: PageOpts['unstable_flexsearch']
}

export const ThemeConfigContext = createContext<Config>({})
export const useConfig = () => useContext(ThemeConfigContext)
