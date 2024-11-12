import { useContext } from 'react'
import { PlantillaContext } from './PlantillaContextProvider'

export const usePlantillaContext = () => {
  const context = useContext(PlantillaContext)
  if (!context) {
    throw new Error('usePlantillaContext must be used within a PlantillaContextProvider')
  }
  return context
}
