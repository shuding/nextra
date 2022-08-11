import { createContext, Dispatch, SetStateAction, useContext } from 'react'

const DetailsContext = createContext<Dispatch<SetStateAction<boolean>>>(v => v)

export const useDetails = () => useContext(DetailsContext)

export const DetailsProvider = DetailsContext.Provider
