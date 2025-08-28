<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md dark:text-white">Returns & Refunds</div>
    
    <!-- Error Handling -->
    <div v-if="error" class="q-mb-md">
      <q-banner dense class="bg-red-5 text-white">
        {{ error }}
      </q-banner>
    </div>

    <div v-if="loading" class="q-mb-md text-center">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm text-gray-600 dark:text-gray-400">Loading returns & refunds...</div>
    </div>

    <q-card class="shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border dark:border-gray-700">
      <q-card-section>
        <q-table
          :rows="returns"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminService from '@/services/adminApi'

const returns = ref([])
const loading = ref(true)
const error = ref(null)

const columns = [
  { name: 'product_name', label: 'Product Name', field: 'product_name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
]

const fetchReturnsAndRefunds = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await AdminService.getAdminOrders()
    
    if (response.success) {
      // Filter orders to get only return and refund status orders
      const allOrders = response.data.data?.data || []
      
      // Extract products from orders with return/refund status
      const returnRefundProducts = []
      
      allOrders.forEach(order => {
        // Check if order status contains 'return' or 'refund'
        if (order.status && (order.status.toLowerCase().includes('return') || 
                            order.status.toLowerCase().includes('refund'))) {
          
          // Add all items from this order
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              returnRefundProducts.push({
                id: `${order.id}-${item.id}`,
                product_name: item.name || item.product_name || 'Unknown Product',
                status: order.status
              })
            })
          }
        }
      })
      
      returns.value = returnRefundProducts
    } else {
      error.value = response.message || 'Failed to fetch returns and refunds'
    }
  } catch (err) {
    error.value = 'Network error: Failed to connect to the server'
    console.error('Returns & Refunds fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReturnsAndRefunds()
})
</script>
