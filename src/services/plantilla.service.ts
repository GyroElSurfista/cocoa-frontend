import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'
import { CrearPlantillaEvaluacionFinal, Plantilla } from '../interfaces/plantilla.interface'

export const createPlantillaEvaluacionFinal = (plantillaData: CrearPlantillaEvaluacionFinal): AxiosPromise<Plantilla> => {
  return axiosInstance.post('/plantillas-evaluacion-final', plantillaData)
}
