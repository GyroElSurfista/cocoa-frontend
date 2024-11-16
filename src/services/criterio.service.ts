import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'
import { CriterioEvaluacionFinal } from '../interfaces/plantilla.interface'

export const getAllCriteriosEvaluacion = (): AxiosPromise<CriterioEvaluacionFinal[]> => {
  return axiosInstance.get('/criterios-evaluacion-final')
}
