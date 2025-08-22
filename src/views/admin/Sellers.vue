<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary">Seller Management</h1>
        <p class="text-subtitle2 text-grey-7">Manage and monitor all platform sellers</p>
      </div>
      <div class="row q-gutter-sm">
        <q-btn 
          @click="refreshSellers" 
          icon="refresh" 
          label="Refresh" 
          color="primary" 
          unelevated
          :loading="loading"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center">
              <q-avatar color="blue-1" text-color="primary" icon="store" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ totalSellers }}</div>
                <div class="text-caption text-grey-7">Total Sellers</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center">
              <q-avatar color="green-1" text-color="positive" icon="verified" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ verifiedSellers }}</div>
                <div class="text-caption text-grey-7">Verified Sellers</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center">
              <q-avatar color="orange-1" text-color="orange" icon="pending" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ pendingSellers }}</div>
                <div class="text-caption text-grey-7">Pending Approval</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center">
              <q-avatar color="red-1" text-color="negative" icon="block" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ suspendedSellers }}</div>
                <div class="text-caption text-grey-7">Suspended</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="searchQuery"
              placeholder="Search sellers..."
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
              v-model="statusFilter"
              :options="statusOptions"
              label="Status"
              dense
              outlined
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="businessTypeFilter"
              :options="businessTypeOptions"
              label="Business Type"
              dense
              outlined
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="sortBy"
              :options="sortOptions"
              label="Sort By"
              dense
              outlined
              emit-value
              map-options
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Sellers Table -->
    <q-card flat bordered>
      <q-card-section>
        <q-table
          :rows="paginatedSellers"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="searchQuery"
          :pagination="pagination"
          flat
          bordered
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:body-cell-avatar="props">
            <q-td :props="props">
              <q-avatar size="42px">
                <img :src="props.row.logo || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
              </q-avatar>
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

          <template v-slot:body-cell-revenue="props">
            <q-td :props="props">
              ${{ formatCurrency(props.row.revenue || 0) }}
            </q-td>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="q-gutter-x-sm">
                <q-btn
                  @click="viewSellerDetails(props.row)"
                  icon="visibility"
                  color="primary"
                  size="sm"
                  round
                  flat
                />
                <q-btn
                  @click="toggleSellerStatus(props.row)"
                  :label="getStatusAction(props.row.status)"
                  :color="getStatusActionColor(props.row.status)"
                  size="sm"
                  unelevated
                />
                <q-btn
                  @click="viewSellerProducts(props.row)"
                  icon="inventory"
                  color="info"
                  size="sm"
                  round
                  flat
                />
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md">
              <q-icon name="warning" size="md" color="warning" />
              <span class="q-ml-sm">No sellers found</span>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="between">
        <div class="text-caption text-grey-7">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredSellers.length) }} of {{ filteredSellers.length }} results
        </div>
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="5"
          direction-links
          boundary-links
          @update:model-value="onPageChange"
        />
      </q-card-actions>
    </q-card>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar :icon="confirmIcon" :color="confirmColor" text-color="white" />
          <span class="q-ml-sm">{{ confirmMessage }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn 
            flat 
            :label="confirmAction" 
            :color="confirmColor" 
            @click="confirmStatusChange" 
            v-close-popup 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Seller Details Dialog -->
    <q-dialog v-model="showSellerDetails" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Seller Details</div>
        </q-card-section>

        <q-card-section v-if="selectedSeller">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-avatar size="100px" class="q-mx-auto block">
                <img :src="selectedSeller.logo || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
              </q-avatar>
            </div>
            <div class="col-12">
              <div class="text-h6 text-center">{{ selectedSeller.businessName }}</div>
              <div class="text-subtitle2 text-center text-grey-7">{{ selectedSeller.email }}</div>
            </div>
            <div class="col-12">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Business Name</q-item-label>
                    <q-item-label>{{ selectedSeller.businessName }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Email</q-item-label>
                    <q-item-label>{{ selectedSeller.email }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Phone</q-item-label>
                    <q-item-label>{{ selectedSeller.phone || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Business Type</q-item-label>
                    <q-item-label>{{ selectedSeller.businessType || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Status</q-item-label>
                    <q-item-label>
                      <q-chip
                        :color="getStatusColor(selectedSeller.status)"
                        text-color="white"
                        size="sm"
                      >
                        {{ selectedSeller.status }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-label caption>Products</q-item-label>
                  <q-item-label>{{ selectedSeller.productCount || 0 }}</q-item-label>
                </q-item>
                <q-item>
                  <q-item-label caption>Revenue</q-item-label>
                  <q-item-label>${{ formatCurrency(selectedSeller.revenue || 0) }}</q-item-label>
                </q-item>
                <q-item>
                  <q-item-label caption>Joined</q-item-label>
                  <q-item-label>{{ formatDate(selectedSeller.createdAt) }}</q-item-label>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import adminApi from '@/services/adminApi'

const $q = useQuasar()

// Reactive data
const sellers = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const businessTypeFilter = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Dialog states
const showConfirmDialog = ref(false)
const showSellerDetails = ref(false)
const selectedSeller = ref(null)
const newStatus = ref('')

// Table columns
const columns = [
  { name: 'avatar', label: 'Logo', field: 'logo', align: 'center' },
  { name: 'businessName', label: 'Business Name', field: 'businessName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'businessType', label: 'Business Type', field: 'businessType', align: 'center' },
  { name: 'products', label: 'Products', field: 'productCount', align: 'center' },
  { name: 'revenue', label: 'Revenue', field: 'revenue', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'createdAt', label: 'Joined', field: 'createdAt', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

// Filter options
const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Rejected', value: 'rejected' }
]

const businessTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Individual', value: 'individual' },
  { label: 'LLC', value: 'llc' },
  { label: 'Corporation', value: 'corporation' },
  { label: 'Partnership', value: 'partnership' }
]

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name A-Z', value: 'name' },
  { label: 'Revenue High-Low', value: 'revenue' }
]

// Computed properties
const totalSellers = computed(() => sellers.value.length)
const verifiedSellers = computed(() => sellers.value.filter(s => s.status === 'verified').length)
const pendingSellers = computed(() => sellers.value.filter(s => s.status === 'pending').length)
const suspendedSellers = computed(() => sellers.value.filter(s => s.status === 'suspended').length)

const filteredSellers = computed(() => {
  let filtered = sellers.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(seller => 
      seller.businessName?.toLowerCase().includes(query) ||
      seller.email?.toLowerCase().includes(query) ||
      seller.phone?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(seller => seller.status === statusFilter.value)
  }

  // Business type filter
  if (businessTypeFilter.value !== 'all') {
    filtered = filtered.filter(seller => seller.businessType === businessTypeFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'name':
        return (a.businessName || '').localeCompare(b.businessName || '')
      case 'revenue':
        return (b.revenue || 0) - (a.revenue || 0)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredSellers.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)
const paginatedSellers = computed(() => filteredSellers.value.slice(startIndex.value, endIndex.value))

const pagination = ref({
  rowsPerPage: itemsPerPage.value
})

// Confirmation dialog
const confirmIcon = computed(() => newStatus.value === 'verified' ? 'check_circle' : 'block')
const confirmColor = computed(() => newStatus.value === 'verified' ? 'positive' : 'negative')
const confirmMessage = computed(() => {
  if (!selectedSeller.value) return ''
  return selectedSeller.value.status === 'pending'
    ? `Are you sure you want to approve ${selectedSeller.value.businessName}?`
    : `Are you sure you want to change status for ${selectedSeller.value.businessName}?`
})
const confirmAction = computed(() => selectedSeller.value?.status === 'pending' ? 'Approve' : 'Update')

// Methods
const fetchSellers = async () => {
  loading.value = true
  try {
    const response = await adminApi.getAdminSellers()
    if (response.success) {
      sellers.value = response.data.sellers || response.data
    } else {
      sellers.value = []
    }
  } catch (error) {
    console.error('Error fetching sellers:', error)
    sellers.value = []
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch sellers',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const refreshSellers = () => {
  currentPage.value = 1
  fetchSellers()
}

const viewSellerDetails = (seller) => {
  selectedSeller.value = seller
  showSellerDetails.value = true
}

const toggleSellerStatus = (seller) => {
  selectedSeller.value = seller
  newStatus.value = seller.status === 'pending' ? 'verified' : 'pending'
  showConfirmDialog.value = true
}

const confirmStatusChange = async () => {
  if (!selectedSeller.value) return
  
  try {
    await adminApi.updateSellerStatus(selectedSeller.value.id, newStatus.value)
    
    // Update local state
    const sellerIndex = sellers.value.findIndex(s => s.id === selectedSeller.value.id)
    if (sellerIndex !== -1) {
      sellers.value[sellerIndex].status = newStatus.value
    }
    
    $q.notify({
      type: 'positive',
      message: `Seller ${newStatus.value === 'verified' ? 'approved' : 'status updated'} successfully`,
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update seller status',
      position: 'top'
    })
  }
}

const viewSellerProducts = (seller) => {
  // Navigate to seller products view
  console.log('View products for seller:', seller.businessName)
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    verified: 'positive',
    suspended: 'negative',
    rejected: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusAction = (status) => {
  return status === 'pending' ? 'Approve' : 'Suspend'
}

const getStatusActionColor = (status) => {
  return status === 'pending' ? 'positive' : 'negative'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const onPageChange = (page) => {
  currentPage.value = page
}

// Watchers
watch([searchQuery, statusFilter, businessTypeFilter, sortBy], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchSellers()
})
</script>

<style scoped>
.q-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>

