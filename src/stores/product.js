import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    categories: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/products', { params })
        // API returns products in response.data.data, not response.data.products
        this.products = response.data.data || []
        this.pagination = {
          page: response.data.current_page,
          limit: response.data.per_page,
          total: response.data.total
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id) {
      this.loading = true
      try {
        const response = await api.get(`/products/${id}`)
        this.product = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData) {
      try {
        const response = await api.post('/products', productData)
        this.products.unshift(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async updateProduct(id, productData) {
      try {
        const response = await api.put(`/products/${id}`, productData)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async deleteProduct(id) {
      try {
        await api.delete(`/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        throw error
      }
    },

    async approveProduct(id) {
      try {
        const response = await api.put(`/products/${id}/approve`)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async rejectProduct(id, reason) {
      try {
        const response = await api.put(`/products/${id}/reject`, { reason })
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/categories')
        this.categories = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
