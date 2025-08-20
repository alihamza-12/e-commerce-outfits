import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // Admin credentials (hardcoded as requested)
  const ADMIN_CREDENTIALS = {
    email: 'admin@outfits.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  }

  // Getters
  const currentUser = computed(() => user.value)
  const userRole = computed(() => user.value?.role || null)
  const role = computed(() => user.value?.role || null) // Add role getter for router compatibility
  const isLoggedIn = computed(() => isAuthenticated.value)

  // Actions
  const login = async (credentials) => {
    try {
      // Check if it's admin login
      if (credentials.email === ADMIN_CREDENTIALS.email && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        
        const adminUser = {
          id: 'admin-001',
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
          createdAt: new Date().toISOString()
        }
        
        user.value = adminUser
        token.value = 'admin-token-' + Date.now()
        isAuthenticated.value = true
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(adminUser))
        localStorage.setItem('token', token.value)
        localStorage.setItem('role', adminUser.role)
        
        return { success: true, user: adminUser }
      }
      
      // Check regular users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => 
        u.email === credentials.email && u.password === credentials.password
      )
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          createdAt: foundUser.createdAt
        }
        
        user.value = userData
        token.value = 'user-token-' + Date.now()
        isAuthenticated.value = true
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token.value)
        localStorage.setItem('role', userData.role)
        
        return { success: true, user: userData }
      }
      
      return { success: false, message: 'Invalid credentials' }
      
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' }
      }
      
      const newUser = {
        id: 'user-' + Date.now(),
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role || 'buyer',
        createdAt: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      return { success: true, user: newUser }
      
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
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

  return {
    user,
    token,
    isAuthenticated,
    currentUser,
    userRole,
    role,
    isLoggedIn,
    login,
    register,
    logout,
    checkAuth,
    getDashboardRoute
  }
})
