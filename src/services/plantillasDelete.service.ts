import { axiosInstance } from '../api/axios'
import { AxiosPromise } from 'axios'

export const deletePlantilla = (plantillaId: any): AxiosPromise<any> => {
  return axiosInstance.delete(`/plantillas-evaluacion-final/${plantillaId}`)
}

export const getAllPlantillasEvaluation = (): AxiosPromise<any> => {
  return axiosInstance.get('/plantillas-evaluacion-final')
}
