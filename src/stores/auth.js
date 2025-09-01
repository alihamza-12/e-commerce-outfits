import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authApi from '@/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

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

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.user.role)

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

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.user.role)

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
      // Clear all stored data in the browser to ensure no leftover user data remains
      try {
        localStorage.clear()
      } catch (e) {
        console.error('Failed to clear localStorage on logout', e)
      }

      try {
        sessionStorage.clear()
      } catch (e) {
        console.error('Failed to clear sessionStorage on logout', e)
      }
    }
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role')

    if (storedUser && storedToken && storedRole) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
      isAuthenticated.value = true
      return true
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
