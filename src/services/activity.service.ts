import axios, { AxiosPromise } from 'axios'
import { ActivityData, ActivityProps } from '../interfaces/activity.interface'

export const createActivity = async (activityData: ActivityData): AxiosPromise<ActivityData> => {
  try {
    const response = await axios.post('https://cocoabackend.onrender.com/api/actividad', activityData)
    return response.data
  } catch (error) {
    console.error('Error creando la actividad:', error)
    throw error
  }
}

export const getActivities = async (): AxiosPromise<ActivityProps[]> => {
  return await axios.get('https://cocoabackend.onrender.com/api/planificacion/1/actividades-resultados')
}

export const deleteActivity = async (identificador: number): AxiosPromise<ActivityData> => {
  return await axios.delete('https://cocoabackend.onrender.com/api/actividades/' + identificador)
}
