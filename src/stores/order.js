import { defineStore } from 'pinia'
import api from '@/api/axios'
import adminApi from '@/services/adminApi'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    order: null,
    adminOrders: [],
    adminOrder: null,
    loading: false,
    adminLoading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    adminPagination: {
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

    // Admin order actions
    async fetchAdminOrders(params = {}) {
      this.adminLoading = true
      try {
        const response = await adminApi.getAdminOrders(params)
        if (response.success) {
          this.adminOrders = response.data.data || []
          this.adminPagination = response.data.pagination || {
            page: 1,
            limit: 10,
            total: this.adminOrders.length
          }
        }
        return response
      } catch (error) {
        throw error
      } finally {
        this.adminLoading = false
      }
    },

    async fetchAdminOrder(id) {
      this.adminLoading = true
      try {
        const response = await adminApi.getAdminOrder(id)
        if (response.success) {
          this.adminOrder = response.data.data
        }
        return response
      } catch (error) {
        throw error
      } finally {
        this.adminLoading = false
      }
    },

    async updateAdminOrder(id, orderData) {
      try {
        const response = await adminApi.updateAdminOrder(id, orderData)
        if (response.success) {
          const index = this.adminOrders.findIndex(o => o.id === id)
          if (index !== -1) {
            this.adminOrders[index] = response.data.data
          }
          if (this.adminOrder && this.adminOrder.id === id) {
            this.adminOrder = response.data.data
          }
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async processAdminRefund(id, refundData) {
      try {
        const response = await adminApi.processAdminRefund(id, refundData)
        if (response.success) {
          const index = this.adminOrders.findIndex(o => o.id === id)
          if (index !== -1) {
            this.adminOrders[index] = response.data
          }
          if (this.adminOrder && this.adminOrder.id === id) {
            this.adminOrder = response.data
          }
        }
        return response
      } catch (error) {
        throw error
      }
    },

  async bulkUpdateOrders(orderIds, updateData) {
    try {
      const response = await adminApi.bulkUpdateOrders(orderIds, updateData)
      if (response.success) {
        // Update local state with the updated orders
        this.adminOrders = this.adminOrders.map(order => 
          orderIds.includes(order.id) ? { ...order, ...updateData } : order
        )
      }
      return response
    } catch (error) {
      throw error
    }
  },

    async disputeOrder(id, disputeData) {
      try {
        const response = await adminApi.disputeOrder(id, disputeData)
        if (response.success) {
          const index = this.adminOrders.findIndex(o => o.id === id)
          if (index !== -1) {
            this.adminOrders[index] = response.data
          }
          if (this.adminOrder && this.adminOrder.id === id) {
            this.adminOrder = response.data
          }
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async returnOrder(id, reason) {
      try {
        const response = await adminApi.returnOrder(id, reason)
        if (response.success) {
          const index = this.adminOrders.findIndex(o => o.id === id)
          if (index !== -1) {
            this.adminOrders[index] = response.data
          }
          if (this.adminOrder && this.adminOrder.id === id) {
            this.adminOrder = response.data
          }
        }
        return response
      } catch (error) {
        throw error
      }
    },
  },
})
