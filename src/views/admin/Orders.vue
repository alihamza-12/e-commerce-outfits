<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">All Orders</div>
    
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <q-input v-model="search" placeholder="Search orders..." dense outlined>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select v-model="filterStatus" :options="statusOptions" label="Filter by status" dense outlined />
          </div>
          <div class="col-12 col-md-3">
            <q-select v-model="filterType" :options="typeOptions" label="Filter by type" dense outlined />
          </div>
        </div>
        
        <q-table
          :rows="orders"
          :columns="columns"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status)">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          
          <template v-slot:body-cell-total="props">
            <q-td :props="props">
              ${{ props.row.total }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="visibility" @click="viewOrder(props.row)" />
              <q-btn flat round color="primary" icon="edit" @click="editOrder(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const filterStatus = ref('all')
const filterType = ref('all')

const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']
const typeOptions = ['all', 'customer', 'seller']

const columns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'center' },
  { name: 'items', label: 'Items', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Order Date', field: 'date', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const orders = ref([
  { id: 'ORD-001', customer: 'John Doe', type: 'customer', items: 3, total: 299.99, status: 'delivered', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'TechStore', type: 'seller', items: 1, total: 999.99, status: 'processing', date: '2024-01-16' },
  { id: 'ORD-003', customer: 'Jane Smith', type: 'customer', items: 2, total: 149.99, status: 'shipped', date: '2024-01-17' },
  { id: 'ORD-004', customer: 'FashionHub', type: 'seller', items: 5, total: 459.95, status: 'pending', date: '2024-01-18' }
])

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'positive',
    cancelled: 'negative'
  }
  return colors[status] || 'grey'
}

const viewOrder = (order) => {
  console.log('View order:', order)
}

const editOrder = (order) => {
  console.log('Edit order:', order)
}
</script>
