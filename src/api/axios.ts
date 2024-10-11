import axios from 'axios'
const BASE_URL = 'https://cocoabackend.onrender.com/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
