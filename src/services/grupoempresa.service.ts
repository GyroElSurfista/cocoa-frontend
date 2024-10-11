import { AxiosPromise } from 'axios'
import { UserData } from '../interfaces/user.interface'
import { axiosInstance } from '../api/axios'

/* export const EmpresaService = () => {
  return axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas')
} */

export const getUsuariosGrupoEmpresa = (): AxiosPromise<UserData[]> => {
  return axiosInstance.get('/grupoEmpresas/1/usuarios')
}
