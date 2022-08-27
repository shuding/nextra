import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'

type ActiveAnchor = Record<
  string,
  {
    isActive?: boolean
    aboveHalfViewport: boolean
    index: number
    insideHalfViewport: boolean
  }
>

const ActiveAnchorContext = createContext<ActiveAnchor>({})
const SetActiveAnchorContext = createContext<
  Dispatch<SetStateAction<ActiveAnchor>>
>(v => v)

// Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.
export const useActiveAnchor = () => useContext(ActiveAnchorContext)
export const useSetActiveAnchor = () => useContext(SetActiveAnchorContext)

export const ActiveAnchorProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [activeAnchor, setActiveAnchor] = useState<ActiveAnchor>({})

  return (
    <ActiveAnchorContext.Provider value={activeAnchor}>
      <SetActiveAnchorContext.Provider value={setActiveAnchor}>
        {children}
      </SetActiveAnchorContext.Provider>
    </ActiveAnchorContext.Provider>
  )
}
