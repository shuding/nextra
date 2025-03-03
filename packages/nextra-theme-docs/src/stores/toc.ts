'use no memo'
'use client'

import type { Heading } from 'nextra'
import { createContext, useContext } from 'react'

const TOCContext = createContext<Heading[]>([])

export const useTOC = () => useContext(TOCContext)

export const TOCProvider = TOCContext.Provider
