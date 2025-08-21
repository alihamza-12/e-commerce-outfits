import { defineStore } from 'pinia'
import adminApi from '@/services/adminApi'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    sellers: [],
    customers: [],
    adminCustomers: [],
    user: null,
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
    },
  }),

  actions: {
    async fetchUsers(params = {}) {
      this.loading = true
      try {
        const response = await adminApi.getAdminCustomers(params)
        if (response.success) {
          this.users = response.data.customers || response.data
          return response.data
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSellers(params = {}) {
      this.loading = true
      try {
        const response = await adminApi.getAdminCustomers({ ...params, role: 'seller' })
        if (response.success) {
          this.sellers = response.data.customers || response.data
          return response.data
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCustomers(params = {}) {
      this.loading = true
      try {
        const response = await adminApi.getAdminCustomers({ ...params, role: 'customer' })
        if (response.success) {
          this.customers = response.data.customers || response.data
          return response.data
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async approveSeller(id) {
      try {
        const response = await adminApi.updateCustomerStatus(id, 'approved')
        return response.data
      } catch (error) {
        throw error
      }
    },

    async rejectSeller(id, reason) {
      try {
        const response = await adminApi.updateCustomerStatus(id, 'rejected')
        return response.data
      } catch (error) {
        throw error
      }
    },

    // Add new method for admin customers
    async fetchAdminCustomers(params = {}) {
      this.loading = true
      try {
        const response = await adminApi.getAdminCustomers(params)
        if (response.success) {
          this.adminCustomers = response.data.customers || response.data
          return response.data
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Block/Unblock user functionality
    async updateUserStatus(userId, status) {
      this.loading = true
      try {
        const response = await adminApi.updateCustomerStatus(userId, status)
        if (response.success) {
          // Update local state
          const userIndex = this.adminCustomers.findIndex(user => user.id === userId)
          if (userIndex !== -1) {
            this.adminCustomers[userIndex].status = status
          }
          return response.data
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch single user details
    async fetchUserDetails(userId) {
      try {
        const response = await adminApi.getCustomerDetails(userId)
        if (response.success) {
          return response.data
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        throw error
      }
    },

    // Get users by status
    async getUsersByStatus(status) {
      return await this.fetchAdminCustomers({ status })
    }
  },
})
