<template>
  <q-header elevated class="bg-white text-dark">
    <q-toolbar>
      <q-toolbar-title>
        <router-link to="/" class="text-h6 text-dark text-weight-bold" style="text-decoration: none;">
          StyleHub
        </router-link>
      </q-toolbar-title>

      <q-space />

      <q-btn flat to="/" label="Home" class="q-mx-sm" />
      <q-btn flat to="/shop" label="Shop" class="q-mx-sm" />
      <q-btn flat to="/categories" label="Categories" class="q-mx-sm" />
      <q-btn flat to="/about" label="About" class="q-mx-sm" />
      <q-btn flat to="/contact" label="Contact" class="q-mx-sm" />

      <q-space />

      <q-btn flat round dense icon="search" class="q-mx-sm" />
      <q-btn flat round dense icon="shopping_cart" class="q-mx-sm" />
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>
