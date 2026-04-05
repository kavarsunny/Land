import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo && userInfo !== 'undefined') {
      try {
        return JSON.parse(userInfo)
      } catch (e) {
        return null
      }
    }
    return null
  })

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    setUser(data)
    localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password })
    setUser(data)
    localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userInfo')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
