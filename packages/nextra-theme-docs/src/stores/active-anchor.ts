import { create } from 'zustand'

const useActiveAnchorStore = create<{
  activeSlug: string
}>(() => ({
  activeSlug: ''
}))

export const useActiveAnchor = () =>
  useActiveAnchorStore(state => state.activeSlug)

export function setActiveSlug(activeSlug: string) {
  useActiveAnchorStore.setState({ activeSlug })
}
