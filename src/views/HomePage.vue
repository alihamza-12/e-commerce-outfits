<template>
  <q-layout view="hHh lpR fFf">
    <Navbar />
    
    <q-page-container>
      <q-page>
        <!-- Hero Section -->
        <div class="hero-section q-pa-md">
          <div class="text-center q-py-xl">
            <div class="text-h3 text-weight-bold text-primary q-mb-md">Discover Your Style</div>
            <div class="text-h5 text-grey-7 q-mb-lg">Shop the latest trends in fashion</div>
            <q-btn 
              color="primary" 
              size="lg" 
              label="Shop Now" 
              class="q-px-xl q-py-sm"
              rounded
            />
          </div>
        </div>

        <!-- Featured Categories -->
        <div class="q-pa-md q-py-xl">
          <div class="text-h4 text-center text-weight-bold q-mb-lg">Shop by Category</div>
          <div class="row q-col-gutter-md justify-center">
            <div class="col-12 col-md-4">
              <q-card class="category-card cursor-pointer">
                <q-card-section class="text-center">
                  <div class="text-h6 text-weight-bold q-mb-sm">Women</div>
                  <div class="text-subtitle2 text-grey-7">Latest trends for women</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="category-card cursor-pointer">
                <q-card-section class="text-center">
                  <div class="text-h6 text-weight-bold q-mb-sm">Men</div>
                  <div class="text-subtitle2 text-grey-7">Style for the modern man</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="category-card cursor-pointer">
                <q-card-section class="text-center">
                  <div class="text-h6 text-weight-bold q-mb-sm">Kids</div>
                  <div class="text-subtitle2 text-grey-7">Adorable styles for children</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Featured Products -->
        <div class="q-pa-md q-py-xl bg-grey-2">
          <div class="text-h4 text-center text-weight-bold q-mb-lg">Featured Products</div>
          <div class="row q-col-gutter-md justify-center">
            <div v-for="i in 4" :key="i" class="col-12 col-sm-6 col-md-3">
              <q-card class="product-card">
                <q-img
                  src="https://via.placeholder.com/300x200"
                  :ratio="1"
                />
                <q-card-section>
                  <div class="text-h6">Product {{ i }}</div>
                  <div class="text-subtitle2 text-grey-7">Stylish and comfortable</div>
                  <div class="text-h6 text-primary q-mt-sm">$49.99</div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat color="primary" label="Add to Cart" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <Footer />
  </q-layout>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'HomePage',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.category-card {
  transition: transform 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
}

.product-card {
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}
</style>
