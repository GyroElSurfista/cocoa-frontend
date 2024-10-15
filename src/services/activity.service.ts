import { AxiosPromise } from 'axios'
import { ActivityData, ActivityProps, ActivityRowProps } from '../interfaces/activity.interface'
import { axiosInstance } from '../api/axios'

export const createActivity = (activityData: ActivityData): AxiosPromise<ActivityData> => {
  try {
    return axiosInstance.post('/actividad', activityData)
  } catch (error) {
    console.error('Error creando la actividad:', error)
    throw error
  }
}

export const getActivities = (idPlanificacion: number): AxiosPromise<ActivityProps[]> => {
  return axiosInstance.get(`/planificacion/${idPlanificacion}/actividades-resultados`)
}

export const searchActivities = (nameActivity: string, idObjetivo: number, idPlanificacion: number): AxiosPromise<ActivityRowProps[]> => {
  return axiosInstance.get(`/actividad/buscar?nombre=${nameActivity}&objetivoId=${idObjetivo}&planificacionId=${idPlanificacion}`)
}

export const deleteActivity = (identificador: number): AxiosPromise<ActivityData> => {
  return axiosInstance.delete('/actividades/' + identificador)
}
