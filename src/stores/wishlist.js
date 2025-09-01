import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import wishlistService from '@/services/wishlist'
import axios from '@/api/axios'
import { useAuthStore } from './auth'

export const useWishlistStore = defineStore('wishlist', () => {
    const items = ref([]) // items as returned by API: { id, product_id, name, price }
    const isInitialized = ref(false)
    const auth = useAuthStore()

    const loadFromLocal = () => {
        try {
            const raw = localStorage.getItem('wishlist-items')
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) items.value = parsed
            }
        } catch (e) {
            items.value = []
        } finally {
            isInitialized.value = true
        }
    }

    function resolveImageObject(img) {
        if (!img) return null
        if (typeof img === 'string') return img
        if (img.url) return img.url
        if (img.image_path) return img.image_path
        return null
    }

    async function enrichItemImage(item) {
        if (item.image) return item.image
        try {
            const res = await axios.get(`/products/${item.product_id}`, { skipAuthRedirect: true })
            const pdata = res?.data?.data || res?.data || null
            if (pdata) {
                const gallery = Array.isArray(pdata.images) ? pdata.images.map(resolveImageObject).filter(Boolean) : []
                if (gallery.length) return gallery[0]
                // fallback to other fields
                return resolveImageObject(pdata.image) || resolveImageObject(pdata.thumbnail) || null
            }
        } catch (e) {
            // ignore
        }
        return null
    }

    const saveToLocal = () => {
        try {
            localStorage.setItem('wishlist-items', JSON.stringify(items.value))
        } catch (e) {
            // ignore
        }
    }

    // initialize
    try {
        if (auth.checkAuth && auth.checkAuth()) {
            fetchRemote().catch(() => loadFromLocal())
        } else {
            loadFromLocal()
        }
    } catch (e) {
        loadFromLocal()
    }

    watch(items, () => saveToLocal(), { deep: true })

    const wishlistItems = computed(() => items.value)
    const count = computed(() => items.value.length)

    async function fetchRemote() {
        try {
            const res = await wishlistService.getWishlist()
            if (res && res.success) {
                // server returns items with at least { id, product_id }
                items.value = (res.data || []).map((it) => ({
                    id: it.id,
                    product_id: it.product_id,
                    name: it.name ?? null,
                    price: it.price ?? null,
                    image: it.image ?? null,
                }))
                // best-effort: enrich missing images
                await Promise.all(
                    items.value.map(async (it, idx) => {
                        if (!it.image) {
                            const img = await enrichItemImage(it)
                            if (img) items.value[idx].image = img
                        }
                    })
                )
                saveToLocal()
            }
            return res
        } catch (e) {
            throw e
        }
    }

    // add product by productId. API returns created wishlist item with id and product_id
    async function add(productId) {
        // optimistic local push if not present
        if (items.value.some((i) => Number(i.product_id) === Number(productId))) {
            return { success: true, message: 'Already in wishlist' }
        }
        try {
            const res = await wishlistService.addToWishlist(productId)
            if (res && res.success) {
                // API returns data: { id, product_id }
                const created = res.data
                // try to enrich with name/price if available from response (some APIs provide it)
                const newItem = { id: created.id, product_id: created.product_id, name: created.name ?? null, price: created.price ?? null, image: created.image ?? null }
                // best-effort: enrich missing fields from product endpoint
                if (!newItem.name || !newItem.price || !newItem.image) {
                    try {
                        const prodRes = await axios.get(`/products/${created.product_id}`, { skipAuthRedirect: true })
                        const pdata = prodRes.data?.data || prodRes.data || null
                        if (pdata) {
                            newItem.name = newItem.name ?? pdata.name ?? pdata.title ?? null
                            newItem.price = newItem.price ?? pdata.price ?? null
                            // pull first image from images array
                            const gallery = Array.isArray(pdata.images) ? pdata.images.map(resolveImageObject).filter(Boolean) : []
                            newItem.image = newItem.image ?? gallery[0] ?? resolveImageObject(pdata.image) ?? resolveImageObject(pdata.thumbnail) ?? null
                        }
                    } catch (err) {
                        // ignore enrichment failure
                    }
                }
                items.value = [...items.value, newItem]
                return res
            }
            return res
        } catch (e) {
            throw e
        }
    }

    // remove by wishlist item id OR by product id (handle both)
    async function remove(identifier) {
        // if identifier matches an item's id (wishlist primary key)
        const byId = items.value.find((i) => Number(i.id) === Number(identifier))
        let targetId = null
        if (byId) targetId = byId.id
        else {
            const byPid = items.value.find((i) => Number(i.product_id) === Number(identifier))
            if (byPid) targetId = byPid.id
        }
        if (!targetId) {
            // nothing to remove locally
            // maybe identifier was a product id and server stores wishlist items by id
            // in that case, remove locally any entries matching the product id and return
            const before = items.value.length
            items.value = items.value.filter((i) => Number(i.product_id) !== Number(identifier))
            if (items.value.length < before) return { success: true }
            return { success: false, message: 'not found' }
        }
        try {
            const res = await wishlistService.removeItem(targetId)
            if (res && res.success) {
                items.value = items.value.filter((i) => Number(i.id) !== Number(targetId))
            }
            return res
        } catch (e) {
            // If server reports the wishlist item not found (404) treat as success
            const status = e?.response?.status
            const msg = e?.response?.data?.message || e?.message || ''
            if (status === 404 || /not found/i.test(String(msg))) {
                console.warn('wishlist.remove: server item not found, removing locally', targetId, msg)
                items.value = items.value.filter((i) => Number(i.id) !== Number(targetId))
                return { success: true, message: 'removed locally' }
            }
            // fallback: remove locally and rethrow for other errors
            items.value = items.value.filter((i) => Number(i.id) !== Number(targetId))
            throw e
        }
    }

    async function clearAll() {
        try {
            const res = await wishlistService.clearWishlist()
            if (res && res.success) items.value = []
            return res
        } catch (e) {
            items.value = []
            throw e
        }
    }

    function isInWishlist(productId) {
        return items.value.some((i) => Number(i.product_id) === Number(productId))
    }

    return {
        items,
        wishlistItems,
        count,
        fetchRemote,
        add,
        remove,
        clearAll,
        isInWishlist,
    }
})
