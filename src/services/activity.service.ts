import { AxiosPromise } from 'axios'
import { ActivityData, ActivityProps, ActivityRowProps } from '../interfaces/activity.interface'
import { axiosInstance } from '../api/axios'

export const createActivity = (activityData: ActivityData): AxiosPromise<ActivityData> => {
  try {
    return axiosInstance.post('/actividad', {
      ...activityData,
      nombre: activityData.nombre.trim(),
      descripcion: activityData.descripcion.trim(),
    })
  } catch (error) {
    console.error('Error creando la actividad:', error)
    throw error
  }
}

export const getActivities = (idGrupoEmpresa: number): AxiosPromise<ActivityProps[]> => {
  return axiosInstance.get(`/grupo-empresa/${idGrupoEmpresa}/actividades-resultados`)
}

export const getActivitiesByObjective = (idObjetivo: number): AxiosPromise<ActivityProps[]> => {
  return axiosInstance.get(`/objetivos/${idObjetivo}/actividades-con-resultados`)
}

export const searchActivitiesWithoutObjective = (nameActivity: string, idPlanificacion: number): AxiosPromise<ActivityRowProps[]> => {
  return axiosInstance.get(`/actividad/buscar-actividad?nombre=${nameActivity}&planificacionId=${idPlanificacion}`)
}

export const searchActivitiesWithObjective = (
  nameActivity: string,
  idObjetivo: number,
  idPlanificacion: number
): AxiosPromise<ActivityRowProps[]> => {
  return axiosInstance.get(`/actividad/buscar?nombre=${nameActivity}&objetivoId=${idObjetivo}&planificacionId=${idPlanificacion}`)
}

export const deleteActivity = (identificador: number): AxiosPromise<ActivityData> => {
  return axiosInstance.delete('/actividades/' + identificador)
}

export const deleteManyActivities = (identificadores: number[]): AxiosPromise => {
  return axiosInstance.delete('/actividades', {
    data: {
      ids: identificadores,
    },
  })
}
