<template>
  <q-page class="bg-grey-2">
    <!-- Header -->
    <div class="bg-white shadow-2 q-pa-md">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4">Seller Dashboard</div>
          <div class="text-subtitle2 text-grey-7">Welcome back, {{ sellerName }}</div>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-btn
            flat
            round
            icon="refresh"
            @click="refreshData"
            :loading="loading"
          />
          <div class="text-caption text-grey-7">
            Last updated: {{ lastUpdated }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="q-pa-md">
      <!-- Stats Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-blue-1">
            <q-card-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon name="payments" size="md" color="blue" />
                </div>
                <div class="col q-pl-md">
                  <div class="text-h6">${{ formatCurrency(stats.totalRevenue) }}</div>
                  <div class="text-subtitle2 text-grey-7">Total Revenue</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-green-1">
            <q-card-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon name="shopping_cart" size="md" color="green" />
                </div>
                <div class="col q-pl-md">
                  <div class="text-h6">{{ stats.totalOrders }}</div>
                  <div class="text-subtitle2 text-grey-7">Total Orders</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-purple-1">
            <q-card-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon name="inventory_2" size="md" color="purple" />
                </div>
                <div class="col q-pl-md">
                  <div class="text-h6">{{ stats.totalProducts }}</div>
                  <div class="text-subtitle2 text-grey-7">Products</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-orange-1">
            <q-card-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon name="pending_actions" size="md" color="orange" />
                </div>
                <div class="col q-pl-md">
                  <div class="text-h6">{{ stats.pendingOrders }}</div>
                  <div class="text-subtitle2 text-grey-7">Pending Orders</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h6">Revenue Overview</div>
            </q-card-section>
            <q-card-section>
              <canvas ref="revenueChart" style="height: 300px;"></canvas>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales Performance</div>
            </q-card-section>
            <q-card-section>
              <canvas ref="salesChart" style="height: 300px;"></canvas>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="row q-col-gutter-md">
        <!-- Recent Orders -->
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Recent Orders</div>
            </q-card-section>
            <q-list separator>
              <q-item v-for="order in recentOrders" :key="order.id">
                <q-item-section>
                  <q-item-label>#{{ order.id }}</q-item-label>
                  <q-item-label caption>{{ order.customer }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>${{ order.amount }}</q-item-label>
                  <q-badge :color="getStatusColor(order.status)" :label="order.status" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Top Products -->
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Top Products</div>
            </q-card-section>
            <q-list separator>
              <q-item v-for="product in topProducts" :key="product.id">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="product.image" :alt="product.name">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ product.name }}</q-item-label>
                  <q-item-label caption>{{ product.sales }} sales</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Quick Actions</div>
            </q-card-section>
            <q-card-section class="q-gutter-sm">
              <q-btn
                label="Add New Product"
                color="primary"
                class="full-width"
                to="/seller/products/add"
              />
              <q-btn
                label="Manage Inventory"
                color="secondary"
                class="full-width"
                to="/seller/inventory"
              />
              <q-btn
                label="View All Orders"
                color="accent"
                class="full-width"
                to="/seller/orders"
              />
              <q-btn
                label="Account Settings"
                color="grey"
                class="full-width"
                to="/seller/settings"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'SellerDashboard',
  setup() {
    const sellerName = ref('John Doe')
    const lastUpdated = ref(new Date().toLocaleString())
    const loading = ref(false)
    
    const stats = reactive({
      totalRevenue: 12530.50,
      totalOrders: 245,
      totalProducts: 42,
      pendingOrders: 18
    })

    const recentOrders = ref([
      { id: 'ORD-001', customer: 'Alice Johnson', amount: 299.99, status: 'processing' },
      { id: 'ORD-002', customer: 'Bob Smith', amount: 199.50, status: 'shipped' },
      { id: 'ORD-003', customer: 'Carol White', amount: 450.00, status: 'delivered' },
      { id: 'ORD-004', customer: 'David Brown', amount: 89.99, status: 'pending' }
    ])

    const topProducts = ref([
      { id: 1, name: 'Wireless Headphones', image: '/placeholder.jpg', sales: 156 },
      { id: 2, name: 'Smart Watch', image: '/placeholder.jpg', sales: 89 },
      { id: 3, name: 'Laptop Stand', image: '/placeholder.jpg', sales: 67 }
    ])

    const getStatusColor = (status) => {
      const colors = {
        pending: 'orange',
        processing: 'blue',
        shipped: 'purple',
        delivered: 'green'
      }
      return colors[status] || 'grey'
    }

    const formatCurrency = (amount) => {
      return amount.toFixed(2)
    }

    const refreshData = () => {
      loading.value = true
      setTimeout(() => {
        lastUpdated.value = new Date().toLocaleString()
        loading.value = false
      }, 1000)
    }

    const initCharts = () => {
      // Revenue Chart
      const revenueCtx = document.querySelector('canvas')
      if (revenueCtx) {
        new Chart(revenueCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue',
              data: [2000, 3500, 2800, 4200, 3800, 5100],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        })
      }
    }

    onMounted(() => {
      initCharts()
    })

    return {
      sellerName,
      lastUpdated,
      loading,
      stats,
      recentOrders,
      topProducts,
      getStatusColor,
      formatCurrency,
      refreshData
    }
  }
}
</script>
