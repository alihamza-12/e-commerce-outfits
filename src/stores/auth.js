import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import authApi from '@/services/authApi'
// Lightweight direct axios instance import for profile hydration after refresh
import axios from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  // Persistence policy:
  // User requested: do NOT keep user/profile data in storage and also remove token
  // automatically when tab is closed. We achieve this by:
  // 1. Using sessionStorage (isolated per tab, auto-clears on tab close)
  // 2. Persisting ONLY the token there (no user / role stored)
  // 3. Hydrating profile after login if needed (optional)
  const persistTokenOnly = true
  const STORAGE = (typeof window !== 'undefined' && window.sessionStorage) ? window.sessionStorage : null

  // One-time cleanup of any legacy localStorage auth artifacts so user isn't auto-logged from old data
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem('token') } catch (e) { /* ignore */ }
    try { localStorage.removeItem('user') } catch (e) { /* ignore */ }
    try { localStorage.removeItem('role') } catch (e) { /* ignore */ }
  }

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

        // Persist ONLY token in sessionStorage (auto removed on tab close)
        try {
          STORAGE && STORAGE.setItem('token', response.token)
        } catch (e) {
          console.warn('Failed to persist auth token to sessionStorage', e)
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

        // Persist ONLY token in sessionStorage
        try {
          STORAGE && STORAGE.setItem('token', response.token)
        } catch (e) {
          console.warn('Failed to persist auth token to sessionStorage', e)
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
      // Remove token from sessionStorage
      try { STORAGE && STORAGE.removeItem('token') } catch (e) { /* ignore */ }
    }
  }

  // Internal helper to hydrate user profile from API endpoints (customer/seller/admin)
  const hydrateUserProfile = async () => {
    if (!token.value) return { success: false, reason: 'no-token' }
    // Skip if already have a user (fresh login)
    if (user.value?.id) return { success: true, cached: true, user: user.value }
    const endpoints = [
      '/customer/me',
      '/customer/profile',
      '/seller/me',
      '/seller/profile',
      '/seller', // some parts of the app use plain /seller endpoint
      '/admin/me',
      '/admin/profile'
    ]
    for (const ep of endpoints) {
      try {
        const res = await axios.get(ep, { skipAuthRedirect: true })
        const payload = res?.data?.data ?? res?.data
        if (payload && typeof payload === 'object') {
          user.value = payload
          // Do NOT persist user data (privacy requirement)
          return { success: true, user: payload, endpoint: ep }
        }
      } catch (e) {
        // Debug each failed endpoint once (can be muted later)
        console.warn('[hydrateUserProfile] failed', ep, e?.response?.status || e?.message)
        continue
      }
    }
    return { success: false }
  }

  const checkAuth = () => {
    const storedToken = STORAGE ? STORAGE.getItem('token') : null
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      // Fire & forget hydration (keeps UI avatar/menu after refresh)
      hydrateUserProfile()
      return true
    }
    return false
  }

  // Defensive: on tab close (beforeunload) ensure token removed (sessionStorage auto handles
  // this, but we add an explicit clear for robustness or if environment swaps storage)
  if (typeof window !== 'undefined') {
    const clearOnUnload = () => {
      try { STORAGE && STORAGE.removeItem('token') } catch (e) { /* ignore */ }
    }
    window.addEventListener('beforeunload', clearOnUnload)
    onUnmounted(() => window.removeEventListener('beforeunload', clearOnUnload))
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
    hasRole,
    hydrateUserProfile
  }
})
