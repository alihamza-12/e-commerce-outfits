
import axios from '@/api/axios'

export default {
    async getOrders() {
        try {
            // accept optional page parameter via arguments
            const page = arguments[0] || 1
            const res = await axios.get('/customer/orders', { params: { page } })
            return res.data
        } catch (error) {
            console.error('orders.getOrders error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async getOrder(id) {
        try {
            const res = await axios.get(`/customer/orders/${id}`)
            return res.data
        } catch (error) {
            console.error('orders.getOrder error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    }
}
