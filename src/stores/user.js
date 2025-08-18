import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    sellers: [],
    customers: [],
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
        const response = await api.get('/users', { params })
        this.users = response.data.users
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSellers(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/sellers', { params })
        this.sellers = response.data.sellers
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCustomers(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/customers', { params })
        this.customers = response.data.customers
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async approveSeller(id) {
      try {
        const response = await api.put(`/sellers/${id}/approve`)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async rejectSeller(id, reason) {
      try {
        const response = await api.put(`/sellers/${id}/reject`, { reason })
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
