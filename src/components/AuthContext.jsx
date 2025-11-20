import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('eco_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
        setToken(parsed.token)
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    setUser(data.user)
    setToken(data.access_token)
    localStorage.setItem('eco_auth', JSON.stringify({ user: data.user, token: data.access_token }))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('eco_auth')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
