import { createContext, useContext } from 'react'

const SSGContext = createContext({})

export default SSGContext
export const useSSG = () => useContext(SSGContext)
