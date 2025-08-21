<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card>
          <q-card-section>
            <div class="text-h4 text-center q-mb-md">Revenue Dashboard</div>
            <div class="text-subtitle2 text-center text-grey-7">Track your earnings and performance</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-card class="bg-blue-1">
                  <q-card-section>
                    <div class="text-h6">Total Revenue</div>
                    <div class="text-h4">${{ formatCurrency(totalRevenue) }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card class="bg-blue-1">
                  <q-card-section>
                    <div class="text-h6">Monthly Revenue</div>
                    <div class="text-h4">${{ formatCurrency(monthlyRevenue) }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card class="bg-blue-1">
                  <q-card-section>
                    <div class="text-h6">Daily Revenue</div>
                    <div class="text-h4">${{ formatCurrency(dailyRevenue) }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Revenue Trends</div>
                    <div class="text-center q-pa-md">
                      <div class="text-h4 text-blue-6">$125,000</div>
                      <div class="text-subtitle2 text-grey-7">Total Revenue</div>
                      <q-linear-progress :value="0.75" color="blue" class="q-mt-md" />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Top Products</div>
                    <q-list>
                      <q-item v-for="product in topProducts" :key="product.id">
                        <q-item-section>
                          <q-item-label>{{ product.name }}</q-item-label>
                          <q-item-label caption>${{ formatCurrency(product.revenue) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Recent Transactions</div>
                    <q-list>
                      <q-item v-for="transaction in recentTransactions" :key="transaction.id">
                        <q-item-section>
                          <q-item-label>{{ transaction.description }}</q-item-label>
                          <q-item-label caption>{{ transaction.date }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label>${{ formatCurrency(transaction.amount) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Revenue',
  setup() {
    const totalRevenue = ref(125000)
    const monthlyRevenue = ref(15000)
    const dailyRevenue = ref(500)
    
    const topProducts = ref([
      { id: 1, name: 'Premium T-Shirt', revenue: 2500 },
      { id: 2, name: 'Designer Jeans', revenue: 1800 },
      { id: 3, name: 'Leather Jacket', revenue: 1200 }
    ])
    
    const recentTransactions = ref([
      { id: 1, description: 'Order #1234', amount: 150, date: '2024-01-15' },
      { id: 2, description: 'Order #1235', amount: 200, date: '2024-01-14' },
      { id: 3, description: 'Order #1236', amount: 75, date: '2024-01-13' }
    ])

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US').format(value)
    }

    return {
      totalRevenue,
      monthlyRevenue,
      dailyRevenue,
      topProducts,
      recentTransactions,
      formatCurrency
    }
  }
}
</script>
