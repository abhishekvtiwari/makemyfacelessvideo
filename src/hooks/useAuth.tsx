"use client"
// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from "react"

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  videosUsed: number
}

interface AuthContext {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthCtx = createContext<AuthContext>({ user: null, loading: true, logout: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return <AuthCtx.Provider value={{ user, loading, logout }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
