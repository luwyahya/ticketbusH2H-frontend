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
    // Mock login - replace with actual API call when backend is ready
    async login(credentials: LoginCredentials) {
      try {
        // Mock response - replace with actual API call
        const mockUser: User = {
          id: 1,
          name: 'John Doe',
          email: credentials.email,
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now()

        // Save to state
        this.token = mockToken
        this.user = mockUser
        this.isLoggedIn = true

        // Save to localStorage
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))

        return { success: true }
      } catch (error) {
        console.error('Login failed:', error)
        return { success: false, error }
      }
    },

    logout() {
      // Clear state
      this.token = null
      this.user = null
      this.isLoggedIn = false

      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
