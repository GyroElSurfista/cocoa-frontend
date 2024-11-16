import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'
import { ParametroEvaluacionFinal } from '../interfaces/plantilla.interface'

export const getAllParametrosEvaluacion = (): AxiosPromise<ParametroEvaluacionFinal[]> => {
  return axiosInstance.get('/parametros-evaluacion-final')
}
