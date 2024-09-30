import axios from 'axios'
import { ActivityData } from './activity.service'

export interface ObjectiveData {
  identificador: number
  identificadorPlani: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: number
  actividad?: ActivityData[]
}

export const createObjective = async (objectiveData: ObjectiveData) => {
  try {
    const response = await axios.post('https://cocoabackend.onrender.com/api/objetivos', objectiveData)
    return response.data
  } catch (error) {
    console.error('Error creando el objetivo:', error)
    throw error
  }
}

export const getObjectives = async () => {
  return await axios.get('https://cocoabackend.onrender.com/api/grupo-empresa/1/objetivos/actividades')
}
