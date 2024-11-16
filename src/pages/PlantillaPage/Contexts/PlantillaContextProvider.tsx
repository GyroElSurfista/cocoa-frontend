import { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react'

interface CrearPlantillaEvaluacionFinal {
  nombre: string
  descripcion: string
  puntaje: number
  rubricas: unknown[] // Cambia "unknown" por el tipo específico si lo tienes
}

interface PlantillaContextType {
  contextData: CrearPlantillaEvaluacionFinal
  setContextData: Dispatch<SetStateAction<CrearPlantillaEvaluacionFinal>>
}

const INITIAL_STATE: CrearPlantillaEvaluacionFinal = {
  nombre: '',
  descripcion: '',
  puntaje: 0,
  rubricas: [],
}

export const PlantillaContext = createContext<PlantillaContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const PlantillaContextProvider = ({ children }: Props): JSX.Element => {
  const [contextData, setContextData] = useState<CrearPlantillaEvaluacionFinal>(INITIAL_STATE)

  return <PlantillaContext.Provider value={{ contextData, setContextData }}>{children}</PlantillaContext.Provider>
}
