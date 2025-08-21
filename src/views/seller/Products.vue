<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h4">Products Management</div>
      <q-space />
      <q-btn
        color="primary"
        icon="add"
        label="Add New Product"
        @click="$router.push('/seller/products/add')"
      />
    </div>

    <InventoryTable
      :products="products"
      :loading="loading"
      @refresh="loadProducts"
      @edit="editProduct"
      @delete="deleteProduct"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InventoryTable from '@/components/seller/InventoryTable.vue'
import { useProductStore } from '@/stores/product'

const router = useRouter()
const productStore = useProductStore()

const products = ref([])
const loading = ref(false)

const loadProducts = async () => {
  loading.value = true
  try {
    await productStore.fetchProducts()
    products.value = productStore.products
  } finally {
    loading.value = false
  }
}

const editProduct = (product) => {
  router.push(`/seller/products/edit/${product.id}`)
}

const deleteProduct = async (product) => {
  await productStore.deleteProduct(product.id)
  loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>
