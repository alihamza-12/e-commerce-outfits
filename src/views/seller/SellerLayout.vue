<template>
  <q-layout view="lHh Lpr lFf">
    <SellerSidebar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import SellerSidebar from './SellerSidebar.vue';
</script>