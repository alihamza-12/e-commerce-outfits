<template>
  <q-layout view="hHh lpR fFf">
    <!-- Only show Navbar for non-admin routes -->
    <Navbar v-if="!isAdminRoute" />
    
    <q-page-container>
      <router-view />
    </q-page-container>
    
    <!-- Only show Footer for non-admin routes -->
    <Footer v-if="!isAdminRoute" />
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

// Check if current route is an admin route
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.q-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.q-page-container {
  flex: 1;
}
</style>
