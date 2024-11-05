import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'

export const getAllParametrosEvaluacion = (): AxiosPromise<unknown> => {
  return axiosInstance.get('/parametros-evaluacion-final')
}
