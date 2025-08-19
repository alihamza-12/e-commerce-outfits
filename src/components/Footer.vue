<template>
  <q-footer elevated class="bg-dark text-white">
    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <div class="text-h6 q-mb-md">StyleHub</div>
          <div class="text-caption">
            Your destination for fashion. Discover the latest trends and styles for everyone.
          </div>
        </div>
        
        <div class="col-12 col-md-3">
          <div class="text-subtitle1 q-mb-md">Quick Links</div>
          <q-list dense>
            <q-item clickable v-ripple>
              <q-item-section>About Us</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Contact</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>FAQ</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Shipping & Returns</q-item-section>
            </q-item>
          </q-list>
        </div>
        
        <div class="col-12 col-md-3">
          <div class="text-subtitle1 q-mb-md">Categories</div>
          <q-list dense>
            <q-item clickable v-ripple>
              <q-item-section>Women's Fashion</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Men's Fashion</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Kids' Fashion</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Accessories</q-item-section>
            </q-item>
          </q-list>
        </div>
        
        <div class="col-12 col-md-3">
          <div class="text-subtitle1 q-mb-md">Follow Us</div>
          <div class="q-gutter-sm">
            <q-btn flat round dense icon="facebook" />
            <q-btn flat round dense icon="instagram" />
            <q-btn flat round dense icon="twitter" />
            <q-btn flat round dense icon="youtube" />
          </div>
          <div class="text-caption q-mt-md">
            Subscribe to our newsletter for updates
          </div>
          <q-input
            v-model="email"
            placeholder="Enter your email"
            dense
            filled
            dark
            class="q-mt-sm"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="send" @click="subscribe" />
            </template>
          </q-input>
        </div>
      </div>
      
      <q-separator class="q-my-md" />
      
      <div class="text-center text-caption">
        &copy; 2024 StyleHub. All rights reserved.
      </div>
    </div>
  </q-footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    subscribe() {
      if (this.email) {
        this.$q.notify({
          message: 'Thank you for subscribing!',
          color: 'positive'
        })
        this.email = ''
      }
    }
  }
}
</script>
