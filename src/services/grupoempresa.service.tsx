import axios, { AxiosPromise } from 'axios'
import { UserData } from '../interfaces/user.interface'

/* export const EmpresaService = () => {
  return axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas')
} */

export const getUsuariosGrupoEmpresa = (): AxiosPromise<UserData[]> => {
  return axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas/1/usuarios')
}
