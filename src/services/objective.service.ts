import { AxiosPromise } from 'axios'
import { ActivityData } from '../interfaces/activity.interface'
import { axiosInstance } from '../api/axios'

export interface ObjectiveData {
  identificador?: number
  identificadorPlani: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: number
  actividad?: ActivityData[]
}

export const createObjective = async (objectiveData: ObjectiveData) => {
  try {
    const response = await axiosInstance.post('/objetivos', objectiveData)
    return response.data
  } catch (error) {
    console.error('Error creando el objetivo:', error)
    throw error
  }
}

export const getObjectives = async () => {
  return await axiosInstance.get('/objetivos')
}

export const getPlannings = async () => {
  return await axiosInstance.get('/grupo-empresa/1/planificaciones')
}

export const getObjectivesFromPlanification = async (): AxiosPromise<ObjectiveData[]> => {
  return await axiosInstance.get('/planificaciones/1/objetivos')
}
