import axios from '@/api/axios'

class AdminService {
  // Get all customers for admin
  async getAdminCustomers(params = {}) {
    try {
      const response = await axios.get('/admin/customers', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch customers',
        error: error
      }
    }
  }

  // Get customer details
  async getCustomerDetails(customerId) {
    try {
      const response = await axios.get(`/admin/customers/${customerId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch customer details',
        error: error
      }
    }
  }

  // Update customer status
  async updateCustomerStatus(customerId, status) {
    try {
      const response = await axios.put(`/admin/customers/${customerId}/status`, { status })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update customer status',
        error: error
      }
    }
  }

  // Get users by status
  async getUsersByStatus(status) {
    try {
      const response = await axios.get('/admin/customers', { params: { status } })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users by status',
        error: error
      }
    }
  }

  // Search customers
  async searchCustomers(searchQuery, params = {}) {
    try {
      const response = await axios.get('/admin/customers', {
        params: { ...params, search: searchQuery }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search customers',
        error: error
      }
    }
  }

  // Get all sellers for admin
  async getAdminSellers(params = {}) {
    try {
      const response = await axios.get('/admin/sellers', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sellers',
        error: error
      }
    }
  }

  // Get seller details
  async getSellerDetails(sellerId) {
    try {
      const response = await axios.get(`/admin/sellers/${sellerId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch seller details',
        error: error
      }
    }
  }

  // Update seller status
  async updateSellerStatus(sellerId, status) {
    try {
      const response = await axios.put(`/admin/sellers/${sellerId}/status`, { status })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update seller status',
        error: error
      }
    }
  }

  // Approve seller registration
  async approveSeller(sellerId) {
    try {
      const response = await axios.put(`/admin/sellers/${sellerId}/approve`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve seller',
        error: error
      }
    }
  }

  // Get sellers by status
  async getSellersByStatus(status) {
    try {
      const response = await axios.get('/admin/sellers', { params: { status } })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sellers by status',
        error: error
      }
    }
  }

  // Search sellers
  async searchSellers(searchQuery, params = {}) {
    try {
      const response = await axios.get('/admin/sellers', {
        params: { ...params, search: searchQuery }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search sellers',
        error: error
      }
    }
  }
}

export default new AdminService()
