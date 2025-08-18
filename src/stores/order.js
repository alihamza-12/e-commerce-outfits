import { defineStore } from 'pinia'
import api from '@/services/api'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    order: null,
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchOrders(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/orders', { params })
        this.orders = response.data.orders
        this.pagination = response.data.pagination
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(id) {
      this.loading = true
      try {
        const response = await api.get(`/orders/${id}`)
        this.order = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(id, status) {
      try {
        const response = await api.put(`/orders/${id}/status`, { status })
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async processRefund(id, refundData) {
      try {
        const response = await api.post(`/orders/${id}/refund`, refundData)
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
