import axios from 'axios'

export const EmpresaService = () => {
  return axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas')
}
