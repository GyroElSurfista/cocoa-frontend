import { axiosInstance } from '../api/axios'

export const getEntregablesConCriterios = async () => {
  return await axiosInstance.get('/objetivos/1/entregables-criterios')
}

export const enviarRevision = async (criteriosMarked: Array<number>, marked: boolean) => {
  return await axiosInstance.post('/objetivos/revision-criterio', { revision_criterio_ids: criteriosMarked, estado: marked })
}
