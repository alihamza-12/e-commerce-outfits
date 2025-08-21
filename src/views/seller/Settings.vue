<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Seller Settings</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Profile Settings -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Profile Settings</h3>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Store Name</label>
            <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      </div>
      
      <!-- Store Settings -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Store Settings</h3>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Store Description</label>
            <textarea rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Business Address</label>
            <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tax ID</label>
            <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Update Store
          </button>
        </form>
      </div>
    </div>
    
    <!-- Notification Settings -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Notification Settings</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span>Email notifications for new orders</span>
          <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
        </div>
        <div class="flex items-center justify-between">
          <span>Email notifications for low stock</span>
          <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
        </div>
        <div class="flex items-center justify-between">
          <span>Email notifications for customer messages</span>
          <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerSettings',
  data() {
    return {
      settings: {
        storeName: '',
        email: '',
        phone: '',
        description: '',
        address: '',
        taxId: '',
        notifications: {
          newOrders: true,
          lowStock: true,
          customerMessages: true
        }
      }
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      // Load existing settings from API
      console.log('Loading seller settings...')
    },
    saveSettings() {
      // Save settings to API
      console.log('Saving seller settings...')
    }
  }
}
</script>
