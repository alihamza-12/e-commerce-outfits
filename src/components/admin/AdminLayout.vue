<template>
  <div class="">
    <q-layout view="lHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-cyan-8">
        <q-toolbar>
          <q-toolbar-title>E-Commerce Admin Dashboard</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-btn flat @click="handleLogout" round dense icon="logout" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="250"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <!-- Buyers Section -->
            <q-item-label header class="text-weight-bold text-primary">Buyers</q-item-label>
            
            <q-item clickable v-ripple to="/admin/users">
              <q-item-section avatar>
                <q-icon name="people" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Manage Users</q-item-label>
                <q-item-label caption>Customer accounts</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/customer-orders">
              <q-item-section avatar>
                <q-icon name="shopping_cart" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Customer Orders</q-item-label>
                <q-item-label caption>All buyer orders</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <!-- Sellers Section -->
            <q-item-label header class="text-weight-bold text-secondary">Sellers</q-item-label>
            
            <q-item clickable v-ripple to="/admin/sellers">
              <q-item-section avatar>
                <q-icon name="store" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Manage Sellers</q-item-label>
                <q-item-label caption>Seller accounts</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/seller-products">
              <q-item-section avatar>
                <q-icon name="inventory_2" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Seller Products</q-item-label>
                <q-item-label caption>Product listings</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/seller-orders">
              <q-item-section avatar>
                <q-icon name="receipt_long" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Seller Orders</q-item-label>
                <q-item-label caption>Order fulfillment</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <!-- Products Section -->
            <q-item-label header class="text-weight-bold text-accent">Products</q-item-label>
            
            <q-item clickable v-ripple to="/admin/products">
              <q-item-section avatar>
                <q-icon name="inventory" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>All Products</q-item-label>
                <q-item-label caption>Product catalog</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/product-approval">
              <q-item-section avatar>
                <q-icon name="approval" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Product Approval</q-item-label>
                <q-item-label caption>Moderate listings</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/categories">
              <q-item-section avatar>
                <q-icon name="category" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Categories</q-item-label>
                <q-item-label caption>Product categories</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <!-- Orders Section -->
            <q-item-label header class="text-weight-bold text-positive">Orders</q-item-label>
            
            <q-item clickable v-ripple to="/admin/all-orders">
              <q-item-section avatar>
                <q-icon name="list_alt" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label>All Orders</q-item-label>
                <q-item-label caption>Order management</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/returns-refunds">
              <q-item-section avatar>
                <q-icon name="assignment_return" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Returns & Refunds</q-item-label>
                <q-item-label caption>Return requests</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <!-- Analytics Section -->
            <q-item-label header class="text-weight-bold text-info">Analytics</q-item-label>
            
            <q-item clickable v-ripple to="/admin/dashboard">
              <q-item-section avatar>
                <q-icon name="dashboard" color="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
                <q-item-label caption>Platform overview</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/reports">
              <q-item-section avatar>
                <q-icon name="bar_chart" color="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Reports</q-item-label>
                <q-item-label caption>Revenue & analytics</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/platform-stats">
              <q-item-section avatar>
                <q-icon name="analytics" color="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Platform Stats</q-item-label>
                <q-item-label caption>Performance metrics</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <!-- Settings -->
            <q-item clickable v-ripple to="/admin/settings">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Settings</q-item-label>
                <q-item-label caption>Platform configuration</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const drawer = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const handleLogout = async () => {
  try {
    await authStore.logout()
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      position: 'top'
    })
    router.push('/admin-login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error logging out',
      position: 'top'
    })
  }
}
</script>

<style scoped>
.q-item__section--avatar {
  min-width: 40px;
}
</style>
