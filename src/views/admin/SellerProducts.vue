<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Seller Products</div>
    <q-card>
      <q-card-section>
        <q-table :rows="sellerProducts" :columns="columns" row-key="id" flat bordered />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'product', label: 'Product', field: 'product', align: 'left' },
  { name: 'seller', label: 'Seller', field: 'seller', align: 'left' },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'price', label: 'Price', field: 'price', align: 'right' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
]

const sellerProducts = ref([
  { id: 1, product: 'iPhone 15', seller: 'TechStore', category: 'Electronics', price: 999.99, stock: 25, status: 'active' },
  { id: 2, product: 'Nike Shoes', seller: 'FashionHub', category: 'Clothing', price: 129.99, stock: 50, status: 'active' },
  { id: 3, product: 'Coffee Maker', seller: 'HomeEssentials', category: 'Home', price: 79.99, stock: 15, status: 'pending' }
])
</script>
