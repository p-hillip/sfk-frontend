import { defineStore } from 'pinia'
import * as api from '../api/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  actions: {
    async init() {
      // Try to restore from localStorage
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        this.token = storedToken
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true

        // Validate token with backend
        try {
          const response = await api.me()
          this.user = response.user
        } catch (error) {
          // Token is invalid, clear state
          this.clearAuth()
        }
      }
    },

    async login(email, password, remember) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.login(email, password, remember)
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true

        // Persist if remember-me is checked
        if (remember) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('auth_user', JSON.stringify(response.user))
        }

        return response
      } catch (error) {
        this.error = error.message || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await api.logout()
      } catch (error) {
        // Ignore errors during logout
      }

      this.clearAuth()
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }
})
