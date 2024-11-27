import axios from 'axios'
const BASE_URL = 'https://cocoabackend.onrender.com/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const currentDate = new Date().toISOString() // Obtener la fecha actual en formato ISO 8601

    config.headers = config.headers || {} // Asegurarse de que los headers existan
    ;(config.headers as Record<string, string>)['X-Current-Date'] = currentDate

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
