<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Categories</div>
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input v-model="search" placeholder="Search categories..." dense outlined />
          </div>
          <div class="col-12 col-md-6">
            <q-btn color="primary" label="Add New Category" @click="showAddDialog = true" />
          </div>
        </div>
        
        <q-table
          :rows="categories"
          :columns="columns"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="edit" @click="editCategory(props.row)" />
              <q-btn flat round color="negative" icon="delete" @click="deleteCategory(props.row)" />
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
const showAddDialog = ref(false)

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: 'Category Name', field: 'name', align: 'left' },
  { name: 'products', label: 'Products', field: 'products', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const categories = ref([
  { id: 1, name: 'Electronics', products: 234 },
  { id: 2, name: 'Clothing', products: 156 },
  { id: 3, name: 'Books', products: 89 },
  { id: 4, name: 'Home & Garden', products: 67 },
  { id: 5, name: 'Sports', products: 45 }
])

const editCategory = (category) => {
  console.log('Edit category:', category)
}

const deleteCategory = (category) => {
  console.log('Delete category:', category)
}
</script>
