import axios from '@/api/axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class AuthService {
  // Login endpoint
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/loginuser`, {
        email: credentials.email,
        password: credentials.password
      })
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
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
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      })
      return {
        success: true,
        user: response.data.user
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  // // Get user profile
  // async getProfile() {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/auth/profile`)
  //     return {
  //       success: true,
  //       user: response.data.user
  //     }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Failed to get profile'
  //     }
  //   }
  // }

  // Update profile
  // async updateProfile(userData) {
  //   try {
  //     const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData)
  //     return {
  //       success: true,
  //       user: response.data.user
  //     }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Failed to update profile'
  //     }
  //   }
  // }

  // Logout endpoint
  // async logout() {
  //   try {
  //     await axios.post(`${API_BASE_URL}/auth/logout`)
  //     return { success: true }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Logout failed'
  //     }
  //   }
  // }

  // Refresh token
  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`)
      return {
        success: true,
        token: response.data.token
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
