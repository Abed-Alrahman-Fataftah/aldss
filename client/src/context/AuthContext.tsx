import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: string
  email: string
  fullName: string
  group: 'CONTROL' | 'INTERVENTION'
  enrolledAt: string
  consentGiven: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUserFromRegister: (user: User, token: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('aldss_token')
    if (savedToken) {
      setToken(savedToken)
      authAPI.getMe()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('aldss_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('aldss_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('aldss_token')
    setToken(null)
    setUser(null)
  }

  const setUserFromRegister = (newUser: User, newToken: string) => {
    localStorage.setItem('aldss_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUserFromRegister }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}