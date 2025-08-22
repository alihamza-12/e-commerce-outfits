<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary">User Management</h1>
        <p class="text-subtitle2 text-grey-7">Manage and monitor all platform users</p>
      </div>
      <div class="row q-gutter-sm">
        <q-btn 
          @click="refreshUsers" 
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
              <q-avatar color="blue-1" text-color="primary" icon="people" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ totalUsers }}</div>
                <div class="text-caption text-grey-7">Total Users</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center">
              <q-avatar color="green-1" text-color="positive" icon="check_circle" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ activeUsers }}</div>
                <div class="text-caption text-grey-7">Active Users</div>
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
                <div class="text-h6 text-weight-bold">{{ blockedUsers }}</div>
                <div class="text-caption text-grey-7">Blocked Users</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center">
              <q-avatar color="purple-1" text-color="purple" icon="schedule" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold">{{ recentUsers }}</div>
                <div class="text-caption text-grey-7">New This Week</div>
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
              placeholder="Search users..."
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
              v-model="userTypeFilter"
              :options="userTypeOptions"
              label="User Type"
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

    <!-- Users Table -->
    <q-card flat bordered>
      <q-card-section>
        <q-table
          :rows="paginatedUsers"
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
                <img :src="props.row.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.status === 'active' ? 'positive' : 'negative'"
                text-color="white"
                size="sm"
              >
                {{ props.row.status }}
              </q-chip>
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
                  @click="toggleUserStatus(props.row)"
                  :label="props.row.status === 'blocked' ? 'Unblock' : 'Block'"
                  :color="props.row.status === 'blocked' ? 'positive' : 'negative'"
                  size="sm"
                  unelevated
                />
                <q-btn
                  @click="viewUserDetails(props.row)"
                  icon="visibility"
                  color="primary"
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
              <span class="q-ml-sm">No users found</span>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="between">
        <div class="text-caption text-grey-7">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredUsers.length) }} of {{ filteredUsers.length }} results
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

    <!-- User Details Dialog -->
    <q-dialog v-model="showUserDetails" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">User Details</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-avatar size="100px" class="q-mx-auto block">
                <img :src="selectedUser?.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
              </q-avatar>
            </div>
            <div class="col-12">
              <div class="text-h6 text-center">{{ selectedUser?.name }}</div>
              <div class="text-subtitle2 text-center text-grey-7">{{ selectedUser?.email }}</div>
            </div>
            <div class="col-12">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Customer ID</q-item-label>
                    <q-item-label>{{ selectedUser?.customer_id || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>User ID</q-item-label>
                    <q-item-label>{{ selectedUser?.user_id || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Phone</q-item-label>
                    <q-item-label>{{ selectedUser?.profile?.phone || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Address</q-item-label>
                    <q-item-label>{{ selectedUser?.profile?.address || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>City</q-item-label>
                    <q-item-label>{{ selectedUser?.profile?.city || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>State</q-item-label>
                    <q-item-label>{{ selectedUser?.profile?.state || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Postal Code</q-item-label>
                    <q-item-label>{{ selectedUser?.profile?.postal_code || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Country</q-item-label>
                    <q-item-label>{{ selectedUser?.profile?.country || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Status</q-item-label>
                    <q-item-label>
                      <q-chip
                        :color="selectedUser?.status === 'active' ? 'positive' : 'negative'"
                        text-color="white"
                        size="sm"
                      >
                        {{ selectedUser?.status }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Blocked Status</q-item-label>
                    <q-item-label>{{ selectedUser?.is_blocked ? 'Yes' : 'No' }}</q-item-label>
                  </q-item-section>
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
import { useUserStore } from '@/stores/user'

const $q = useQuasar()
const userStore = useUserStore()

// Reactive data
const users = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const userTypeFilter = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Dialog states
const showConfirmDialog = ref(false)
const showUserDetails = ref(false)
const selectedUser = ref(null)
const newStatus = ref('')

// Table columns
const columns = [
  { name: 'avatar', label: 'Avatar', field: 'avatar', align: 'center' },
  { name: 'customer_id', label: 'Customer ID', field: 'customer_id', align: 'left', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'phone', label: 'Phone', field: row => row.profile?.phone || 'N/A', align: 'left' },
  { name: 'address', label: 'Address', field: row => row.profile?.address || 'N/A', align: 'left' },
  { name: 'city', label: 'City', field: row => row.profile?.city || 'N/A', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

// Filter options
const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Pending', value: 'pending' }
]

const userTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Customer', value: 'customer' },
  { label: 'Seller', value: 'seller' },
  { label: 'Admin', value: 'admin' }
]

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name A-Z', value: 'name' }
]

// Computed properties
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
const blockedUsers = computed(() => users.value.filter(u => u.status === 'blocked').length)
const recentUsers = computed(() => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return users.value.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length
})

const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter - include profile fields in search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.customer_id?.toString().includes(query) ||
      user.profile?.phone?.toLowerCase().includes(query) ||
      user.profile?.address?.toLowerCase().includes(query) ||
      user.profile?.city?.toLowerCase().includes(query) ||
      user.profile?.state?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // User type filter
  if (userTypeFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === userTypeFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)
const paginatedUsers = computed(() => filteredUsers.value.slice(startIndex.value, endIndex.value))

const pagination = ref({
  rowsPerPage: itemsPerPage.value
})

// Confirmation dialog
const confirmIcon = computed(() => newStatus.value === 'active' ? 'check_circle' : 'block')
const confirmColor = computed(() => newStatus.value === 'active' ? 'positive' : 'negative')
const confirmMessage = computed(() => {
  if (!selectedUser.value) return ''
  return selectedUser.value.status === 'blocked'
    ? `Are you sure you want to unblock ${selectedUser.value.name}?`
    : `Are you sure you want to block ${selectedUser.value.name}?`
})
const confirmAction = computed(() => selectedUser.value?.status === 'blocked' ? 'Unblock' : 'Block')

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userStore.fetchAdminCustomers()
    let usersData = []
    
    // Handle different response formats and extract the users array
    if (Array.isArray(response)) {
      usersData = response
    } else if (response && Array.isArray(response.customers)) {
      usersData = response.customers
    } else if (response && response.data && Array.isArray(response.data.customers)) {
      usersData = response.data.customers
    } else if (response && response.data && Array.isArray(response.data)) {
      usersData = response.data
    }
    
    // Transform API data to match table structure
    users.value = usersData.map(user => ({
      ...user,
      id: user.customer_id || user.id, // Map customer_id to id for table operations
      status: user.is_blocked ? 'blocked' : 'active', // Convert boolean to status string
      phone: user.profile?.phone || 'N/A',
      // Keep all original fields including profile data
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch users',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const refreshUsers = () => {
  currentPage.value = 1
  fetchUsers()
}

const toggleUserStatus = (user) => {
  selectedUser.value = user
  newStatus.value = user.status === 'blocked' ? 'active' : 'blocked'
  showConfirmDialog.value = true
}

const confirmStatusChange = async () => {
  if (!selectedUser.value) return
  
  try {
    const result = await userStore.updateUserStatus(selectedUser.value.id, newStatus.value)
    
    if (result && result.success !== false) {
      // Update local state
      const userIndex = users.value.findIndex(u => u.id === selectedUser.value.id)
      if (userIndex !== -1) {
        users.value[userIndex].status = newStatus.value
        // Also update is_blocked field to match the new status
        users.value[userIndex].is_blocked = newStatus.value === 'blocked'
      }
      
      $q.notify({
        type: 'positive',
        message: `User ${newStatus.value === 'active' ? 'unblocked' : 'blocked'} successfully`,
        position: 'top'
      })
    } else {
      throw new Error(result?.message || 'Failed to update user status')
    }
  } catch (error) {
    console.error('Error updating user status:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to update user status',
      position: 'top'
    })
  }
}

const viewUserDetails = (user) => {
  selectedUser.value = user
  showUserDetails.value = true
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
watch([searchQuery, statusFilter, userTypeFilter, sortBy], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.q-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
