<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Customer Orders</div>
    <q-card>
      <q-card-section>
        <q-table :rows="customerOrders" :columns="orderColumns" row-key="id" flat bordered />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orderColumns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'items', label: 'Items', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Date', field: 'date', align: 'left' }
]

const customerOrders = ref([
  { id: 'CUST-001', customer: 'John Doe', items: 2, total: 199.98, status: 'delivered', date: '2024-01-15' },
  { id: 'CUST-002', customer: 'Jane Smith', items: 1, total: 49.99, status: 'processing', date: '2024-01-16' },
  { id: 'CUST-003', customer: 'Mike Johnson', items: 3, total: 299.97, status: 'shipped', date: '2024-01-17' }
])
</script>
