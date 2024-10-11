import { AxiosPromise } from 'axios'
import { ActivityData, ActivityProps } from '../interfaces/activity.interface'
import { axiosInstance } from '../api/axios'

export const createActivity = (activityData: ActivityData): AxiosPromise<ActivityData> => {
  try {
    return axiosInstance.post('/actividad', activityData)
  } catch (error) {
    console.error('Error creando la actividad:', error)
    throw error
  }
}

export const getActivities = (): AxiosPromise<ActivityProps[]> => {
  return axiosInstance.get('/planificacion/1/actividades-resultados')
}

export const deleteActivity = (identificador: number): AxiosPromise<ActivityData> => {
  return axiosInstance.delete('/actividades/' + identificador)
}
