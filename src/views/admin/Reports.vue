<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Reports</div>
    
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Revenue Report</div>
            <div class="q-mt-md">
              <canvas style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">Revenue Chart</div>
              </canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Sales Report</div>
            <div class="q-mt-md">
              <canvas style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">Sales Chart</div>
              </canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Report Summary</div>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Total Revenue</q-item-label>
              <q-item-label caption>$125,450.00</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Total Orders</q-item-label>
              <q-item-label caption>1,234 orders</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Top Category</q-item-label>
              <q-item-label caption>Electronics - $45,230</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Reports component with dummy data
</script>
