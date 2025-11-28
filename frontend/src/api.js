import axios from 'axios'

// If you prefer `.env`, set VITE_API_URL; else, with Vite proxy we can keep '' baseURL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // '' = same origin, Vite proxy will forward /api, /renders
  timeout: 60000,
})

export default api
