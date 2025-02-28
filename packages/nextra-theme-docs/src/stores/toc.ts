'use no memo'

import type { Heading } from 'nextra'
import type { Dispatch } from 'react'
import { create } from 'zustand'

const useTocStore = create<{
  toc: Heading[]
}>(() => ({
  toc: []
}))

export const useToc = () => useTocStore(state => state.toc)

export const setToc: Dispatch<Heading[]> = toc => {
  useTocStore.setState({ toc })
}
