<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="flex items-center">
          <q-avatar size="32px" class="q-mr-sm">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <span class="text-h6 font-bold">Seller Hub</span>
        </q-toolbar-title>
        
        <div class="q-gutter-sm">
          <q-btn flat round dense icon="notifications">
            <q-badge color="red" floating>3</q-badge>
          </q-btn>
          <q-btn-dropdown flat color="white" :label="user?.name || 'Seller'">
            <q-list>
              <q-item clickable v-close-popup @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :breakpoint="768"
      bordered
      class="bg-white shadow-2"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md q-mb-md">
          <div class="text-center">
            <q-avatar size="80px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold">{{ user?.name || 'Seller Name' }}</div>
            <div class="text-caption text-grey-7">Premium Seller</div>
          </div>
        </div>

        <q-list padding>
          <q-item-label header class="text-uppercase text-grey-7">Main Menu</q-item-label>
          
          <q-item 
            v-for="item in menuItems" 
            :key="item.title"
            clickable 
            v-ripple
            :active="isActive(item.route)"
            @click="navigateTo(item.route)"
            class="q-my-sm rounded-borders"
            :class="isActive(item.route) ? 'bg-primary text-white' : 'text-grey-9'"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption v-if="item.caption">{{ item.caption }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="item.badge">
              <q-badge :color="item.badgeColor || 'primary'" rounded>{{ item.badge }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const user = computed(() => authStore.currentUser)

const menuItems = [
  { title: 'Dashboard', icon: 'dashboard', route: '/seller/dashboard' },
  { title: 'Products', icon: 'inventory_2', route: '/seller/products', badge: 12, badgeColor: 'positive' },
  { title: 'Orders', icon: 'shopping_cart', route: '/seller/orders', badge: 5, badgeColor: 'warning' },
  { title: 'Inventory', icon: 'warehouse', route: '/seller/inventory' },
  { title: 'Revenue', icon: 'trending_up', route: '/seller/revenue' },
  { title: 'Analytics', icon: 'analytics', route: '/seller/analytics' },
  { title: 'Settings', icon: 'settings', route: '/seller/settings' },
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isActive = (routePath) => {
  return route.path === routePath
}

const navigateTo = (routePath) => {
  router.push(routePath)
}

const goToProfile = () => {
  router.push('/seller/profile')
}

const logout = () => {
  authStore.logout()
  router.push('/loginuser')
}
</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, #667eea 0%, #764ba2 100%);
}
</style>
