<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">All Products</div>
    
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input v-model="search" placeholder="Search products..." dense outlined>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select v-model="filterCategory" :options="categoryOptions" label="Filter by category" dense outlined />
          </div>
          <div class="col-12 col-md-4">
            <q-btn color="primary" label="Add New Product" @click="showAddProductDialog = true" />
          </div>
        </div>
        
        <q-table
          :rows="products"
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
          
          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              ${{ props.row.price }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'active' ? 'positive' : 'negative'">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="visibility" @click="viewProduct(props.row)" />
              <q-btn flat round color="primary" icon="edit" @click="editProduct(props.row)" />
              <q-btn flat round color="negative" icon="delete" @click="deleteProduct(props.row)" />
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
const filterCategory = ref('all')
const showAddProductDialog = ref(false)

const categoryOptions = ['all', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']

const columns = [
  { name: 'image', label: 'Image', field: 'image', align: 'center' },
  { name: 'name', label: 'Product Name', field: 'name', align: 'left' },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'price', label: 'Price', field: 'price', align: 'right' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center' },
  { name: 'seller', label: 'Seller', field: 'seller', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const products = ref([
  { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', price: 999.99, stock: 25, seller: 'TechStore', status: 'active', image: '' },
  { id: 2, name: 'Nike Air Max', category: 'Clothing', price: 129.99, stock: 50, seller: 'FashionHub', status: 'active', image: '' },
  { id: 3, name: 'JavaScript Guide', category: 'Books', price: 49.99, stock: 100, seller: 'BookWorld', status: 'active', image: '' },
  { id: 4, name: 'Coffee Maker', category: 'Home & Garden', price: 79.99, stock: 15, seller: 'HomeEssentials', status: 'pending', image: '' },
  { id: 5, name: 'Yoga Mat', category: 'Sports', price: 29.99, stock: 75, seller: 'FitGear', status: 'active', image: '' }
])

const viewProduct = (product) => {
  console.log('View product:', product)
}

const editProduct = (product) => {
  console.log('Edit product:', product)
}

const deleteProduct = (product) => {
  console.log('Delete product:', product)
}
</script>
