import axios from 'axios'

export const generateWeeklyTracking = async (idObjective: number) => {
  const response = await axios.get(`https://cocoabackend.onrender.com/api/objetivos/${idObjective}/generar-planillas-seguimiento`)
  return response
}

export const getWeeklyTrackers = async (idObjective: string) => {
  const response = await axios.get(`https://cocoabackend.onrender.com/api/objetivos/${idObjective}/planillas-seguimiento`)
  return response
}
