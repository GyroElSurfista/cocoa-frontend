import { axiosInstance } from '../api/axios'

export const generateWeeklyTracking = async (idObjective: number) => {
  const response = await axiosInstance.post(`/objetivos/${idObjective}/generar-planillas-seguimiento`)
  return response
}

export const getWeeklyTrackers = async (idObjective: string) => {
  const response = await axiosInstance.get(`/objetivos/${idObjective}/planillas-seguimiento`)
  return response
}
