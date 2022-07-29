import React, { useContext } from 'react'
import { createContext, PropsWithChildren } from 'react'
import { LayoutProps } from './types'

const BlogContext = createContext<LayoutProps | null>(null)

export const BlogProvider: React.FC<PropsWithChildren<LayoutProps>> = ({
  config,
  children,
  opts
}) => {
  return (
    <BlogContext.Provider value={{ config, opts }}>
      {children}
    </BlogContext.Provider>
  )
}

export const useBlogContext = () => {
  const value = useContext(BlogContext)
  if (!value) {
    throw new Error('useBlogContext must be used within a BlogProvider')
  }
  return value
}
