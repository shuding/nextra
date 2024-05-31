import { createContext, useContext } from 'react'
import type { LayoutProps } from './types'

const BlogContext = createContext<LayoutProps | null>(null)

export const BlogProvider = BlogContext.Provider

export const useBlogContext = () => {
  const value = useContext(BlogContext)
  if (!value) {
    throw new Error('useBlogContext must be used within a BlogProvider')
  }
  return value
}
