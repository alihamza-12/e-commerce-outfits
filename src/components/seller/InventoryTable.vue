<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-h6">Inventory Management</div>
              <div class="text-subtitle2 text-grey-7">Manage your product inventory</div>
            </div>
            <div>
              <q-btn
                color="primary"
                icon="add"
                label="Add Product"
                to="/seller/products/add"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <!-- Filters and Search -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="search"
                placeholder="Search products..."
                dense
                outlined
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filterStatus"
                :options="statusOptions"
                label="Filter by Status"
                dense
                outlined
                clearable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filterCategory"
                :options="categories"
                label="Filter by Category"
                dense
                outlined
                clearable
              />
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                color="secondary"
                icon="filter_list"
                label="Reset"
                @click="resetFilters"
                flat
              />
            </div>
          </div>

          <!-- Inventory Table -->
          <q-table
            :rows="filteredInventory"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            row-key="id"
            flat
            bordered
            :filter="search"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="product" :props="props">
                  <div class="row items-center">
                    <q-img
                      :src="props.row.image || 'https://via.placeholder.com/50'"
                      :ratio="1"
                      class="rounded-borders q-mr-sm"
                      style="width: 50px; height: 50px"
                    />
                    <div>
                      <div class="text-weight-bold">{{ props.row.name }}</div>
                      <div class="text-caption">{{ props.row.sku }}</div>
                    </div>
                  </div>
                </q-td>
                
                <q-td key="category" :props="props">
                  <q-badge color="primary">{{ props.row.category }}</q-badge>
                </q-td>
                
                <q-td key="quantity" :props="props">
                  <q-badge 
                    :color="props.row.quantity > 0 ? 'positive' : 'negative'"
                    :label="props.row.quantity"
                  />
                </q-td>
                
                <q-td key="price" :props="props">
                  ${{ props.row.price }}
                </q-td>
                
                <q-td key="status" :props="props">
                  <q-badge 
                    :color="props.row.status === 'active' ? 'positive' : 'negative'"
                    :label="props.row.status"
                  />
                </q-td>
                
                <q-td key="actions" :props="props">
                  <q-btn
                    icon="edit"
                    color="primary"
                    size="sm"
                    @click="editProduct(props.row)"
                    flat
                  />
                  <q-btn
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="deleteProduct(props.row.id)"
                    flat
                  />
                  <q-btn
                    icon="inventory"
                    color="accent"
                    size="sm"
                    @click="updateStock(props.row)"
                    flat
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Stock Update Dialog -->
    <q-dialog v-model="stockDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Update Stock</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.number="stockUpdate.quantity"
            type="number"
            label="New Quantity"
            outlined
            dense
          />
          <q-input
            v-model="stockUpdate.reason"
            label="Reason for change"
            outlined
            dense
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Update" color="primary" @click="confirmStockUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'InventoryTable',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const search = ref('')
    const filterStatus = ref('')
    const filterCategory = ref('')
    const stockDialog = ref(false)
    
    const stockUpdate = reactive({
      productId: null,
      quantity: 0,
      reason: ''
    })

    const columns = [
      {
        name: 'product',
        label: 'Product',
        field: 'name',
        align: 'left',
        sortable: true
      },
      {
        name: 'category',
        label: 'Category',
        field: 'category',
        align: 'center',
        sortable: true
      },
      {
        name: 'quantity',
        label: 'Quantity',
        field: 'quantity',
        align: 'center',
        sortable: true
      },
      {
        name: 'price',
        label: 'Price',
        field: 'price',
        align: 'center',
        sortable: true
      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'center',
        sortable: true
      },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'center'
      }
    ]

    const inventory = ref([
      {
        id: 1,
        name: 'iPhone 14 Pro',
        sku: 'IPHONE14PRO001',
        category: 'Electronics',
        quantity: 25,
        price: 999,
        status: 'active',
        image: 'https://via.placeholder.com/50'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S23',
        sku: 'SAMSUNGS23001',
        category: 'Electronics',
        quantity: 15,
        price: 899,
        status: 'active',
        image: 'https://via.placeholder.com/50'
      },
      {
        id: 3,
        name: 'Nike Air Max',
        sku: 'NIKEAIR001',
        category: 'Sports',
        quantity: 0,
        price: 129,
        status: 'out_of_stock',
        image: 'https://via.placeholder.com/50'
      }
    ])

    const statusOptions = ['active', 'inactive', 'out_of_stock']
    const categories = ['Electronics', 'Clothing', 'Sports', 'Home & Garden', 'Books']
    
    const filteredInventory = computed(() => {
      let filtered = inventory.value
      
      if (search.value) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(search.value.toLowerCase()) ||
          item.sku.toLowerCase().includes(search.value.toLowerCase())
        )
      }
      
      if (filterStatus.value) {
        filtered = filtered.filter(item => item.status === filterStatus.value)
      }
      
      if (filterCategory.value) {
        filtered = filtered.filter(item => item.category === filterCategory.value)
      }
      
      return filtered
    })

    const pagination = ref({
      page: 1,
      rowsPerPage: 10
    })

    const editProduct = (product) => {
      router.push(`/seller/products/edit/${product.id}`)
    }

    const deleteProduct = (id) => {
      // Implement delete logic
      console.log('Delete product:', id)
    }

    const updateStock = (product) => {
      stockUpdate.productId = product.id
      stockUpdate.quantity = product.quantity
      stockUpdate.reason = ''
      stockDialog.value = true
    }

    const confirmStockUpdate = () => {
      // Implement stock update logic
      console.log('Update stock:', stockUpdate)
      stockDialog.value = false
    }

    const resetFilters = () => {
      search.value = ''
      filterStatus.value = ''
      filterCategory.value = ''
    }

    return {
      loading,
      search,
      filterStatus,
      filterCategory,
      stockDialog,
      stockUpdate,
      columns,
      inventory,
      statusOptions,
      categories,
      filteredInventory,
      pagination,
      editProduct,
      deleteProduct,
      updateStock,
      confirmStockUpdate,
      resetFilters
    }
  }
}
</script>
