<template>
  <div class="bg-gradient-to-br from-blue-50 to-pink-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-white rounded-3xl shadow-xl mx-auto max-w-7xl mt-8 mb-12 overflow-hidden flex flex-col md:flex-row items-center">
      <div class="p-10 flex-1">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Discover Your <span class="text-blue-600">Style</span><br />
          Shop the Latest <span class="text-pink-500">Trends</span>
        </h1>
        <p class="text-lg text-gray-600 mb-6">
          Explore our exclusive collection for Men, Women & Accessories. Fast delivery, easy returns, and best prices!
        </p>
        <div class="flex gap-4">
          <router-link to="/shop">
            <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition">
              Shop Now
            </button>
          </router-link>
          <router-link to="/men">
            <button class="bg-gray-100 text-blue-700 px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-200 transition">
              Men's Collection
            </button>
          </router-link>
          <router-link to="/women">
            <button class="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-pink-700 transition">
              Women's Collection
            </button>
          </router-link>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
          alt="Fashion Banner"
          class="w-full h-96 object-cover"
        />
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="max-w-7xl mx-auto px-4 mb-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <router-link
          v-for="cat in featuredCategories"
          :key="cat.name"
          :to="cat.link"
          class="group block bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center"
        >
          <img :src="cat.image" :alt="cat.name" class="mx-auto h-24 w-24 object-cover mb-3 rounded-full group-hover:scale-110 transition" />
          <div class="text-lg font-semibold text-gray-700 group-hover:text-blue-600">{{ cat.name }}</div>
        </router-link>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="max-w-7xl mx-auto px-4 mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Trending Products</h2>
        <router-link to="/shop" class="text-blue-600 hover:underline font-semibold">View All</router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div
          v-for="(product, idx) in trendingProducts"
          :key="idx"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-4 flex flex-col relative group"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-52 object-cover rounded-xl mb-3 cursor-pointer group-hover:scale-105 transition"
          />
          <div class="flex-1 flex flex-col">
            <h3 class="font-bold text-lg mb-1 text-gray-800 truncate">{{ product.name }}</h3>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">{{ product.category }}</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{{ product.size }}</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{{ product.color }}</span>
            </div>
            <p class="text-gray-500 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-blue-600 font-extrabold text-xl">₹{{ product.price }}</span>
              <button
                class="bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow hover:bg-blue-700 transition"
                @click="addToCart(product)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="max-w-7xl mx-auto px-4 mb-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">What Our Customers Say</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(t, idx) in testimonials"
          :key="idx"
          class="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center"
        >
          <img :src="t.avatar" :alt="t.name" class="w-16 h-16 rounded-full mb-3 object-cover" />
          <div class="text-lg font-semibold text-gray-700 mb-1">{{ t.name }}</div>
          <div class="text-yellow-400 text-xl mb-2">★★★★★</div>
          <p class="text-gray-500">{{ t.text }}</p>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup -->
    <section class="max-w-2xl mx-auto px-4 mb-16">
      <div class="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Get Exclusive Offers</h2>
        <p class="text-gray-500 mb-4">Sign up for our newsletter and get 10% off your first order!</p>
        <form @submit.prevent="subscribeNewsletter" class="flex w-full max-w-md gap-2">
          <input
            v-model="newsletterEmail"
            type="email"
            required
            placeholder="Enter your email"
            class="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
        <div v-if="newsletterMsg" class="mt-3 text-green-600 font-semibold">{{ newsletterMsg }}</div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div class="text-xl font-bold mb-2">E-Commerce Outfits</div>
          <div class="text-gray-400 text-sm">© 2025 All rights reserved.</div>
        </div>
        <div class="flex gap-6">
          <router-link to="/" class="hover:text-white">Home</router-link>
          <router-link to="/shop" class="hover:text-white">Shop</router-link>
          <router-link to="/men" class="hover:text-white">Men</router-link>
          <router-link to="/women" class="hover:text-white">Women</router-link>
          <router-link to="/contact" class="hover:text-white">Contact</router-link>
        </div>
        <div class="flex gap-4">
          <a href="#" class="hover:text-blue-400"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="hover:text-pink-400"><i class="fab fa-instagram"></i></a>
          <a href="#" class="hover:text-blue-300"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue"

// Featured Categories
const featuredCategories = [
  {
    name: "Men",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80",
    link: "/men"
  },
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    link: "/women"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  },
  {
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  }
]

// Trending Products (dummy, you can expand)
const trendingProducts = [
  {
    name: "Men's T-Shirt",
    description: "Black cotton T-Shirt",
    price: 799,
    size: "M",
    color: "Black",
    category: "Men",
    image: "https://via.placeholder.com/300x300?text=T-Shirt",
  },
  {
    name: "Women's Dress",
    description: "Floral summer dress",
    price: 1499,
    size: "M",
    color: "Pink",
    category: "Women",
    image: "https://via.placeholder.com/300x300?text=Dress",
  },
  {
    name: "Sneakers",
    description: "Casual sneakers",
    price: 1999,
    size: "42",
    color: "White",
    category: "Men",
    image: "https://via.placeholder.com/300x300?text=Shoes",
  },
  {
    name: "Handbag",
    description: "Leather handbag",
    price: 2599,
    size: "Medium",
    color: "Brown",
    category: "Women",
    image: "https://via.placeholder.com/300x300?text=Bag",
  },
  {
    name: "Smart Watch",
    description: "Latest smartwatch",
    price: 3499,
    size: "One Size",
    color: "Black",
    category: "Accessories",
    image: "https://via.placeholder.com/300x300?text=Watch",
  },
  {
    name: "Perfume",
    description: "Long-lasting fragrance",
    price: 1399,
    size: "100ml",
    color: "N/A",
    category: "Accessories",
    image: "https://via.placeholder.com/300x300?text=Perfume",
  },
  {
    name: "Women's Heels",
    description: "Elegant black heels for parties.",
    price: 1799,
    size: "38",
    color: "Black",
    category: "Women",
    image: "https://via.placeholder.com/300x300?text=Heels",
  },
  {
    name: "Men's Jacket",
    description: "Winter denim jacket",
    price: 2499,
    size: "L",
    color: "Blue",
    category: "Men",
    image: "https://via.placeholder.com/300x300?text=Jacket",
  }
]

// Testimonials (dummy)
const testimonials = [
  {
    name: "Ayesha Khan",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Amazing quality and fast delivery! I love shopping here."
  },
  {
    name: "Ali Raza",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Great variety and best prices. Highly recommended!"
  },
  {
    name: "Sara Malik",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Customer service is top-notch. Will shop again!"
  }
]

// Newsletter
const newsletterEmail = ref("")
const newsletterMsg = ref("")

function subscribeNewsletter() {
  if (newsletterEmail.value) {
    newsletterMsg.value = "Thank you for subscribing!"
    newsletterEmail.value = ""
    setTimeout(() => (newsletterMsg.value = ""), 3000)
  }
}

// Cart logic (dummy, can be expanded)
function addToCart(product) {
  alert(`${product.name} added to cart!`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>