<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Seller Orders</div>
    <q-card>
      <q-card-section>
        <q-table :rows="sellerOrders" :columns="columns" row-key="id" flat bordered />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'seller', label: 'Seller', field: 'seller', align: 'left' },
  { name: 'items', label: 'Items', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Date', field: 'date', align: 'left' }
]

const sellerOrders = ref([
  { id: 'SELL-001', seller: 'TechStore', items: 5, total: 2499.95, status: 'processing', date: '2024-01-15' },
  { id: 'SELL-002', seller: 'FashionHub', items: 3, total: 389.97, status: 'shipped', date: '2024-01-16' },
  { id: 'SELL-003', seller: 'BookWorld', items: 10, total: 499.90, status: 'delivered', date: '2024-01-14' }
])
</script>
