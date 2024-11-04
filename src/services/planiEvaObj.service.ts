import { axiosInstance } from '../api/axios'

export const getEntregablesConCriterios = async () => {
  return await axiosInstance('/objetivos/1/entregables-criterios')
}
