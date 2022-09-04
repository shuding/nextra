import { useContext } from 'react'
import { DetailsContext } from '../components/details'

export const useDetails = () => useContext(DetailsContext)
