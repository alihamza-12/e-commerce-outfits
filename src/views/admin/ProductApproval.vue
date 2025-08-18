<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Product Approval</div>
    <q-card>
      <q-card-section>
        <q-table
          :rows="pendingProducts"
          :columns="columns"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <q-avatar>
                <img :src="props.row.image || 'https://via.placeholder.com/50'" />
              </q-avatar>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="positive" icon="check" @click="approveProduct(props.row)" />
              <q-btn flat round color="negative" icon="close" @click="rejectProduct(props.row)" />
              <q-btn flat round color="primary" icon="visibility" @click="viewProduct(props.row)" />
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
  { name: 'image', label: 'Image', field: 'image', align: 'center' },
  { name: 'name', label: 'Product Name', field: 'name', align: 'left' },
  { name: 'seller', label: 'Seller', field: 'seller', align: 'left' },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'price', label: 'Price', field: 'price', align: 'right' },
  { name: 'submitted', label: 'Submitted', field: 'submitted', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const pendingProducts = ref([
  { id: 1, name: 'Wireless Headphones', seller: 'TechStore', category: 'Electronics', price: 79.99, submitted: '2024-01-15' },
  { id: 2, name: 'Running Shoes', seller: 'FashionHub', category: 'Clothing', price: 89.99, submitted: '2024-01-16' },
  { id: 3, name: 'Coffee Table', seller: 'HomeEssentials', category: 'Home & Garden', price: 199.99, submitted: '2024-01-17' }
])

const approveProduct = (product) => {
  console.log('Approve product:', product)
}

const rejectProduct = (product) => {
  console.log('Reject product:', product)
}

const viewProduct = (product) => {
  console.log('View product:', product)
}
</script>
