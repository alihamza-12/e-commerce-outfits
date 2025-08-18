<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">Settings</div>
    
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Platform Settings</div>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Site Name</q-item-label>
                  <q-input v-model="siteName" outlined dense />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Admin Email</q-item-label>
                  <q-input v-model="adminEmail" outlined dense />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Maintenance Mode</q-item-label>
                  <q-toggle v-model="maintenanceMode" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Payment Settings</div>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Stripe Integration</q-item-label>
                  <q-toggle v-model="stripeEnabled" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>PayPal Integration</q-item-label>
                  <q-toggle v-model="paypalEnabled" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Commission Rate (%)</q-item-label>
                  <q-input v-model="commissionRate" type="number" outlined dense suffix="%" />
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
import { ref } from 'vue'

const siteName = ref('E-Commerce Admin')
const adminEmail = ref('admin@example.com')
const maintenanceMode = ref(false)
const stripeEnabled = ref(true)
const paypalEnabled = ref(true)
const commissionRate = ref(5)
</script>
