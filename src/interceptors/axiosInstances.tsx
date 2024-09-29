import axios from 'axios'

// Crear una instancia de Axios con la configuración predeterminada
const axiosInstance = axios.create({
  baseURL: 'https://cocoabackend.onrender.com/api/', // Configuración de la base URL
})

// Aplicar interceptores
axiosInstance.interceptors.request.use(
  (request) => {
    console.log('Starting request', request)
    // Aquí puedes añadir tokens o headers personalizados si es necesario.
    return request
  },
  (error) => {
    // Manejar errores antes de enviar la solicitud
    return Promise.reject(error)
  }
)

// Manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    // Manejar la respuesta exitosa
    console.log('Response received', response)
    return response
  },
  (error) => {
    // Manejar errores de respuesta
    console.error('Error in response', error)
    return Promise.reject(error)
  }
)

export default axiosInstance
