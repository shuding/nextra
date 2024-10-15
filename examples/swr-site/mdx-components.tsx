import { useMDXComponents as useDocsMDXComponents } from 'nextra-theme-docs'
import { Pre, withIcons } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'

export const useMDXComponents = () =>
  useDocsMDXComponents({
    pre: withIcons(Pre, { js: GitHubIcon })
  })
