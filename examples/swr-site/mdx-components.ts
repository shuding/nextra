import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Pre, withIcons } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'
import type { UseMDXComponents } from 'nextra/mdx-components'

const docsComponents = getDocsMDXComponents({
  pre: withIcons(Pre, { js: GitHubIcon })
})

export const useMDXComponents: UseMDXComponents<typeof docsComponents> = <T>(
  components?: T
) => ({
  ...docsComponents,
  ...components
})
