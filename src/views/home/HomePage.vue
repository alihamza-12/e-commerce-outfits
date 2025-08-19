b<template>
  <q-page class="bg-grey-1">
    <!-- Hero Section -->
    <section class="hero-section q-py-xl bg-primary text-white">
      <div class="container q-px-md">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="text-h2 text-weight-bold q-mb-md">
              Discover Your Style
            </h1>
            <p class="text-h6 q-mb-lg">
              Shop the latest trends in fashion with exclusive collections for men and women. 
              Quality meets affordability in every piece.
            </p>
            <div class="q-gutter-md">
              <q-btn 
                color="white" 
                text-color="primary" 
                label="Shop Women"
                size="lg"
                to="/products/women"
              />
              <q-btn 
                outline 
                color="white" 
                label="Shop Men"
                size="lg"
                to="/products/men"
              />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
              alt="Fashion Collection"
              class="rounded-borders shadow-2"
              ratio="1"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="q-py-xl">
      <div class="container q-px-md">
        <h2 class="text-h4 text-center q-mb-xl">Shop by Category</h2>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="category-card cursor-pointer" @click="$router.push('/products/women')">
              <q-img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400" height="250px">
                <div class="absolute-bottom text-h6 text-center">Women</div>
              </q-img>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="category-card cursor-pointer" @click="$router.push('/products/men')">
              <q-img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400" height="250px">
                <div class="absolute-bottom text-h6 text-center">Men</div>
              </q-img>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="category-card cursor-pointer" @click="$router.push('/products/accessories')">
              <q-img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400" height="250px">
                <div class="absolute-bottom text-h6 text-center">Accessories</div>
              </q-img>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="category-card cursor-pointer" @click="$router.push('/products/shoes')">
              <q-img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" height="250px">
                <div class="absolute-bottom text-h6 text-center">Shoes</div>
              </q-img>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="q-py-xl bg-grey-2">
      <div class="container q-px-md">
        <h2 class="text-h4 text-center q-mb-xl">Featured Products</h2>
        <div class="row q-col-gutter-md">
          <div v-for="product in featuredProducts" :key="product.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="product-card">
              <q-img :src="product.image" :alt="product.name" height="300px">
                <q-badge v-if="product.discount" color="red" class="absolute-top-right q-ma-sm">
                  -{{ product.discount }}%
                </q-badge>
              </q-img>
              <q-card-section>
                <div class="text-h6">{{ product.name }}</div>
                <div class="text-subtitle2 text-grey-7">{{ product.category }}</div>
                <div class="row items-center q-mt-sm">
                  <div class="text-h6 text-primary">${{ product.price }}</div>
                  <q-space />
                  <q-btn 
                    color="primary" 
                    icon="shopping_cart" 
                    round 
                    @click="addToCart(product)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="q-py-xl">
      <div class="container q-px-md">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4 text-center">
            <q-icon name="local_shipping" size="64px" color="primary" class="q-mb-md" />
            <h3 class="text-h5 q-mb-sm">Free Shipping</h3>
            <p class="text-grey-7">Free shipping on orders over $50</p>
          </div>
          <div class="col-12 col-md-4 text-center">
            <q-icon name="shield" size="64px" color="primary" class="q-mb-md" />
            <h3 class="text-h5 q-mb-sm">Secure Payment</h3>
            <p class="text-grey-7">100% secure payment processing</p>
          </div>
          <div class="col-12 col-md-4 text-center">
            <q-icon name="refresh" size="64px" color="primary" class="q-mb-md" />
            <h3 class="text-h5 q-mb-sm">Easy Returns</h3>
            <p class="text-grey-7">30-day return policy</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="q-py-xl bg-primary text-white">
      <div class="container q-px-md">
        <div class="row justify-center">
          <div class="col-12 col-md-8 col-lg-6 text-center">
            <h2 class="text-h4 q-mb-md">Stay Updated</h2>
            <p class="q-mb-lg">Subscribe to our newsletter for exclusive offers and new arrivals</p>
            <q-form @submit="subscribeNewsletter" class="q-gutter-md">
              <q-input
                v-model="email"
                type="email"
                label="Enter your email"
                filled
                dark
                bg-color="white"
                color="primary"
                :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Please enter a valid email']"
              />
              <q-btn
                type="submit"
                label="Subscribe"
                color="white"
                text-color="primary"
                size="lg"
                :loading="loading"
              />
            </q-form>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'HomePage',
  setup() {
    const $q = useQuasar()
    const email = ref('')
    const loading = ref(false)

    const featuredProducts = ref([
      {
        id: 1,
        name: 'Classic White T-Shirt',
        category: 'Women',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        discount: 20
      },
      {
        id: 2,
        name: 'Denim Jacket',
        category: 'Men',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1591047139821-d76591b7715a?w=400',
        discount: 15
      },
      {
        id: 3,
        name: 'Summer Dress',
        category: 'Women',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
        discount: 0
      },
      {
        id: 4,
        name: 'Running Shoes',
        category: 'Shoes',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec2647b263?w=400',
        discount: 25
      }
    ])

    const addToCart = (product) => {
      $q.notify({
        color: 'positive',
        position: 'top',
        message: `${product.name} added to cart`,
        icon: 'check_circle'
      })
    }

    const subscribeNewsletter = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Successfully subscribed to newsletter',
          icon: 'email'
        })
        email.value = ''
      }, 1000)
    }

    return {
      email,
      loading,
      featuredProducts,
      addToCart,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

@media (max-width: 599px) {
  .hero-section {
    text-align: center;
  }
}
</style>
