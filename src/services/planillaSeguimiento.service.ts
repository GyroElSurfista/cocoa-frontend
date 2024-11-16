import { axiosInstance } from '../api/axios'

export const generateWeeklyTracking = async (idProject: number) => {
  const response = await axiosInstance.post(`/planificaciones/${idProject}/generar-planillas-seguimiento`)
  return response
}

export const getWeeklyTrackers = async (idObjective: string) => {
  const response = await axiosInstance.get(`/objetivos/${idObjective}/planillas-seguimiento`)
  return response
}

export const getObjectivesFromProject = async (idProyect: number) => {
  return await axiosInstance.get(`/planificaciones/${idProyect}/objetivos`)
}
