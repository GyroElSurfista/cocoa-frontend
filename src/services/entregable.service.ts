import { axiosInstance } from '../api/axios'
import { AxiosPromise } from 'axios'
import * as Entregables from './../interfaces/entregable.interface'

export const getAllObjetivosEntregables = (): AxiosPromise<Entregables.Objetivo[]> => {
  return axiosInstance.get('/objetivos')
}

export const getAllEntregables = (): AxiosPromise<Entregables.Entregable[]> => {
  return axiosInstance.get('/entregables')
}

export const postEntregables = (payload: any): AxiosPromise<any> => {
  return axiosInstance.post('/objetivos/entregables', payload)
}

export const getAllPlanificaciones = (): AxiosPromise<any[]> => {
  return axiosInstance.get('/planificaciones')
}

export const getEntregablesWithObjetive = (idObjetivo: number): AxiosPromise<Entregables.Objetivo> => {
  return axiosInstance.get(`objetivos/${idObjetivo}/entregables`)
}

export const getEntregablesWithCriterios = (idObjetivo: number): AxiosPromise<any> => {
  return axiosInstance.get(`objetivos/${idObjetivo}/entregables-criterios`)
}
