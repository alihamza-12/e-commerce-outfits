

import axios from '@/api/axios'

export default {
    async placeOrder(payload) {
        try {
            console.info('checkout.placeOrder - POST /customer/checkout', payload)
            const res = await axios.post('/customer/checkout', payload)
            console.info('checkout.placeOrder - response', res?.data ?? res)
            return res.data
        } catch (error) {
            console.error('checkout.placeOrder error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    }
}

