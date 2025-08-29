import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const isInitialized = ref(false)
  
  // Debug logging utility
  const debugLog = (message, data = null) => {
    console.log(`[Cart Store] ${message}`, data || '')
  }
  
  // Enhanced localStorage check
  const isLocalStorageAvailable = () => {
    try {
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      console.warn('LocalStorage is not available:', e)
      return false
    }
  }
  
  // Load cart items from localStorage on initialization
  const loadCartFromStorage = () => {
    try {
      if (!isLocalStorageAvailable()) {
        debugLog('LocalStorage not available, using empty cart')
        items.value = []
        isInitialized.value = true
        return
      }
      
      const storedCart = localStorage.getItem('cart-items')
      debugLog('Loading cart from localStorage, stored data:', storedCart)
      
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        // Validate that we have an array
        if (Array.isArray(parsedCart)) {
          items.value = parsedCart
          debugLog('Successfully loaded cart from localStorage:', items.value)
        } else {
          debugLog('Invalid cart data in localStorage, resetting to empty array')
          items.value = []
        }
      } else {
        debugLog('No cart data found in localStorage, starting with empty cart')
        items.value = []
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      items.value = []
    } finally {
      isInitialized.value = true
      debugLog('Cart store initialization complete')
    }
  }
  
  // Save cart items to localStorage with enhanced error handling
  const saveCartToStorage = () => {
    try {
      if (!isLocalStorageAvailable()) {
        debugLog('LocalStorage not available, cannot save cart')
        return
      }
      
      debugLog('Saving cart to localStorage:', items.value)
      localStorage.setItem('cart-items', JSON.stringify(items.value))
      debugLog('Cart successfully saved to localStorage')
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }
  
  // Manual save method as backup
  const manualSave = () => {
    debugLog('Manual save triggered')
    saveCartToStorage()
  }
  
  // Load cart on store initialization
  loadCartFromStorage()
  
  // Watch for changes and automatically persist to localStorage
  watch(items, (newItems) => {
    if (isInitialized.value) {
      debugLog('Cart items changed, auto-saving:', newItems)
      saveCartToStorage()
    }
  }, { deep: true })
  
  // Getters
  const cartItems = computed(() => {
    debugLog('Getting cart items:', items.value)
    return items.value
  })
  
  const totalItems = computed(() => {
    const total = items.value.reduce((total, item) => total + item.quantity, 0)
    debugLog('Calculating total items:', total)
    return total
  })
  
  const totalPrice = computed(() => {
    const total = items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    debugLog('Calculating total price:', total)
    return total
  })
  
  const itemCount = computed(() => {
    const count = items.value.length
    debugLog('Calculating item count:', count)
    return count
  })
  
  // Check if product is in cart
  const isInCart = (productId) => {
    const inCart = items.value.some(item => item.id === productId)
    debugLog(`Checking if product ${productId} is in cart:`, inCart)
    return inCart
  }
  
  // Actions
  const addToCart = (product) => {
    debugLog('Adding product to cart:', product)
    
    if (!product || !product.id) {
      console.error('Invalid product provided to addToCart:', product)
      return
    }
    
    // Create a new array to ensure reactivity
    const currentItems = [...items.value]
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id)
    
    if (existingItemIndex !== -1) {
      // Update existing item - create new object to ensure reactivity
      currentItems[existingItemIndex] = {
        ...currentItems[existingItemIndex],
        quantity: currentItems[existingItemIndex].quantity + 1
      }
      debugLog('Updated existing item quantity:', currentItems[existingItemIndex].quantity)
    } else {
      // Add new item
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        brand: product.brand,
        quantity: 1
      }
      currentItems.push(newItem)
      debugLog('Added new item to cart:', newItem)
    }
    
    // Replace the entire array to trigger reactivity
    items.value = currentItems
    debugLog('Cart items after operation:', items.value)
    debugLog('Total items count:', totalItems.value)
    
    // Force immediate save as backup
    setTimeout(() => saveCartToStorage(), 100)
    
    // Return the updated items for debugging
    return items.value
  }
  
  const removeFromCart = (productId) => {
    debugLog('Removing product from cart:', productId)
    const currentItems = [...items.value]
    const index = currentItems.findIndex(item => item.id === productId)
    if (index !== -1) {
      currentItems.splice(index, 1)
      items.value = currentItems
      debugLog('Product removed from cart')
      // Force immediate save as backup
      setTimeout(() => saveCartToStorage(), 100)
    } else {
      debugLog('Product not found in cart for removal')
    }
  }
  
  const updateQuantity = (productId, quantity) => {
    debugLog(`Updating quantity for product ${productId} to ${quantity}`)
    const currentItems = [...items.value]
    const itemIndex = currentItems.findIndex(item => item.id === productId)
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {z
        removeFromCart(productId)
      } else {
        // Update the item with new quantity - create new object for reactivity
        currentItems[itemIndex] = {
          ...currentItems[itemIndex],
          quantity: quantity
        }
        items.value = currentItems
        debugLog('Quantity updated successfully')
        // Force immediate save as backup
        setTimeout(() => saveCartToStorage(), 100)
      }
    } else {
      debugLog('Product not found for quantity update')
    }
  }
  
  const clearCart = () => {
    debugLog('Clearing entire cart')
    items.value = []
    // Force immediate save as backup
    setTimeout(() => saveCartToStorage(), 100)
  }
  
  const getItemQuantity = (productId) => {
    const item = items.value.find(item => item.id === productId)
    const quantity = item ? item.quantity : 0
    debugLog(`Getting quantity for product ${productId}:`, quantity)
    return quantity
  }
  
  // Debug method to check current state
  const debugCartState = () => {
    debugLog('=== CART STATE DEBUG ===')
    debugLog('Items:', items.value)
    debugLog('Total Items:', totalItems.value)
    debugLog('Total Price:', totalPrice.value)
    debugLog('Item Count:', itemCount.value)
    debugLog('Is Initialized:', isInitialized.value)
    debugLog('LocalStorage Available:', isLocalStorageAvailable())
    
    if (isLocalStorageAvailable()) {
      const stored = localStorage.getItem('cart-items')
      debugLog('LocalStorage Content:', stored)
    }
    debugLog('=== END DEBUG ===')
  }
  
  return {
    // State
    items,
    isInitialized,
    
    // Getters
    cartItems,
    totalItems,
    totalPrice,
    itemCount,
    isInCart,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    manualSave,
    debugCartState
  }
})
