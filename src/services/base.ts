import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API|| 'http://localhost:3000';
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TOKEN


// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${PUBLIC_TOKEN}`,
//   },
// })


// Función para obtener el token JWT del localStorage si existe
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}


// Crear instancia de axios con configuración base
const createApiInstance = (useAuth = true) => {
  const token = useAuth ? getAuthToken() : null

  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || PUBLIC_TOKEN}`,
    },
  })
}

// API con autenticación (usa token JWT si está disponible, o PUBLIC_TOKEN como fallback)
export const api = createApiInstance()

// API que siempre usa el PUBLIC_TOKEN (para operaciones que no requieren autenticación específica)
export const publicApi = createApiInstance(false)

// API para uso en el servidor (webhooks, etc.) - Usa un token de cliente por defecto
export const serverApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DEFAULT_CUSTOMER_TOKEN || PUBLIC_TOKEN}`,
  },
})

export default api