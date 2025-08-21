<template>
  <q-card>
    <q-card-section class="row items-center">
      <div class="text-h6">Order Management</div>
      <q-space />
      <div class="row q-gutter-sm">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          label="Filter by Status"
          outlined
          dense
          style="width: 150px"
        />
        <q-input
          v-model="search"
          placeholder="Search orders..."
          dense
          outlined
          style="width: 250px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card-section>
      <q-table
        :rows="filteredOrders"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        flat
      >
        <template v-slot:body-cell-orderNumber="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              color="primary"
              :label="props.row.orderNumber"
              @click="viewOrder(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-customer="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar size="32px" class="q-mr-sm">
                <img :src="props.row.customer.avatar || 'https://via.placeholder.com/32'" />
              </q-avatar>
              <div>
                <div>{{ props.row.customer.name }}</div>
                <div class="text-caption text-grey">{{ props.row.customer.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              size="sm"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <div class="text-weight-bold">${{ props.row.total }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown
              flat
              dense
              color="primary"
              label="Actions"
              size="sm"
            >
              <q-list>
                <q-item clickable v-close-popup @click="viewOrder(props.row)">
                  <q-item-section avatar>
                    <q-icon name="visibility" />
                  </q-item-section>
                  <q-item-section>View Details</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="updateStatus(props.row, 'Shipped')">
                  <q-item-section avatar>
                    <q-icon name="local_shipping" />
                  </q-item-section>
                  <q-item-section>Mark as Shipped</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="printInvoice(props.row)">
                  <q-item-section avatar>
                    <q-icon name="print" />
                  </q-item-section>
                  <q-item-section>Print Invoice</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="cancelOrder(props.row)">
                  <q-item-section avatar>
                    <q-icon name="cancel" color="negative" />
                  </q-item-section>
                  <q-item-section class="text-negative">Cancel Order</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'update-status', 'cancel-order'])

const search = ref('')
const statusFilter = ref('All')
const pagination = ref({
  rowsPerPage: 10
})

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const columns = [
  { name: 'orderNumber', label: 'Order #', field: 'orderNumber', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'items', label: 'Items', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const filteredOrders = computed(() => {
  let filtered = props.orders

  if (search.value) {
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(search.value.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  return filtered
})

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'orange',
    'Processing': 'blue',
    'Shipped': 'info',
    'Delivered': 'positive',
    'Cancelled': 'negative'
  }
  return colors[status] || 'grey'
}

const viewOrder = (order) => {
  router.push(`/seller/orders/${order.id}`)
}

const updateStatus = (order, status) => {
  emit('update-status', { order, status })
}

const printInvoice = (order) => {
  // Implement print functionality
  console.log('Printing invoice for order:', order.orderNumber)
}

const cancelOrder = (order) => {
  emit('cancel-order', order)
}
</script>
