<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Admin Dashboard</div>
    
    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Total Users</div>
            <div class="text-h4">1,234</div>
            <div class="text-subtitle2">Active customers</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Total Sellers</div>
            <div class="text-h4">89</div>
            <div class="text-subtitle2">Active sellers</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Total Products</div>
            <div class="text-h4">5,678</div>
            <div class="text-subtitle2">Active listings</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">Total Orders</div>
            <div class="text-h4">3,456</div>
            <div class="text-subtitle2">This month</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Revenue Overview</div>
            <div class="q-mt-md">
              <canvas id="revenueChart" style="height: 300px; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">Revenue Chart Placeholder</div>
              </canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>New order #1234</q-item-label>
                  <q-item-label caption>2 minutes ago</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>New user registered</q-item-label>
                  <q-item-label caption>5 minutes ago</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Product approved</q-item-label>
                  <q-item-label caption>10 minutes ago</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dashboard component with dummy data
</script>
