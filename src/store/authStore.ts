import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginApi } from '../api/auth'

interface Usuario {
  id: string
  nombre: string
  email: string
  esAdmin: boolean
}

interface AuthStore {
  token: string | null
  usuario: Usuario | null
  autenticado: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      autenticado: false,

      login: async (email, password) => {
        const data = await loginApi(email, password)
        set({
          token: data.token,
          usuario: data.usuario,
          autenticado: true,
        })
      },

      logout: () => {
        set({
          token: null,
          usuario: null,
          autenticado: false,
        })
      },
    }),
    { name: 'auth' }
  )
)