import { AxiosPromise } from 'axios'
import { ActivityData, ActivityProps } from '../interfaces/activity.interface'
import { axiosInstance } from '../api/axios'

export interface ObjectiveData {
  identificador?: number
  identificadorPlani: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: number
  nombrePlani: string
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
  return await axiosInstance.get('/planificaciones')
}

export const getObjectivesFromPlanification = async (idPlanning: number): AxiosPromise<ObjectiveData[]> => {
  return await axiosInstance.get(`/planificaciones/${idPlanning}/objetivos`)
}

export const getActivitiesByObjective = async (idObjetivo: number): AxiosPromise<ActivityProps[]> => {
  return await axiosInstance.get(`/objetivos/${idObjetivo}/actividades`)
}
