import axios from '@/api/axios'

export default {
    async getCart() {
        try {
            const res = await axios.get('/customer/cart')
            return res.data
        } catch (error) {
            console.error('customerApi.getCart error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async addToCart(productId, quantity = 1) {
        try {
            const res = await axios.post('/customer/cart', { product_id: productId, quantity })
            return res.data
        } catch (error) {
            console.error('customerApi.addToCart error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async updateCartItem(productId, quantity) {
        try {
            const res = await axios.patch(`/customer/cart/${productId}`, { quantity })
            return res.data
        } catch (error) {
            console.error('customerApi.updateCartItem error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async removeFromCart(productId) {
        try {
            const res = await axios.delete(`/customer/cart/${productId}`)
            return res.data
        } catch (error) {
            console.error('customerApi.removeFromCart error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    }
}

