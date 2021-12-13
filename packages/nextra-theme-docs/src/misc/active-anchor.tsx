import React, { createContext, useContext, useState } from 'react'

export type ActiveAnchor = Record<
  string,
  {
    isActive?: boolean
    aboveHalfViewport: boolean
    index: number
    insideHalfViewport: boolean
  }
>
const ActiveAnchorContext = createContext<ActiveAnchor>({})
const ActiveAnchorSetterContext = createContext<
  (value: ActiveAnchor | ((prevState: ActiveAnchor) => ActiveAnchor)) => void
>(s => s)

// Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.
export const useActiveAnchor = () => useContext(ActiveAnchorContext)
export const useActiveAnchorSet = () => useContext(ActiveAnchorSetterContext)
export const ActiveAnchor: React.FC = ({ children }) => {
  const state = useState<ActiveAnchor>({})
  return (
    <ActiveAnchorContext.Provider value={state[0]}>
      <ActiveAnchorSetterContext.Provider value={state[1]}>
        {children}
      </ActiveAnchorSetterContext.Provider>
    </ActiveAnchorContext.Provider>
  )
}
