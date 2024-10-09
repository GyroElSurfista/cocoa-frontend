import axios from 'axios'
import { ActivityData } from '../interfaces/activity.interface'

export const createActivity = async (activityData: ActivityData) => {
  try {
    const response = await axios.post('https://cocoabackend.onrender.com/api/crear-actividades', activityData)
    return response.data
  } catch (error) {
    console.error('Error creando la actividad:', error)
    throw error
  }
}

export const getActivities = async () => {
  return await axios.get('https://cocoabackend.onrender.com/api/actividades')
}

export const deleteActivity = async (identificador: number) => {
  return await axios.delete('https://cocoabackend.onrender.com/api/actividades/' + identificador)
}
