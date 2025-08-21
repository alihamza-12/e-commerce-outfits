import axios from '@/api/axios'

class AuthService {
  // Login endpoint
  async login(credentials) {
    try {
      const response = await axios.post('/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      // Handle the actual API response structure
      const userData = response.data.data.user
      const roles = response.data.data.roles
      
      return {
        success: true,
        user: {
          ...userData,
          role: roles[0] // Extract the first role from roles array
        },
        token: response.data.data.token
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  // Register endpoint
  async register(userData) {
    try {
      const response = await axios.post('/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      })
      
      const userDataResponse = response.data.data.user
      const roles = response.data.data.roles
      
      return {
        success: true,
        user: {
          ...userDataResponse,
          role: roles[0]
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await axios.get('/profile')
      const userData = response.data.data.user
      const roles = response.data.data.roles
      
      return {
        success: true,
        user: {
          ...userData,
          role: roles[0]
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      }
    }
  }

  // Update profile
  async updateProfile(userData) {
    try {
      const response = await axios.put('/profile', userData)
      const userDataResponse = response.data.data.user
      const roles = response.data.data.roles
      
      return {
        success: true,
        user: {
          ...userDataResponse,
          role: roles[0]
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      }
    }
  }

  // Logout endpoint
  async logout() {
    try {
      await axios.post('/logout')
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed'
      }
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await axios.post('/refresh')
      const token = response.data.data.token
      
      return {
        success: true,
        token: token
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed'
      }
    }
  }
}

export default new AuthService()
