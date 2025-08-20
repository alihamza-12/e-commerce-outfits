<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Seller Dashboard</q-toolbar-title>
        <UserProfile />
        <q-btn flat @click="logout" label="Logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Total Products</div>
                <div class="text-h4 text-primary">12</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Total Orders</div>
                <div class="text-h4 text-positive">45</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Revenue</div>
                <div class="text-h4 text-accent">$2,340</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Welcome, {{ user?.name || 'Seller' }}</div>
                <p class="q-mt-sm">Manage your products and orders from this dashboard.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import UserProfile from '../../components/common/UserProfile.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.currentUser)

const logout = () => {
  authStore.logout()
  router.push('/loginuser')
}
</script>
