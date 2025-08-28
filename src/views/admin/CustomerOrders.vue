<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Customer Orders</div>
    <q-card>
      <q-card-section>
        <q-table :rows="customerOrders" :columns="orderColumns" row-key="id" flat bordered :loading="loading" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()
const loading = ref(false)

const orderColumns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'customer', label: 'Customer', field: row => row.customer?.name || row.customer, align: 'left' },
  { name: 'items', label: 'Items', field: row => row.items?.length || 0, align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Date', field: row => new Date(row.createdAt).toLocaleDateString(), align: 'left' }
]

const customerOrders = ref([])

const fetchCustomerOrders = async () => {
  loading.value = true
  try {
    const response = await orderStore.fetchAdminOrders()
    console.log("Orders API response:", response?.data?.data)

    if (response.success) {
      const ordersPage = response?.data?.data
      // ✅ Orders are inside the "data" key of the pagination object
      customerOrders.value = Array.isArray(ordersPage?.data) ? ordersPage.data : []
    } else {
      console.error('Failed to fetch orders:', response.message)
      customerOrders.value = []
    }
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    customerOrders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCustomerOrders()
})
</script>
