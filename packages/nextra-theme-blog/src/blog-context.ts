'use client'

import { createContext, useContext } from 'react'
import type { NextraBlogTheme } from './types'

const BlogContext = createContext<NextraBlogTheme>({})

export const BlogProvider = BlogContext.Provider

export const useBlogContext = () => useContext(BlogContext)
