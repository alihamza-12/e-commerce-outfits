import axios from '@/api/axios'

export default {
    async getWishlist() {
        try {
            const res = await axios.get('/customer/wishlist')
            return res.data
        } catch (error) {
            console.error('wishlist.getWishlist error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async addToWishlist(productId) {
        try {
            const res = await axios.post('/customer/wishlist', { product_id: productId })
            return res.data
        } catch (error) {
            console.error('wishlist.addToWishlist error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async removeItem(wishlistItemId) {
        // Guard against invalid/undefined ids to avoid sending requests like
        // DELETE /customer/wishlist/undefined which the backend will 404.
        if (!wishlistItemId && wishlistItemId !== 0) {
            console.warn('wishlist.removeItem called without a valid id:', wishlistItemId)
            // Nothing to delete on server; treat as successful no-op so UI can update locally.
            return { success: true, message: 'no-op: invalid id' }
        }
        try {
            const res = await axios.delete(`/customer/wishlist/${wishlistItemId}`)
            return res.data
        } catch (error) {
            console.error('wishlist.removeItem error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    },

    async clearWishlist() {
        try {
            const res = await axios.delete('/customer/wishlist')
            return res.data
        } catch (error) {
            console.error('wishlist.clearWishlist error', error?.response?.data ?? error)
            throw error?.response?.data ?? error
        }
    }
}
