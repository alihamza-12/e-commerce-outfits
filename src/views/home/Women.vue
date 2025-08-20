<template>
  <div class="bg-gradient-to-br from-pink-50 to-purple-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-extrabold text-pink-700 mb-1 tracking-tight">Women's Collection</h1>
          <p class="text-gray-500 text-lg">Discover the latest in women's fashion: dresses, tops, shoes, bags, perfumes & more.</p>
        </div>
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 transition w-64 shadow-sm"
          />
          <button
            class="bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-pink-50 transition"
            @click="clearSearch"
            v-if="searchQuery"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Filters & Sort -->
      <div class="flex flex-wrap gap-4 mb-8 items-center">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
        <select v-model="selectedSize" class="filter-select">
          <option value="">All Sizes</option>
          <option v-for="s in sizes" :key="s">{{ s }}</option>
        </select>
        <select v-model="selectedColor" class="filter-select">
          <option value="">All Colors</option>
          <option v-for="c in colors" :key="c">{{ c }}</option>
        </select>
        <select v-model="sortBy" class="filter-select">
          <option value="">Sort By</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="new">Newest</option>
        </select>
        <button
          class="ml-auto bg-pink-600 text-white px-5 py-2 rounded-lg shadow hover:bg-pink-700 transition"
          @click="resetFilters"
        >
          Reset Filters
        </button>
      </div>

      <!-- Product Grid -->
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-400 py-20 text-xl">
        No products found.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div
          v-for="(product, index) in filteredProducts"
          :key="index"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-4 flex flex-col relative group"
        >
          <!-- Wishlist badge -->
          <button
            class="absolute top-3 right-3 z-10 text-2xl"
            :class="wishlist.includes(product) ? 'text-pink-500' : 'text-gray-300 hover:text-pink-400'"
            @click="toggleWishlist(product)"
            :aria-label="wishlist.includes(product) ? 'Remove from wishlist' : 'Add to wishlist'"
          >
            <span v-if="wishlist.includes(product)">♥</span>
            <span v-else>♡</span>
          </button>
          <!-- Product Image -->
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-52 object-cover rounded-xl mb-3 cursor-pointer group-hover:scale-105 transition"
            @click="openProduct(product)"
          />
          <!-- Product Info -->
          <div class="flex-1 flex flex-col">
            <h2 class="font-bold text-lg mb-1 text-gray-800 truncate">{{ product.name }}</h2>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded">{{ product.category }}</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{{ product.size }}</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{{ product.color }}</span>
            </div>
            <p class="text-gray-500 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-pink-600 font-extrabold text-xl">₹{{ product.price }}</span>
              <button
                class="bg-pink-600 text-white px-4 py-1.5 rounded-lg shadow hover:bg-pink-700 transition"
                @click="addToCart(product)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Detail Modal -->
      <transition name="fade">
        <div
          v-if="selectedProduct"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button
              class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              @click="selectedProduct = null"
              aria-label="Close"
            >✖</button>
            <img
              :src="selectedProduct.image"
              :alt="selectedProduct.name"
              class="w-full h-60 object-cover rounded-xl mb-4"
            />
            <h2 class="text-2xl font-bold mb-1 text-gray-800">{{ selectedProduct.name }}</h2>
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded">{{ selectedProduct.category }}</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{{ selectedProduct.size }}</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{{ selectedProduct.color }}</span>
            </div>
            <p class="text-gray-600 mb-2">{{ selectedProduct.description }}</p>
            <span class="text-pink-600 font-extrabold text-xl block mb-4">₹{{ selectedProduct.price }}</span>
            <button
              class="w-full bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition"
              @click="addToCart(selectedProduct)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const products = ref([
  {
    name: "Floral Dress",
    description: "Elegant floral print summer dress.",
    price: 1599,
    size: "M",
    color: "Pink",
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket for all seasons.",
    price: 2499,
    size: "L",
    color: "Blue",
    category: "Jackets",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "White Sneakers",
    description: "Trendy white sneakers for every outfit.",
    price: 1999,
    size: "39",
    color: "White",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Handbag",
    description: "Stylish leather handbag with gold accents.",
    price: 2199,
    size: "Medium",
    color: "Brown",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Perfume",
    description: "Long-lasting floral fragrance for women.",
    price: 1399,
    size: "100ml",
    color: "N/A",
    category: "Perfume",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Casual Top",
    description: "Soft cotton top for daily comfort.",
    price: 799,
    size: "S",
    color: "Yellow",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Skinny Jeans",
    description: "Stretchable skinny jeans for a perfect fit.",
    price: 1499,
    size: "28",
    color: "Blue",
    category: "Jeans",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Heels",
    description: "Elegant black heels for parties and events.",
    price: 1799,
    size: "38",
    color: "Black",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sling Bag",
    description: "Trendy sling bag for casual outings.",
    price: 999,
    size: "Small",
    color: "Red",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Party Dress",
    description: "Shimmering party dress for special occasions.",
    price: 2599,
    size: "L",
    color: "Silver",
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Crop Top",
    description: "Trendy crop top for summer style.",
    price: 699,
    size: "M",
    color: "White",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Boots",
    description: "Stylish brown boots for winter.",
    price: 2299,
    size: "40",
    color: "Brown",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  }
])

const categories = ["Dresses", "Tops", "Jackets", "Shoes", "Bags", "Perfume", "Jeans"]
const sizes = ["S", "M", "L", "28", "38", "39", "40", "100ml", "Medium", "Small"]
const colors = ["Pink", "Blue", "White", "Brown", "Yellow", "Red", "Black", "Silver", "N/A"]

const selectedCategory = ref("")
const selectedSize = ref("")
const selectedColor = ref("")
const sortBy = ref("")
const searchQuery = ref("")

const wishlist = ref([])
const cart = ref([])
const selectedProduct = ref(null)

const filteredProducts = computed(() => {
  let result = [...products.value]

  // Search
  if (searchQuery.value) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Category filter
  if (selectedCategory.value) {
    result = result.filter((p) => p.category === selectedCategory.value)
  }

  // Size filter
  if (selectedSize.value) {
    result = result.filter((p) => p.size === selectedSize.value)
  }

  // Color filter
  if (selectedColor.value) {
    result = result.filter((p) => p.color === selectedColor.value)
  }

  // Sort
  if (sortBy.value === "low") {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === "high") {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === "new") {
    result = result.reverse() // dummy: latest at end
  }

  return result
})

const addToCart = (product) => {
  if (!cart.value.includes(product)) {
    cart.value.push(product)
    alert(`${product.name} added to cart!`)
  }
}

const toggleWishlist = (product) => {
  if (wishlist.value.includes(product)) {
    wishlist.value = wishlist.value.filter((p) => p !== product)
  } else {
    wishlist.value.push(product)
  }
}

const openProduct = (product) => {
  selectedProduct.value = product
}

const clearSearch = () => {
  searchQuery.value = ""
}

const resetFilters = () => {
  selectedCategory.value = ""
  selectedSize.value = ""
  selectedColor.value = ""
  sortBy.value = ""
  searchQuery.value = ""
}
</script>

<style scoped>
.filter-select {
  @apply border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 transition shadow-sm;
  min-width: 150px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>