<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Manage Users</div>
    
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input v-model="search" placeholder="Search users..." dense outlined>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select v-model="filterStatus" :options="statusOptions" label="Filter by status" dense outlined />
          </div>
          <div class="col-12 col-md-4">
            <q-btn color="primary" label="Add New User" @click="showAddUserDialog = true" />
          </div>
        </div>
        
        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'active' ? 'positive' : 'negative'">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="edit" @click="editUser(props.row)" />
              <q-btn flat round color="negative" icon="delete" @click="deleteUser(props.row)" />
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
const filterStatus = ref('all')
const showAddUserDialog = ref(false)

const statusOptions = ['all', 'active', 'inactive', 'suspended']

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'createdAt', label: 'Created', field: 'createdAt', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', status: 'active', createdAt: '2024-01-16' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', status: 'inactive', createdAt: '2024-01-17' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1234567893', status: 'active', createdAt: '2024-01-18' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1234567894', status: 'suspended', createdAt: '2024-01-19' }
])

const editUser = (user) => {
  console.log('Edit user:', user)
}

const deleteUser = (user) => {
  console.log('Delete user:', user)
}
</script>
