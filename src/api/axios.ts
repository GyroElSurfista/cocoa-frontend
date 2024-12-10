import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const currentSemester = localStorage.getItem('id-semester') // Le pasamos el semestre seleccionado (CAMBIAR)

    config.headers = config.headers || {} // Asegurarse de que los headers existan
    config.headers['X-Current-Semester'] = currentSemester || ''
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
