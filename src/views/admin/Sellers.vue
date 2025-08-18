<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Manage Sellers</div>
    
    <q-card>
      <q-card-section>
        <q-table
          :rows="sellers"
          :columns="columns"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'verified' ? 'positive' : 'warning'">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="visibility" @click="viewSeller(props.row)" />
              <q-btn flat round color="primary" icon="edit" @click="editSeller(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'businessName', label: 'Business Name', field: 'businessName', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'products', label: 'Products', field: 'products', align: 'center' },
  { name: 'revenue', label: 'Revenue', field: 'revenue', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const sellers = ref([
  { id: 1, businessName: 'TechStore', email: 'contact@techstore.com', phone: '+1234567890', products: 150, revenue: '$45,230', status: 'verified' },
  { id: 2, businessName: 'FashionHub', email: 'info@fashionhub.com', phone: '+1234567891', products: 89, revenue: '$32,150', status: 'verified' },
  { id: 3, businessName: 'BookWorld', email: 'support@bookworld.com', phone: '+1234567892', products: 234, revenue: '$18,750', status: 'pending' },
  { id: 4, businessName: 'HomeEssentials', email: 'hello@homeessentials.com', phone: '+1234567893', products: 67, revenue: '$28,900', status: 'verified' }
])

const viewSeller = (seller) => {
  console.log('View seller:', seller)
}

const editSeller = (seller) => {
  console.log('Edit seller:', seller)
}
</script>
