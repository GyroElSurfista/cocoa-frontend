import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'

export interface Semester {
  identificador: number
  fechaPlaniInici: string
  fechaPlaniRevis: string
  fechaPlaniFin: string
  fechaDesaInici: string
  fechaDesaFin: string
  fechaEvaluInici: string
  fechaEvaluFin: string
}

export const getSemester = (): AxiosPromise<Semester> => {
  return axiosInstance.get('/semestres/actual')
}
