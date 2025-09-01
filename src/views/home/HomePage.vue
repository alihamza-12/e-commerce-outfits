<template>
	<div
		class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
		<!-- Hero Section - Enhanced -->
		<section
			class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
			<div class="absolute inset-0 bg-black/20"></div>
			<div
				class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

			<!-- Floating Elements -->
			<div
				class="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
			<div
				class="absolute bottom-20 right-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			<div
				class="absolute top-40 right-40 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>

			<div
				class="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
				<div class="flex flex-col md:flex-row gap-12 items-center">
					<div class="flex-1 text-center md:text-left">
						<div
							class="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/30">
							✨ New Collections Available
						</div>
						<h1
							class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight mb-6">
							Elevate Your
							<span
								class="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
								Style
							</span>
							<br class="hidden md:block" />
							<span class="text-4xl md:text-5xl lg:text-6xl"
								>Discover Amazing</span
							>
							<span
								class="bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent ml-3">
								Collections
							</span>
						</h1>
						<p
							class="text-xl md:text-2xl text-white/90 max-w-2xl mb-8 leading-relaxed">
							Hand‑picked premium products with lightning-fast delivery,
							ultra-secure checkout and hassle-free returns.
						</p>
						<div class="flex flex-wrap gap-4 justify-center md:justify-start">
							<button
								class="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
								View Catalog
							</button>
						</div>
					</div>
					<div class="flex-1 relative">
						<div class="relative group">
							<div
								class="absolute -inset-4 bg-gradient-to-r from-pink-500 to-blue-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
							<div
								class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
								<img
									class="w-full h-[420px] object-cover transform group-hover:scale-105 transition duration-700"
									src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
									alt="Hero Fashion Banner"
									loading="lazy" />
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Categories Section - Enhanced -->
		<section class="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-12">
			<div
				class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8">
				<div class="flex items-center justify-between mb-8">
					<div>
						<h2 class="text-3xl font-bold text-slate-800 mb-2">
							Browse Categories
						</h2>
						<p class="text-slate-600">
							Discover products across different categories
						</p>
					</div>
					<button
						v-if="categoriesError"
						@click="fetchCategoriesProducts"
						class="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition font-medium">
						🔄 Retry
					</button>
				</div>

				<div class="flex flex-wrap gap-4">
					<button
						class="cat-chip-enhanced"
						:class="
							activeCategoryId === null ? 'cat-chip-enhanced--active' : ''
						"
						@click="selectAll">
						<span class="flex items-center gap-2">
							🌟 View All
							<span v-if="totalProductsAll" class="count-enhanced">{{
								totalProductsAll
							}}</span>
						</span>
					</button>
					<template v-if="!loadingCategories && categories.length">
						<button
							v-for="c in categories"
							:key="c.id"
							class="cat-chip-enhanced"
							:class="
								activeCategoryId === c.id ? 'cat-chip-enhanced--active' : ''
							"
							@click="selectCategory(c)">
							<span class="flex items-center gap-2">
								{{ c.name }}
								<span
									v-if="typeof c.products_count === 'number'"
									class="count-enhanced"
									>{{ c.products_count }}</span
								>
							</span>
						</button>
					</template>

					<!-- Enhanced Category Skeletons -->
					<template v-else-if="loadingCategories">
						<div
							v-for="n in 6"
							:key="'cat-skel-' + n"
							class="animate-pulse h-14 w-32 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300" />
					</template>
				</div>
				<p
					v-if="categoriesError"
					class="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
					⚠️ {{ categoriesError }}
				</p>
			</div>
		</section>

		<!-- Enhanced Controls Section -->
		<section class="max-w-7xl mx-auto px-6 mb-8">
			<div
				class="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6">
				<div class="flex flex-col lg:flex-row gap-6 lg:items-center">
					<div class="flex flex-1 gap-4">
						<div class="relative flex-1">
							<div
								class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
								🔍
							</div>
							<input
								v-model.trim="searchQuery"
								type="text"
								placeholder="Search for amazing products..."
								class="w-full rounded-2xl border-2 border-slate-200 pl-12 pr-12 py-4 text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white/50 backdrop-blur" />
							<button
								v-if="searchQuery"
								@click="searchQuery = ''"
								class="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition">
								✕
							</button>
						</div>
						<div class="relative">
							<select
								v-model="sortKey"
								class="appearance-none rounded-2xl border-2 border-slate-200 px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur cursor-pointer min-w-[180px]">
								<option value="featured">⭐ Featured</option>
								<option value="price-asc">💰 Price: Low → High</option>
								<option value="price-desc">💎 Price: High → Low</option>
								<option value="stock-desc">📦 Stock: High → Low</option>
								<option value="name-asc">🔤 Name A → Z</option>
							</select>
							<div
								class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
								▼
							</div>
						</div>
						<button
							@click="resetFilters"
							class="px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-bold hover:from-slate-200 hover:to-slate-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
							🔄 Reset
						</button>
					</div>

					<div class="flex items-center gap-4">
						<div
							class="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
							📄 Page
							<span class="font-bold text-slate-800">{{
								pagination.currentPage
							}}</span>
							/ <span class="font-bold">{{ pagination.lastPage || 1 }}</span>
						</div>
						<div class="flex gap-2">
							<button
								@click="goPrev"
								:disabled="pagination.currentPage <= 1 || loadingProducts"
								class="pager-btn-enhanced">
								← Prev
							</button>
							<button
								@click="goNext"
								:disabled="
									pagination.currentPage >= pagination.lastPage ||
									loadingProducts
								"
								class="pager-btn-enhanced">
								Next →
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Products Grid - Enhanced -->
		<section class="max-w-7xl mx-auto px-6 pb-20">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h2 class="text-3xl md:text-4xl font-black text-slate-800 mb-2">
						{{ activeCategoryLabel }}
					</h2>
					<p class="text-slate-600">Premium quality products just for you</p>
				</div>
				<div
					v-if="!loadingProducts && displayProducts.length"
					class="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-200">
					<span class="text-sm text-blue-600">Showing </span>
					<span class="font-bold text-blue-800 text-lg">{{
						displayProducts.length
					}}</span>
					<span class="text-sm text-blue-600"> premium items</span>
				</div>
			</div>

			<!-- Enhanced Skeletons -->
			<div
				v-if="loadingProducts"
				class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<div
					v-for="n in 8"
					:key="'prod-skel-' + n"
					class="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg animate-pulse">
					<div class="relative">
						<div
							class="h-64 w-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
						<div
							class="absolute top-4 left-4 w-16 h-6 bg-slate-300 rounded-lg"></div>
						<div
							class="absolute top-4 right-4 w-12 h-6 bg-slate-300 rounded-lg"></div>
					</div>
					<div class="p-6 space-y-4">
						<div class="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
						<div class="flex gap-2">
							<div class="h-5 w-20 bg-slate-200 rounded-full"></div>
							<div class="h-5 w-16 bg-slate-200 rounded-full"></div>
						</div>
						<div class="h-4 w-full bg-slate-200 rounded"></div>
						<div class="h-4 w-4/5 bg-slate-200 rounded"></div>
						<div class="flex justify-between items-center pt-4">
							<div class="h-8 w-24 bg-slate-200 rounded-xl"></div>
							<div class="flex gap-2">
								<div class="h-8 w-16 bg-slate-200 rounded-xl"></div>
								<div class="h-8 w-20 bg-slate-200 rounded-xl"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Enhanced Products Grid -->
			<div
				v-else
				class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<div
					v-for="(product, idx) in visibleProducts"
					:key="product.id ?? idx"
					class="group relative flex flex-col bg-white border border-slate-200/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-2"
					@mouseenter="() => startAutoPlay(product)"
					@mouseleave="() => stopAutoPlay(product)">
					<!-- Enhanced Image Section -->
					<div
						class="relative w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden cursor-pointer"
						@click="openQuickView(product)"
						@touchstart="(e) => onTouchStart(e, product)"
						@touchend="(e) => onTouchEnd(e, product)">
						<!-- Main Image -->
						<img
							:src="
								product.gallery.length
									? product.gallery[product.currentIndex]
									: product.image
							"
							:alt="product.name"
							class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
							loading="lazy" />

						<!-- Overlay Gradient -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

						<!-- Enhanced Dots -->
						<div
							v-if="product.gallery.length > 1"
							class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
							<button
								v-for="(g, i) in product.gallery"
								:key="i"
								@click.stop="selectImage(product, i)"
								class="w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125"
								:class="
									product.currentIndex === i
										? 'bg-white shadow-lg scale-125'
										: 'bg-white/60 hover:bg-white/80'
								" />
						</div>

						<!-- Enhanced Stock Badge -->
						<div class="absolute top-4 left-4">
							<div
								class="px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border"
								:class="
									product.stock > 0
										? 'bg-emerald-500/90 text-white border-emerald-400'
										: 'bg-red-500/90 text-white border-red-400'
								">
								{{ product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock" }}
							</div>
						</div>

						<!-- Enhanced Seller Badge -->
						<div v-if="product.seller" class="absolute top-4 right-4">
							<div
								class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-700 border border-white/50 shadow-lg">
								🏪 {{ product.seller }}
							</div>
						</div>

						<!-- Quick Action Overlay -->
						<div
							class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
							<button
								@click.stop="openQuickView(product)"
								class="px-6 py-3 rounded-2xl bg-white/95 backdrop-blur text-slate-800 font-bold shadow-xl transform scale-95 group-hover:scale-100 transition-all duration-300 hover:bg-white">
								👁️ Quick View
							</button>
						</div>
					</div>

					<!-- Enhanced Product Info -->
					<div
						class="flex flex-col flex-1 p-6 bg-gradient-to-b from-white to-slate-50/50">
						<h3
							class="font-bold text-slate-900 text-lg mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
							{{ product.name }}
						</h3>

						<div class="flex items-center gap-2 mb-3 flex-wrap">
							<span
								class="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow">
								📂 {{ product.category }}
							</span>
							<span
								v-if="product.imagesCount > 1"
								class="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
								🖼️ {{ product.imagesCount }}
							</span>
						</div>

						<p class="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
							{{ product.description }}
						</p>

						<!-- Enhanced Price & Actions -->
						<div class="mt-auto">
							<div class="flex items-center justify-between mb-4">
								<div
									class="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
									₹{{ product.priceDisplay }}
								</div>
								<div
									class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
									💎 Premium
								</div>
							</div>
							<div class="flex gap-3">
								<button
									class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-bold hover:from-slate-200 hover:to-slate-300 transition-all transform hover:scale-105 shadow-md"
									@click.stop="openQuickView(product)">
									👁️ View
								</button>
								<button
									:disabled="product.stock === 0"
									@click.stop="addToCart(product)"
									class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
									🛒 Add to Cart
								</button>
								<button
									@click.stop="toggleWishlist(product)"
									:aria-pressed="wishlistStore.isInWishlist(product.id)"
									class="ml-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all hover:scale-105 flex items-center justify-center"
									:title="
										wishlistStore.isInWishlist(product.id)
											? 'Remove from wishlist'
											: 'Add to wishlist'
									">
									<!-- Filled heart when in wishlist -->
									<svg
										v-if="wishlistStore.isInWishlist(product.id)"
										class="w-5 h-5 text-red-600"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true">
										<path
											d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4 8.24 4 9.91 4.81 11 6.09 12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>
									<!-- Outline heart when not in wishlist -->
									<svg
										v-else
										class="w-5 h-5 text-gray-400"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										aria-hidden="true">
										<path
											d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<!-- Product Shine Effect -->
					<div
						class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
				</div>

				<!-- No Products Message -->
				<div
					v-if="!visibleProducts.length && !loadingProducts"
					class="col-span-full text-center py-20">
					<div class="max-w-md mx-auto">
						<div class="text-6xl mb-4">🔍</div>
						<h3 class="text-2xl font-bold text-slate-700 mb-2">
							No Products Found
						</h3>
						<p class="text-slate-500 mb-6">
							We couldn't find any products matching your criteria. Try
							adjusting your filters.
						</p>
						<button
							@click="resetFilters"
							class="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
							🔄 Reset Filters
						</button>
					</div>
				</div>
			</div>

			<!-- Error Message -->
			<div v-if="productsError" class="mt-8 text-center">
				<div
					class="inline-block bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
					<div class="text-4xl mb-2">⚠️</div>
					<p class="text-sm text-red-600 mb-4">{{ productsError }}</p>
					<button
						@click="retryCurrent"
						class="px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition">
						🔄 Retry
					</button>
				</div>
			</div>
		</section>

		<!-- Enhanced Quick View Modal -->
		<transition name="modal-fade">
			<div
				v-if="quickView.open"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
				@click.self="closeQuickView">
				<div
					class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20 transform transition-all duration-300">
					<!-- Enhanced Close Button -->
					<button
						@click="closeQuickView"
						class="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur shadow-xl hover:bg-white transition-all transform hover:scale-110 hover:rotate-90">
						<span class="text-xl font-bold text-slate-600">✕</span>
					</button>

					<div class="grid md:grid-cols-2 gap-0">
						<!-- Enhanced Image Section -->
						<div
							class="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200">
							<img
								v-if="quickView.product.gallery.length"
								:src="quickView.product.gallery[quickView.product.currentIndex]"
								class="w-full h-full object-cover"
								:alt="quickView.product.name" />

							<!-- Enhanced Modal Dots -->
							<div
								v-if="quickView.product.gallery.length > 1"
								class="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
								<button
									v-for="(g, i) in quickView.product.gallery"
									:key="i"
									@click="selectImage(quickView.product, i)"
									class="w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125"
									:class="
										quickView.product.currentIndex === i
											? 'bg-blue-600 shadow-lg scale-125'
											: 'bg-white/70 hover:bg-white shadow'
									" />
							</div>

							<!-- Enhanced Stock Badge for Modal -->
							<div class="absolute top-6 left-6">
								<div
									class="px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-sm border-2"
									:class="
										quickView.product.stock > 0
											? 'bg-emerald-500/90 text-white border-emerald-400'
											: 'bg-red-500/90 text-white border-red-400'
									">
									{{
										quickView.product.stock > 0
											? "✅ In Stock"
											: "❌ Out of Stock"
									}}
								</div>
							</div>
						</div>

						<!-- Enhanced Product Details -->
						<div
							class="p-8 flex flex-col bg-gradient-to-b from-white to-slate-50/50">
							<h3 class="text-2xl font-black text-slate-900 mb-4 leading-tight">
								{{ quickView.product.name }}
							</h3>

							<div class="flex gap-3 mb-6 flex-wrap">
								<span
									class="badge-enhanced bg-gradient-to-r from-blue-500 to-blue-600 text-white">
									📂 {{ quickView.product.category }}
								</span>
								<span
									v-if="quickView.product.seller"
									class="badge-enhanced bg-gradient-to-r from-purple-500 to-pink-500 text-white">
									🏪 {{ quickView.product.seller }}
								</span>
								<span
									class="badge-enhanced bg-gradient-to-r from-slate-400 to-slate-500 text-white">
									🆔 {{ quickView.product.id }}
								</span>
							</div>

							<div
								class="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
								<p class="text-sm text-slate-700 leading-relaxed">
									{{
										quickView.product.description ||
										"No description available for this premium product."
									}}
								</p>
							</div>

							<div
								class="text-4xl font-black mb-8 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
								₹{{ quickView.product.priceDisplay }}
							</div>

							<!-- Enhanced Action Buttons -->
							<div class="mt-auto flex gap-4">
								<button
									class="flex-1 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl"
									:disabled="quickView.product.stock === 0"
									@click="addToCart(quickView.product)">
									🛒 Add to Cart
								</button>
								<button
									class="px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-bold hover:from-slate-200 hover:to-slate-300 transition-all transform hover:scale-105 shadow-lg"
									@click="closeQuickView">
									✕ Close
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		onMounted,
		onBeforeUnmount,
		nextTick,
	} from "vue";
	import axios from "../../api/axios";
	import { useCartStore } from "../../stores/cart";
	import { useAuthStore } from "../../stores/auth";
	import { useWishlistStore } from "../../stores/wishlist";
	import { useRouter } from "vue-router";
	import { useQuasar } from "quasar";

	const cartStore = useCartStore();
	const authStore = useAuthStore();
	const $q = useQuasar();
	const wishlistStore = useWishlistStore();
	const router = useRouter();

	/* ------------ State ------------ */
	const categories = ref([]);
	const categoriesError = ref("");
	const loadingCategories = ref(false);
	const activeCategoryId = ref(null);

	const allProductsCache = ref([]); // Only used for "All" page caching (optional)
	const displayProducts = ref([]);
	const loadingProducts = ref(false);
	const productsError = ref("");
	const searchQuery = ref("");
	const sortKey = ref("featured");

	const pagination = reactive({
		currentPage: 1,
		lastPage: 1,
		perPage: 10,
		total: 0,
		endpointType: "all", // 'all' | 'category'
	});

	const lastFetch = reactive({
		type: "all",
		categoryId: null,
	});

	const quickView = reactive({
		open: false,
		product: null,
	});

	const totalProductsAll = ref(null);

	/* ------------ Helpers ------------ */
	function safeLog(...args) {
		/* console.debug('[HomePage]', ...args); */
	}

	function priceToNumber(v) {
		if (v === null || v === undefined) return 0;
		const n = Number(v);
		return isNaN(n) ? 0 : n;
	}

	function resolveImageObject(img) {
		if (!img) return null;
		if (typeof img === "string") return img;
		if (img.url) return img.url;
		if (img.image_path) return img.image_path;
		return null;
	}

	function normalizeProduct(p, idx = 0) {
		const gallery = Array.isArray(p.images)
			? p.images.map(resolveImageObject).filter(Boolean)
			: [];
		const priceNum = priceToNumber(p.price);
		return {
			id: p.id ?? idx,
			category_id: p.category_id ?? null,
			name: p.name ?? "Product",
			description: p.description ?? "",
			price: priceNum,
			priceDisplay: priceNum.toFixed(2),
			stock: p.stock ?? 0,
			is_approved: p.is_approved,
			is_blocked: p.is_blocked,
			imagesCount: gallery.length,
			image: gallery[0] || "https://via.placeholder.com/400x400?text=No+Image",
			gallery,
			currentIndex: 0,
			category: deriveCategoryName(p.category_id),
			seller: p.seller?.company_name || null,
			raw: p,
		};
	}

	function deriveCategoryName(categoryId) {
		const found = categories.value.find((c) => c.id === categoryId);
		return found ? found.name : "Category";
	}

	function extractPaginated(res) {
		// Expect structure: { success:true, data: { current_page, data:[...] } }
		const root = res?.data;
		if (root?.data?.data && Array.isArray(root.data.data)) {
			return {
				items: root.data.data,
				meta: {
					current_page: root.data.current_page,
					last_page: root.data.last_page,
					per_page: root.data.per_page,
					total: root.data.total,
				},
			};
		}
		return {
			items: [],
			meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
		};
	}

	function extractArray(res) {
		const root = res?.data;
		if (Array.isArray(root?.data)) return root.data;
		return [];
	}

	/* ------------ Fetchers ------------ */
	async function fetchCategoriesProducts() {
		loadingCategories.value = true;
		categoriesError.value = "";
		try {
			const res = await axios.get("/categories-products", {
				skipAuthRedirect: true,
			});
			safeLog("categories-products", res);
			const arr = extractArray(res);
			categories.value = arr.map((c) => ({
				id: c.id,
				name: c.name,
				products_count: c.products_count ?? null,
				raw: c,
			}));
		} catch (e) {
			categoriesError.value = "Failed to load categories.";
		} finally {
			loadingCategories.value = false;
		}
	}

	async function fetchAllProducts(page = 1) {
		loadingProducts.value = true;
		productsError.value = "";
		try {
			const res = await axios.get("/products", {
				params: { page },
				skipAuthRedirect: true,
			});
			const { items, meta } = extractPaginated(res);
			const norm = items.map(normalizeProduct);
			displayProducts.value = norm;
			allProductsCache.value = page === 1 ? norm : displayProducts.value;
			pagination.currentPage = meta.current_page;
			pagination.lastPage = meta.last_page;
			pagination.perPage = meta.per_page;
			pagination.total = meta.total;
			pagination.endpointType = "all";
			totalProductsAll.value = meta.total;
			lastFetch.type = "all";
			lastFetch.categoryId = null;
			restartAutoPlay();
		} catch (e) {
			productsError.value = "Failed to load products.";
		} finally {
			loadingProducts.value = false;
		}
	}

	async function fetchCategoryProducts(categoryId, page = 1) {
		if (categoryId == null) {
			return fetchAllProducts(page);
		}
		loadingProducts.value = true;
		productsError.value = "";
		try {
			const res = await axios.get(
				`/categories-products/${categoryId}/products`,
				{
					params: { page },
					skipAuthRedirect: true,
				}
			);
			const { items, meta } = extractPaginated(res);
			const norm = items.map(normalizeProduct);
			displayProducts.value = norm;
			pagination.currentPage = meta.current_page;
			pagination.lastPage = meta.last_page;
			pagination.perPage = meta.per_page;
			pagination.total = meta.total;
			pagination.endpointType = "category";
			lastFetch.type = "category";
			lastFetch.categoryId = categoryId;
			restartAutoPlay();
		} catch (e) {
			productsError.value = "Failed to load category products.";
		} finally {
			loadingProducts.value = false;
		}
	}

	async function fetchSingleProduct(id) {
		try {
			const res = await axios.get(`/products/${id}`, {
				skipAuthRedirect: true,
			});
			const root = res?.data?.data;
			if (root) {
				return normalizeProduct(root);
			}
		} catch {
			/* silent */
		}
		return null;
	}

	/* ------------ User Actions ------------ */
	function selectCategory(cat) {
		if (activeCategoryId.value === cat.id) return;
		activeCategoryId.value = cat.id;
		pagination.currentPage = 1;
		fetchCategoryProducts(cat.id, 1);
	}

	function selectAll() {
		if (activeCategoryId.value === null) return;
		activeCategoryId.value = null;
		pagination.currentPage = 1;
		fetchAllProducts(1);
	}

	function goNext() {
		if (pagination.currentPage >= pagination.lastPage) return;
		const next = pagination.currentPage + 1;
		pagination.currentPage = next;
		if (pagination.endpointType === "all") fetchAllProducts(next);
		else fetchCategoryProducts(activeCategoryId.value, next);
	}

	function goPrev() {
		if (pagination.currentPage <= 1) return;
		const prev = pagination.currentPage - 1;
		pagination.currentPage = prev;
		if (pagination.endpointType === "all") fetchAllProducts(prev);
		else fetchCategoryProducts(activeCategoryId.value, prev);
	}

	function retryCurrent() {
		if (lastFetch.type === "category") {
			fetchCategoryProducts(lastFetch.categoryId, pagination.currentPage);
		} else {
			fetchAllProducts(pagination.currentPage);
		}
	}

	function resetFilters() {
		searchQuery.value = "";
		sortKey.value = "featured";
	}

	function addToCart(product) {
		const payload = {
			id: product.id,
			title: product.name,
			price: product.price,
			image: product.image,
			brand: product.category,
			quantity: 1,
		};
		if (authStore.checkAuth()) {
			cartStore
				.syncAdd(payload)
				.then(() => {
					$q.notify({ type: "positive", message: "Product added to cart" });
				})
				.catch(() => {
					$q.notify({ type: "negative", message: "Add to cart failed" });
				});
		} else {
			cartStore.addToCart(payload);
			$q.notify({ type: "positive", message: "Product added to cart" });
		}
	}

	// Toggle wishlist for a product (exposed to template)
	async function toggleWishlist(product) {
		try {
			const inW = wishlistStore.isInWishlist(product.id);
			if (inW) {
				await wishlistStore.remove(product.id);
				$q.notify({ type: "negative", message: "Removed from wishlist" });
			} else {
				await wishlistStore.add(product.id);
				$q.notify({ type: "positive", message: "Added to wishlist" });
			}
		} catch (e) {
			$q.notify({ type: "negative", message: "Wishlist action failed" });
		}
	}

	/* ------------ Derived ------------ */
	const activeCategoryLabel = computed(() => {
		if (activeCategoryId.value === null) return "All Products";
		const cat = categories.value.find((c) => c.id === activeCategoryId.value);
		return cat ? cat.name : "Products";
	});

	const visibleProducts = computed(() => {
		let list = displayProducts.value.slice();

		if (searchQuery.value) {
			const q = searchQuery.value.toLowerCase();
			list = list.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.description.toLowerCase().includes(q) ||
					(p.seller && p.seller.toLowerCase().includes(q))
			);
		}

		switch (sortKey.value) {
			case "price-asc":
				list.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				list.sort((a, b) => b.price - a.price);
				break;
			case "stock-desc":
				list.sort((a, b) => b.stock - a.stock);
				break;
			case "name-asc":
				list.sort((a, b) => a.name.localeCompare(b.name));
				break;
			default:
				// featured: maybe sort by stock desc then recent (id desc)
				list.sort((a, b) => {
					if (b.stock === a.stock) return b.id - a.id;
					return b.stock - a.stock;
				});
		}
		return list;
	});

	/* ------------ Carousel / Touch ------------ */
	const touchStartX = {};
	function onTouchStart(e, product) {
		touchStartX[product.id] = e.changedTouches
			? e.changedTouches[0].clientX
			: null;
	}
	function onTouchEnd(e, product) {
		const start = touchStartX[product.id];
		if (start == null) return;
		const end = e.changedTouches ? e.changedTouches[0].clientX : null;
		if (end == null) return;
		const diff = start - end;
		const threshold = 35;
		if (diff > threshold) nextImage(product);
		else if (diff < -threshold) prevImage(product);
		delete touchStartX[product.id];
	}

	function nextImage(product) {
		stopAutoPlayForInteraction(product);
		if (!product.gallery.length) return;
		product.currentIndex = (product.currentIndex + 1) % product.gallery.length;
	}
	function prevImage(product) {
		stopAutoPlayForInteraction(product);
		if (!product.gallery.length) return;
		product.currentIndex =
			(product.currentIndex - 1 + product.gallery.length) %
			product.gallery.length;
	}
	function selectImage(product, idx) {
		stopAutoPlayForInteraction(product);
		if (!product.gallery.length) return;
		product.currentIndex = idx;
	}

	/* Autoplay */
	const timers = {};
	const AUTOPLAY_MS = 2600;
	const PAUSE_ON_INTERACTION = true;

	function startAutoPlay(product) {
		if (!product.gallery || product.gallery.length < 2) return;
		if (timers[product.id]) return;
		timers[product.id] = setInterval(() => {
			product.currentIndex =
				(product.currentIndex + 1) % product.gallery.length;
		}, AUTOPLAY_MS);
	}
	function stopAutoPlay(product) {
		const t = timers[product.id];
		if (t) {
			clearInterval(t);
			delete timers[product.id];
		}
	}
	function stopAutoPlayForInteraction(product) {
		if (PAUSE_ON_INTERACTION) stopAutoPlay(product);
	}

	function restartAutoPlay() {
		// Clear any previous timers (e.g., when page/category changes)
		Object.keys(timers).forEach((id) => {
			clearInterval(timers[id]);
			delete timers[id];
		});
		// Start autoplay for all products that have multiple images
		nextTick(() => {
			displayProducts.value.forEach((p) => startAutoPlay(p));
		});
	}

	onBeforeUnmount(() => {
		Object.values(timers).forEach((t) => clearInterval(t));
	});

	/* ------------ Quick View ------------ */
	async function openQuickView(product) {
		// get fresh full product
		const full = await fetchSingleProduct(product.id);
		quickView.product = full || product;
		quickView.open = true;
	}
	function closeQuickView() {
		quickView.open = false;
		quickView.product = null;
	}

	/* ------------ Init ------------ */
	onMounted(async () => {
		await Promise.all([fetchCategoriesProducts(), fetchAllProducts(1)]);
	});
</script>

<style scoped>
	/* Enhanced Category Chips */
	.cat-chip-enhanced {
		@apply relative px-6 py-3 flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur border-2 border-slate-200 text-slate-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-blue-400 hover:text-blue-700 overflow-hidden;
	}
	.cat-chip-enhanced--active {
		@apply bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-xl scale-105;
	}
	.cat-chip-enhanced .count-enhanced {
		@apply inline-block px-2 py-1 rounded-lg text-xs font-black;
	}
	.cat-chip-enhanced:not(.cat-chip-enhanced--active) .count-enhanced {
		@apply bg-slate-100 text-slate-600;
	}
	.cat-chip-enhanced--active .count-enhanced {
		@apply bg-white/20 text-white;
	}

	/* Enhanced Badges */
	.badge-enhanced {
		@apply inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg;
	}

	/* Enhanced Pager Buttons */
	.pager-btn-enhanced {
		@apply px-6 py-3 rounded-2xl font-bold bg-gradient-to-r from-white to-slate-50 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hover:from-blue-50 hover:to-purple-50 hover:border-blue-300;
	}

	/* Enhanced Modal Transitions */
	.modal-fade-enter-active,
	.modal-fade-leave-active {
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.modal-fade-enter-from {
		opacity: 0;
		transform: scale(0.8) translateY(20px);
	}
	.modal-fade-leave-to {
		opacity: 0;
		transform: scale(0.95) translateY(-10px);
	}

	/* Enhanced Line Clamps */
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Custom Scrollbar */
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb {
		background: linear-gradient(45deg, #3b82f6, #8b5cf6);
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(45deg, #2563eb, #7c3aed);
	}

	/* Enhanced Animations */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(2deg);
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-shimmer {
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.4),
			transparent
		);
		background-size: 200% 100%;
		animation: shimmer 2s infinite;
	}

	/* Glassmorphism Effects */
	.glass {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.glass-dark {
		background: rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Custom Gradient Text */
	.gradient-text {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Enhanced Hover Effects */
	.hover-lift {
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.hover-lift:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	/* Professional Focus States */
	input:focus,
	select:focus,
	button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* Enhanced Card Animations */
	.product-card {
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.product-card:hover {
		transform: translateY(-12px) scale(1.03);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
	}
</style>
