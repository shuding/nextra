import type { UseMDXComponents } from 'nextra/mdx'
import { DEFAULT_COMPONENTS } from 'nextra/mdx'
import { Details } from './details'
import { Summary } from './summary'

export const useMDXComponents: UseMDXComponents = components => {
  return {
    ...DEFAULT_COMPONENTS,
    details: Details,
    summary: Summary,
    ...components
  }
}
