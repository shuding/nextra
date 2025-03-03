'use no memo'
'use client'

import type { Heading } from 'nextra'
import type { ComponentProps } from 'react'
import { createContext, createElement, useContext } from 'react'

const TOCContext = createContext<Heading[]>([])

export const useTOC = () => useContext(TOCContext)

export const TOCProvider = (
  props: ComponentProps<typeof TOCContext.Provider>
) => createElement(TOCContext.Provider, props)
