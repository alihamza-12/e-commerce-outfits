<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Returns & Refunds</div>
    <q-card>
      <q-card-section>
        <q-table :rows="returns" :columns="columns" row-key="id" flat bordered />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'id', label: 'Return ID', field: 'id', align: 'left' },
  { name: 'order', label: 'Order ID', field: 'order', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'reason', label: 'Reason', field: 'reason', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Request Date', field: 'date', align: 'left' }
]

const returns = ref([
  { id: 'RET-001', order: 'ORD-123', customer: 'John Doe', reason: 'Defective item', amount: 99.99, status: 'pending', date: '2024-01-15' },
  { id: 'RET-002', order: 'ORD-124', customer: 'Jane Smith', reason: 'Wrong size', amount: 49.99, status: 'approved', date: '2024-01-14' },
  { id: 'RET-003', order: 'ORD-125', customer: 'Bob Wilson', reason: 'Not as described', amount: 149.99, status: 'processing', date: '2024-01-13' }
])
</script>
