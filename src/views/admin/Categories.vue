<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md dark:text-white">Categories</div>
    
    <!-- Error Handling -->
    <div v-if="error" class="q-mb-md">
      <q-banner dense class="bg-red-5 text-white">
        {{ error }}
      </q-banner>
    </div>

    <div v-if="loading" class="q-mb-md text-center">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm text-gray-600 dark:text-gray-400">Loading categories...</div>
    </div>

    <q-card class="shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border dark:border-gray-700">
      <q-card-section>
        <q-table
          :rows="categories"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminService from '@/services/adminApi'

const categories = ref([])
const loading = ref(true)
const error = ref(null)

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: 'Category Name', field: 'name', align: 'left' },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'created_at', label: 'Created At', field: 'created_at', align: 'left' },
  { name: 'updated_at', label: 'Updated At', field: 'updated_at', align: 'left' }
]

const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await AdminService.getSellerCategories()
    
    if (response.success) {
      // The API returns data in response.data.data structure
      categories.value = response.data.data || []
    } else {
      error.value = response.message || 'Failed to fetch categories'
    }
  } catch (err) {
    error.value = 'Network error: Failed to connect to the server'
    console.error('Categories fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
