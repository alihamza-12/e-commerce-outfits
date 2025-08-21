<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Seller Analytics</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Revenue Analytics -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Revenue Overview</h3>
        <div class="text-2xl font-bold text-green-600">$12,450</div>
        <p class="text-sm text-gray-600">+15% from last month</p>
      </div>
      
      <!-- Order Analytics -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Total Orders</h3>
        <div class="text-2xl font-bold text-blue-600">245</div>
        <p class="text-sm text-gray-600">+8% from last month</p>
      </div>
      
      <!-- Product Analytics -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Active Products</h3>
        <div class="text-2xl font-bold text-purple-600">89</div>
        <p class="text-sm text-gray-600">12 low stock items</p>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <!-- Sales Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Sales Trend</h3>
        <div class="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p class="text-gray-500">Sales chart will be displayed here</p>
        </div>
      </div>
      
      <!-- Category Performance -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Category Performance</h3>
        <div class="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p class="text-gray-500">Category chart will be displayed here</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-2 border-b">
          <span class="text-sm">New order #1234</span>
          <span class="text-sm text-gray-500">2 hours ago</span>
        </div>
        <div class="flex items-center justify-between py-2 border-b">
          <span class="text-sm">Product "Blue T-Shirt" restocked</span>
          <span class="text-sm text-gray-500">4 hours ago</span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm">Revenue milestone reached</span>
          <span class="text-sm text-gray-500">1 day ago</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerAnalytics',
  data() {
    return {
      // Analytics data will be loaded here
    }
  },
  mounted() {
    // Load analytics data when component mounts
    this.loadAnalytics()
  },
  methods: {
    loadAnalytics() {
      // Method to load analytics data from API
      console.log('Loading analytics data...')
    }
  }
}
</script>
