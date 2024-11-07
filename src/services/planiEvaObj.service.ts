import { axiosInstance } from '../api/axios'

export const getEntregablesConCriterios = async (idObjetivo: string) => {
  return await axiosInstance.get(`/objetivos/${idObjetivo}/entregables-criterios`)
}

export const enviarRevision = async (criteriosMarked: Array<number>, marked: boolean) => {
  return await axiosInstance.post('/objetivos/revision-criterio', { revision_criterio_ids: criteriosMarked, estado: marked })
}

export const verificarLlenadoObj = async (obj: number) => {
  return await axiosInstance.get(`/objetivos/${obj}/puede-ser-llenado`)
}
