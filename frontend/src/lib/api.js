import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshRequest

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const refreshToken = localStorage.getItem('refreshToken')

    if (
      error.response?.status === 401 &&
      request &&
      !request._retry &&
      refreshToken &&
      !request.url?.includes('/auth/refresh-token')
    ) {
      request._retry = true
      try {
        refreshRequest ??= axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true },
        )
        const response = await refreshRequest
        refreshRequest = null
        const { accessToken, refreshToken: nextRefreshToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        if (nextRefreshToken) localStorage.setItem('refreshToken', nextRefreshToken)
        request.headers.Authorization = `Bearer ${accessToken}`
        return api(request)
      } catch (refreshError) {
        refreshRequest = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export function getErrorMessage(error) {
  const data = error.response?.data
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((item) => item.msg || item.message).filter(Boolean).join(', ')
  }
  return data?.message || error.message || 'Something went wrong. Please try again.'
}

export default api
