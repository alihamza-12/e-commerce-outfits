<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Header -->
      <div class="col-12">
        <h1 class="text-h4 q-mb-md">Seller Dashboard</h1>
      </div>

      <!-- Stats Cards -->
      <div class="col-12 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Total Revenue</div>
            <div class="text-h4 text-positive">$12,450</div>
            <div class="text-caption">+15% from last month</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Total Orders</div>
            <div class="text-h4 text-primary">245</div>
            <div class="text-caption">+8% from last month</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Active Products</div>
            <div class="text-h4 text-purple">89</div>
            <div class="text-caption">12 low stock items</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Customers</div>
            <div class="text-h4 text-orange">1,234</div>
            <div class="text-caption">+5% from last month</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Charts Section -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Sales Overview</div>
            <div class="q-mt-md">
              <canvas id="salesChart" height="300"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activity -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>New order #1234</q-item-label>
                  <q-item-label caption>2 hours ago</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Product restocked</q-item-label>
                  <q-item-label caption>4 hours ago</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Revenue milestone</q-item-label>
                  <q-item-label caption>1 day ago</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SellerDashboard',
  data() {
    return {
      stats: {
        revenue: 12450,
        orders: 245,
        products: 89,
        customers: 1234
      }
    }
  },
  mounted() {
    this.initializeCharts()
  },
  methods: {
    initializeCharts() {
      // Initialize chart.js or other charting library
      console.log('Initializing charts...')
    }
  }
})
</script>

<style scoped>
.my-card {
  width: 100%;
}
</style>
