import { axiosInstance } from '../api/axios'
import { AxiosPromise } from 'axios'
import * as Evaluacion from './../interfaces/evaluacion.interface'

export const getAllObjetivosEntregables = (): AxiosPromise<Evaluacion.Objetivo[]> => {
  return axiosInstance.get('/objetivos')
}

export const getAllPlanificaciones = (): AxiosPromise<any[]> => {
  return axiosInstance.get('/planificaciones')
}

export const getObjetivesWhitoutPlanilla = (): AxiosPromise<any[]> => {
  return axiosInstance.get('/objetivos-sin-planilla-evaluacion-generada')
}
export const getObjetivesWhitPlanilla = (): AxiosPromise<any[]> => {
  return axiosInstance.get('/objetivos-con-planilla-evaluacion-generada')
}

export const postGeneratePlanillas = (objetivoId: any, payload: any): Promise<any> => {
  return axiosInstance.post(`/objetivos/${objetivoId}/generar-planilla-evaluacion`, payload)
}

export const getEntregablesWithObjetive = (idObjetivo: number): AxiosPromise<Evaluacion.Objetivo> => {
  return axiosInstance.get(`objetivos/${idObjetivo}/entregables`)
}
