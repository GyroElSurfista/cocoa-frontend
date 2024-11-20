import { axiosInstance } from '../api/axios'

export const generateWeeklyTracking = async (idProject: number) => {
  const response = await axiosInstance.post(`/planificaciones/${idProject}/generar-planillas-seguimiento`)
  return response
}

export const getWeeklyTrackers = async (idProject: string) => {
  const response = await axiosInstance.get(`/planificaciones/${idProject}/objetivos-planillas-seguimiento`)
  return response
}

export const getObjectivesFromProject = async (idProyect: number | string) => {
  return await axiosInstance.get(`/planificaciones/${idProyect}/objetivos`)
}
