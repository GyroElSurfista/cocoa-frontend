import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'
import { Planificacion } from '../interfaces/project.interface'

export const getProjects = (): AxiosPromise<Planificacion[]> => {
  return axiosInstance.get('/grupo-empresa/3/planificaciones-para-actividades')
}
