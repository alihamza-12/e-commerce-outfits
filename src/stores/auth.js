import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authApi from '@/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  // Control persistence behavior.
  // The app will persist ONLY the JWT token to localStorage when `persistTokenOnly` is true.
  // This avoids storing user profile or role in browser storage while allowing the
  // token to survive page refreshes so the session remains active.
  const persistTokenOnly = true

  // Getters
  const currentUser = computed(() => user.value)
  const userRole = computed(() => user.value?.role || null)
  const role = computed(() => user.value?.role || null)
  const isLoggedIn = computed(() => isAuthenticated.value)
  const isLoading = computed(() => loading.value)

  // Actions
  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authApi.login(credentials)

      if (response.success) {
        user.value = response.user
        token.value = response.token
        isAuthenticated.value = true

        // Optionally persist ONLY the token to localStorage so refresh doesn't log out.
        if (persistTokenOnly) {
          try {
            localStorage.setItem('token', response.token)
          } catch (e) {
            console.warn('Failed to persist token to localStorage', e)
          }
        }

        return { success: true, user: response.user }
      }

      return { success: false, message: response.message }

    } catch (error) {
      return { success: false, message: error.message || 'Login failed' }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await authApi.register(userData)

      if (response.success) {
        // Auto-login after registration
        user.value = response.user
        token.value = response.token
        isAuthenticated.value = true

        // Optionally persist ONLY the token to localStorage so refresh doesn't log out.
        if (persistTokenOnly) {
          try {
            localStorage.setItem('token', response.token)
          } catch (e) {
            console.warn('Failed to persist token to localStorage', e)
          }
        }

        return { success: true, user: response.user }
      }

      return { success: false, message: response.message }

    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      // Remove only the token (and role/user if present) on logout per requirement.
      try {
        try { localStorage.removeItem('token') } catch (e) {}
        try { localStorage.removeItem('role') } catch (e) {}
        try { localStorage.removeItem('user') } catch (e) {}
      } catch (e) {
        console.error('Failed to remove auth keys from localStorage on logout', e)
      }
    }
  }

  const checkAuth = () => {
    // If we're persisting token only, check for token in localStorage.
    if (persistTokenOnly) {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        token.value = storedToken
        // We don't automatically hydrate `user` (profile) here; components
        // can fetch /customer/me using the token. Mark auth as authenticated
        // so the app treats this as a logged-in session.
        isAuthenticated.value = true
        return true
      }
      return false
    }

    return false
  }

  const getDashboardRoute = (role) => {
    const routes = {
      admin: '/admin/dashboard',
      seller: '/seller/dashboard',
      buyer: '/'
    }
    return routes[role] || '/'
  }

  const hasRole = (roles) => {
    if (!Array.isArray(roles)) {
      roles = [roles]
    }
    return roles.includes(user.value?.role)
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSeller = computed(() => user.value?.role === 'seller')
  const isBuyer = computed(() => user.value?.role === 'buyer')

  return {
    user,
    token,
    isAuthenticated,
    loading,
    currentUser,
    userRole,
    role,
    isLoggedIn,
    isLoading,
    isAdmin,
    isSeller,
    isBuyer,
    login,
    register,
    logout,
    checkAuth,
    getDashboardRoute,
    hasRole
  }
})
