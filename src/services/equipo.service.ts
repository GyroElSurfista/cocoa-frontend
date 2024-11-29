import { AxiosPromise } from 'axios'
import { axiosInstance } from '../api/axios'

export const getAllObjetivosEntregables = (): AxiosPromise<any> => {
  return axiosInstance.get('/objetivos')
}

export const getAllPlanificaciones = (): AxiosPromise<any[]> => {
  return axiosInstance.get('/planificaciones')
}

export const getAllEntregables = (): AxiosPromise<any[]> => {
  return axiosInstance.get('/entregables')
}

export const getUsersGrupoEmpresa = (idGrupoEmpresa: any): AxiosPromise<any> => {
  return axiosInstance.get(`grupoEmpresas/${idGrupoEmpresa}/usuarios`)
}

export const getAsistencias = (identificadorPlani: number, fecha: string): AxiosPromise<any> => {
  return axiosInstance.get('/api/grupo-empresa/asistencia', {
    params: {
      identificadorGrupoEmpre: identificadorPlani,
      fecha,
    },
  })
}

export const getEntregablesDinamicos = (idObjective: number, fecha: string): AxiosPromise<any> => {
  return axiosInstance.get(`entregables-dinamicos?identificadorObjet=${idObjective}&fecha=${fecha}`)
}

export const getAsistenciasDate = (idEmpresa: any, fecha: string): AxiosPromise<any> => {
  return axiosInstance.get(`asistencia?grupoEmpresaId=${idEmpresa}&fecha=${fecha}`)
}

export const getActivities = (idPlanilla: any): AxiosPromise<any> => {
  return axiosInstance.get(`planilla-seguimiento/${idPlanilla}/actividades`)
}

export const postAsistencia = (usuarioId: number, fecha: string): AxiosPromise<any> => {
  return axiosInstance.post('/asistencias-asistencia', {
    identificadorUsuar: usuarioId,
    fecha,
    valor: true,
  })
}
export const postInasistencia = (usuarioId: number, fecha: string, identificadorMotiv: number): AxiosPromise<any> => {
  return axiosInstance.post('/asistencias-inasistencia', {
    identificadorUsuar: usuarioId,
    fecha,
    valor: false,
    identificadorMotiv,
  })
}

export const postActividadSeguimiento = (nombre: string, identificadorPlaniSegui: string, observaciones: any): AxiosPromise<any> => {
  return axiosInstance.post('/actividad-seguimiento', {
    nombre,
    identificadorPlaniSegui,
    observaciones,
  })
}

export const getPlanillasSeguimiento = (idObjective: number): AxiosPromise<any> => {
  return axiosInstance.get(`objetivos/${idObjective}/planillas-seguimiento`)
}

export const updateEntregable = (identificador: any, payload: any): AxiosPromise<any> => {
  return axiosInstance.put(`/entregables/update/${identificador}`, payload)
}

export const createEntregable = (payload: any): AxiosPromise<any> => {
  return axiosInstance.post('/entregable', payload)
}

export const saveOrUpdateEntregable = (initialData: any, updatedEntregable: any): AxiosPromise<any> => {
  if (initialData) {
    return updateEntregable(initialData.identificador, updatedEntregable)
  } else {
    return createEntregable(updatedEntregable)
  }
}

export const deleteEntregable = (identificador: number): AxiosPromise<any> => {
  return axiosInstance.delete(`/entregables/eliminar/${identificador}`)
}
