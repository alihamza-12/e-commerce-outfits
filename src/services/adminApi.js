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
}

export default new AdminService()
