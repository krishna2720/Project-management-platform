import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!localStorage.getItem('accessToken') && !localStorage.getItem('refreshToken')) {
        setLoading(false)
        return
      }

      try {
        const response = await api.post('/auth/current-user')
        setUser(response.data.data)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const { user: loggedInUser, accessToken, refreshToken } = response.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
