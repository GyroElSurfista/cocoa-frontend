import axios from 'axios'
const BASE_URL = 'https://cocoabackend.onrender.com/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const currentDate = localStorage.getItem('date') ?? '2024-10-28' // Si es null entonces le pasamos la fecha inicial

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
