import { defineStore } from 'pinia'
import type { AuthState, User, LoginCredentials } from '@/types/auth.types'


export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.token,
  },

  actions: {
    async login(credentials: LoginCredentials) {
        try {
          const { api } = await import('@/services/api.service')
          const response = await api.post('/v1/auth/login', credentials)

          const { user, access_token } = response.data.data

          this.token = access_token
          this.user = user
          this.isLoggedIn = true

          localStorage.setItem('token', access_token)
          localStorage.setItem('user', JSON.stringify(user))

          // 🔥 REDIRECT ROLE DI SINI
          if (user.role === 'admin') {
            return { success: true, redirect: '/admin/dashboard' }
          }

          if (user.role === 'mitra') {
            return { success: true, redirect: '/mitra/dashboard' }
          }

          throw new Error('Unknown role')
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      }
      ,

    async logout() {
      try {
        const { api } = await import('@/services/api.service')
        await api.post('/v1/auth/logout')
      } catch (error) {
        console.error('Logout API failed:', error)
      } finally {
        // Clear state
        this.token = null
        this.user = null
        this.isLoggedIn = false

        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isLoggedIn = true
      } else {
        this.logout()
      }
    },
  },
})
