'use no memo'

import type { Dispatch } from 'react'
import { create } from 'zustand'

const useActiveAnchorStore = create<{
  activeSlug: string
}>(() => ({
  activeSlug: ''
}))

export const useActiveAnchor = () =>
  useActiveAnchorStore(state => state.activeSlug)

export const setActiveSlug: Dispatch<string> = activeSlug => {
  useActiveAnchorStore.setState({ activeSlug })
}
