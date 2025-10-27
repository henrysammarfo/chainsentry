"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("chainsentry_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      localStorage.setItem("chainsentry-user-id", userData.id)
    }
  }, [])

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("chainsentry_users") || "{}")

    if (users[email]) {
      return false // User already exists
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    // Store user credentials
    users[email] = { ...newUser, password }
    localStorage.setItem("chainsentry_users", JSON.stringify(users))

    // Log in the user
    setUser(newUser)
    localStorage.setItem("chainsentry_user", JSON.stringify(newUser))
    localStorage.setItem("chainsentry-user-id", newUser.id)

    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("chainsentry_users") || "{}")
    const user = users[email]

    if (!user || user.password !== password) {
      return false
    }

    const { password: _, ...userWithoutPassword } = user
    setUser(userWithoutPassword)
    localStorage.setItem("chainsentry_user", JSON.stringify(userWithoutPassword))
    localStorage.setItem("chainsentry-user-id", userWithoutPassword.id)

    return true
  }

  const logout = () => {
    const userId = localStorage.getItem("chainsentry-user-id")

    setUser(null)
    localStorage.removeItem("chainsentry_user")
    localStorage.removeItem("chainsentry-user-id")

    if (userId) {
      localStorage.removeItem(`chainsentry-demo-data-${userId}`)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
