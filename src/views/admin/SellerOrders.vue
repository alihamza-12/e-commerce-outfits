<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Seller Orders</div>
    <q-card>
      <q-card-section>
        <q-table 
          :rows="sellerOrders" 
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
import { useOrderStore } from '@/stores/order' // 👈 same store as customer orders

const orderStore = useOrderStore()
const loading = ref(false)

const columns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'seller', label: 'Seller', field: row => row.seller?.name || row.seller, align: 'left' },
  { name: 'items', label: 'Items', field: row => row.items?.length || 0, align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Date', field: row => new Date(row.createdAt).toLocaleDateString(), align: 'left' }
]

const sellerOrders = ref([])

const fetchSellerOrders = async () => {
  loading.value = true
  try {
    const response = await orderStore.fetchAdminOrders() // 👈 or use fetchSellerOrders() if exists
    console.log("Seller Orders API response:", response?.data?.data)

    if (response.success) {
      const ordersPage = response?.data?.data
      // ✅ Extract array from paginated object
      sellerOrders.value = Array.isArray(ordersPage?.data) ? ordersPage.data : []
    } else {
      console.error('Failed to fetch seller orders:', response.message)
      sellerOrders.value = []
    }
  } catch (error) {
    console.error('Error fetching seller orders:', error)
    sellerOrders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSellerOrders()
})
</script>
