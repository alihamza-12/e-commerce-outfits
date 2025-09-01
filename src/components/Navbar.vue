<template>
	<div>
		<!-- Main Navbar -->
		<header
			class="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16 lg:h-20">
					<!-- Logo Section -->
					<div
						class="flex items-center space-x-3 cursor-pointer"
						@click="router.push('/')"
						@keydown.enter="router.push('/')"
						tabindex="0"
						role="button"
						title="Go to Home"
						aria-label="Go to Home">
						<div
							class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
							<svg
								class="w-6 h-6 lg:w-7 lg:h-7 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
							</svg>
						</div>
						<div class="flex flex-col">
							<h1 class="text-xl lg:text-2xl font-bold text-gray-800">
								StyleHub
							</h1>
							<span class="text-xs text-gray-500 hidden sm:block"
								>Premium Fashion</span
							>
						</div>
						<div
							class="hidden xl:flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
							<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
							<span>Trusted</span>
						</div>
					</div>

					<!-- Desktop Navigation (>= 969px) -->
					<nav class="show-desktop items-center space-x-5">
						<button
							@click="toggleSearch"
							class="flex items-center space-x-1.5 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							<span class="font-medium">Search</span>
						</button>

						<button
							@click="toggleWishlist"
							class="flex items-center space-x-1.5 px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 relative">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
							<span class="font-medium">Wishlist</span>
							<span
								v-if="wishlistStore.count > 0"
								class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
								>{{ wishlistStore.count }}</span
							>
						</button>

						<button
							@click="toggleCart"
							class="flex items-center space-x-1.5 px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-300 relative">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
							<span class="font-medium">Cart</span>
							<span
								v-if="cartCount > 0"
								class="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
								{{ cartCount }}
							</span>
						</button>

						<button
							@click="toggleContact"
							class="flex items-center space-x-1.5 px-3 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
							<span class="font-medium">Contact</span>
						</button>
					</nav>

					<!-- Right Side Actions -->
					<div class="show-desktop items-center space-x-2">
						<template v-if="authStore.isLoggedIn">
							<UserProfile />
						</template>
						<template v-else>
							<router-link
								to="/loginuser"
								class="px-3 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300">
								Login
							</router-link>
							<router-link
								to="/registeruser"
								class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
								Sign Up
							</router-link>
						</template>
					</div>

					<!-- Mobile Menu Button (≤ 968px) -->
					<button
						@click="toggleMobileMenu"
						class="hide-desktop p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300">
						<svg
							v-if="!showMobileMenu"
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16" />
						</svg>
						<svg
							v-else
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Mobile Menu -->
			<div
				v-if="showMobileMenu"
				class="hide-desktop bg-white border-t border-gray-200 shadow-lg">
				<div class="px-4 py-6 space-y-4">
					<!-- Mobile Quick Actions -->
					<div class="grid grid-cols-2 gap-4 mb-6">
						<div
							@click="toggleSearch"
							class="flex flex-col items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200 cursor-pointer">
							<svg
								class="w-6 h-6 text-indigo-600 mb-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							<span class="text-sm font-medium text-indigo-600">Search</span>
						</div>

						<div
							@click="toggleWishlist"
							class="flex flex-col items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200 cursor-pointer relative">
							<svg
								class="w-6 h-6 text-red-600 mb-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
							<span class="text-sm font-medium text-red-600">Wishlist</span>
							<span
								v-if="wishlistStore.count > 0"
								class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
								>{{ wishlistStore.count }}</span
							>
						</div>

						<div
							@click="toggleCart"
							class="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-200 cursor-pointer relative">
							<svg
								class="w-6 h-6 text-orange-600 mb-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
							<span class="text-sm font-medium text-orange-600">Cart</span>
							<span
								v-if="cartCount > 0"
								class="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
								{{ cartCount }}
							</span>
						</div>

						<div
							@click="toggleContact"
							class="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
							<svg
								class="w-6 h-6 text-blue-600 mb-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
							<span class="text-sm font-medium text-blue-600">Contact</span>
						</div>
					</div>

					<!-- Mobile Auth Buttons -->
					<div class="pt-4 border-t border-gray-200 space-y-3">
						<template v-if="authStore.isLoggedIn">
							<div class="flex items-center justify-between px-2">
								<div class="flex items-center gap-3">
									<img
										:src="authStore.currentUser?.avatar"
										alt="avatar"
										class="w-10 h-10 rounded-full object-cover"
										v-if="authStore.currentUser?.avatar" />
									<div
										class="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-white font-semibold"
										v-else>
										{{
											(
												authStore.currentUser?.name ||
												authStore.currentUser?.email ||
												"U"
											)
												.split(" ")
												.map((s) => s[0])
												.slice(0, 2)
												.join("")
										}}
									</div>
									<div>
										<div class="font-semibold">
											{{
												authStore.currentUser?.name ||
												authStore.currentUser?.email
											}}
										</div>
										<div class="text-xs text-gray-500">
											{{ authStore.currentUser?.role || "" }}
										</div>
									</div>
								</div>
								<div class="flex gap-2">
									<button
										@click="
											() => {
												showMobileMenu = false;
												router.push('/customer/profile');
											}
										"
										class="px-3 py-2 bg-gray-100 rounded-lg">
										Profile
									</button>
									<button
										@click="
											() => {
												showMobileMenu = false;
												handleLogout();
											}
										"
										class="px-3 py-2 bg-red-600 text-white rounded-lg">
										Logout
									</button>
								</div>
							</div>
						</template>
						<template v-else>
							<router-link
								to="/loginuser"
								class="block w-full text-center px-4 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300"
								@click="showMobileMenu = false">
								Login
							</router-link>
							<router-link
								to="/registeruser"
								class="block w-full text-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
								@click="showMobileMenu = false">
								Sign Up
							</router-link>
						</template>
					</div>
				</div>
			</div>

			<!-- Search Overlay -->
			<div
				v-if="showSearchOverlay"
				class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
				<div
					class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 transform transition-all duration-300"
					@click.stop>
					<div class="flex items-center space-x-4 mb-4">
						<svg
							class="w-6 h-6 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<input
							ref="searchInput"
							v-model="searchQuery"
							type="text"
							placeholder="Search for products, brands, categories..."
							class="flex-1 text-lg border-none outline-none bg-transparent"
							@keyup.enter="submitSearch"
							@keyup.escape="closeSearch" />
						<button
							@click="closeSearch"
							class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div class="border-t border-gray-200 pt-4">
						<div class="text-sm text-gray-500 mb-3">Popular searches:</div>
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tag in popularSearches"
								:key="tag"
								@click="
									searchQuery = tag;
									submitSearch();
								"
								class="px-3 py-1 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 text-gray-600 rounded-full text-sm cursor-pointer transition-colors duration-200">
								{{ tag }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Contact Modal -->
			<div
				v-if="showContactModal"
				class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
				<div
					class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300"
					@click.stop>
					<div
						class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div
									class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
									<svg
										class="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
									</svg>
								</div>
								<div>
									<h3 class="text-xl font-bold">Contact Us</h3>
									<p class="text-white/80 text-sm">We're here to help</p>
								</div>
							</div>
							<button
								@click="closeContact"
								class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-200">
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					<div class="p-6 space-y-6">
						<div class="grid grid-cols-1 gap-4">
							<div
								class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
								<div
									class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<div>
									<div class="font-semibold text-gray-800">Email Support</div>
									<div class="text-sm text-gray-600">stylehub@gmail.com</div>
								</div>
							</div>

							<div
								class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
								<div
									class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
								</div>
								<div>
									<div class="font-semibold text-gray-800">Phone Support</div>
									<div class="text-sm text-gray-600">+92 300 1234567</div>
								</div>
							</div>

							<div
								class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
								<div
									class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
									</svg>
								</div>
								<div>
									<div class="font-semibold text-gray-800">Live Chat</div>
									<div class="text-sm text-gray-600">Available 24/7</div>
								</div>
							</div>
						</div>

						<form @submit.prevent="submitContactForm" class="space-y-4">
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-2"
									>Quick Message</label
								>
								<textarea
									v-model="contactMessage"
									rows="3"
									placeholder="How can we help you today?"
									class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"></textarea>
							</div>
							<button
								type="submit"
								:disabled="!contactMessage.trim()"
								class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
								Send Message
							</button>
						</form>

						<div class="pt-4 border-t border-gray-200 space-y-3 text-center">
							<button
								@click="showContactModal = false"
								class="w-full px-4 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Cart Sidebar -->
		<div
			v-if="showCartSidebar"
			class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
			<div
				class="bg-white w-full max-w-md h-full shadow-2xl transform transition-all duration-300"
				@click.stop>
				<div
					class="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
								<svg
									class="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold">Shopping Cart</h3>
								<p class="text-white/80 text-sm">{{ cartCount }} items</p>
							</div>
						</div>
						<button
							@click="closeCart"
							class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-200">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-6">
					<div v-if="cartCount === 0" class="text-center py-12">
						<div
							class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								class="w-8 h-8 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
						</div>
						<h4 class="text-lg font-semibold text-gray-800 mb-2">
							Your cart is empty
						</h4>
						<p class="text-gray-600 mb-6">
							Start shopping to add items to your cart
						</p>
						<button
							@click="closeCart"
							class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200">
							Continue Shopping
						</button>
					</div>
					<div v-else>
						<div class="space-y-4 max-h-[60vh] overflow-auto">
							<div
								v-for="item in cartStore.cartItems"
								:key="item.id"
								class="flex items-center justify-between p-3 border rounded-lg">
								<div class="flex items-center gap-3">
									<img
										:src="item.image || '/vite.svg'"
										alt="img"
										class="w-16 h-16 object-cover rounded" />
									<div>
										<div class="font-semibold text-gray-800">
											{{ item.title }}
										</div>
										<div class="text-sm text-gray-500">
											${{ (item.price || 0).toFixed(2) }}
										</div>
									</div>
								</div>
								<div class="flex flex-col items-end gap-2">
									<div class="flex items-center gap-2">
										<button
											@click="updateCartQuantity(item.id, item.quantity - 1)"
											class="px-2 py-1 bg-gray-100 rounded">
											-
										</button>
										<div class="px-3">{{ item.quantity }}</div>
										<button
											@click="updateCartQuantity(item.id, item.quantity + 1)"
											class="px-2 py-1 bg-gray-100 rounded">
											+
										</button>
									</div>
									<div class="text-sm text-gray-600">
										Total: ${{
											((item.price || 0) * (item.quantity || 0)).toFixed(2)
										}}
									</div>
									<button
										@click="removeCartItem(item.id)"
										class="text-red-500 text-sm mt-1">
										Remove
									</button>
								</div>
							</div>
						</div>
						<div class="pt-4 border-t">
							<div class="flex items-center justify-between mb-3">
								<div class="font-semibold">Subtotal</div>
								<div class="font-semibold text-indigo-600">
									${{ safeSubtotal }}
								</div>
							</div>
							<div class="flex gap-2">
								<button
									@click="proceedToCheckout"
									class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">
									Checkout
								</button>
								<button
									@click="closeCart"
									class="flex-1 px-4 py-2 bg-gray-200 rounded-lg">
									Continue Shopping
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Wishlist Sidebar -->
		<div
			v-if="showWishlistSidebar"
			class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
			<div
				class="bg-white w-full max-w-md h-full shadow-2xl transform transition-all duration-300"
				@click.stop>
				<div class="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
								<svg
									class="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold">Wishlist</h3>
								<p class="text-white/80 text-sm">Your saved items</p>
							</div>
						</div>
						<button
							@click="closeWishlist"
							class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-200">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-6">
					<div v-if="wishlistStore.count === 0" class="text-center py-12">
						<div
							class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								class="w-8 h-8 text-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</div>
						<h4 class="text-lg font-semibold text-gray-800 mb-2">
							Your wishlist is empty
						</h4>
						<p class="text-gray-600 mb-6">
							Save items you love to view them later
						</p>
						<button
							@click="closeWishlist"
							class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200">
							Start Shopping
						</button>
					</div>
					<div v-else>
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-lg font-semibold">
								Your Wishlist ({{ wishlistStore.count }})
							</h4>
							<div class="flex gap-2">
								<button
									@click="
										async () => {
											await wishlistStore.clearAll();
											$q.notify({ message: 'Wishlist cleared' });
										}
									"
									class="px-3 py-1 bg-gray-100 rounded">
									Clear
								</button>
								<button
									@click="closeWishlist"
									class="px-3 py-1 bg-gray-200 rounded">
									Close
								</button>
							</div>
						</div>
						<div class="overflow-auto max-h-[60vh] pr-2">
							<ul class="space-y-4">
								<li
									v-for="it in wishlistStore.wishlistItems"
									:key="it.id"
									class="flex items-center gap-3">
									<img
										:src="it.image || '/vite.svg'"
										alt="img"
										class="w-16 h-16 object-cover rounded" />
									<div class="flex-1">
										<div class="font-semibold">
											{{ it.name ?? "Product #" + it.product_id }}
										</div>
										<div class="text-sm text-gray-500">
											₹{{ it.price ?? "-" }}
										</div>
									</div>
									<div class="flex gap-2">
										<button
											@click="
												async () => {
													await wishlistStore.remove(it.id);
													$q.notify({ message: 'Removed from wishlist' });
												}
											"
											class="px-3 py-1 bg-red-100 text-red-600 rounded">
											Remove
										</button>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, nextTick, onMounted, onUnmounted, computed } from "vue";
	import { useAuthStore } from "@/stores/auth";
	import { useCartStore } from "@/stores/cart";
	import { useRouter } from "vue-router";
	import { useQuasar } from "quasar";
	import UserProfile from "./common/UserProfile.vue";
	import { useWishlistStore } from "@/stores/wishlist";

	const showMobileMenu = ref(false);
	const showSearchOverlay = ref(false);
	const showContactModal = ref(false);
	const showCartSidebar = ref(false);
	const showWishlistSidebar = ref(false);
	const searchQuery = ref("");
	const contactMessage = ref("");
	const $q = useQuasar();
	const cartStore = useCartStore();
	const authStore = useAuthStore();
	const wishlistStore = useWishlistStore();

	// make cartCount reactive so UI updates immediately when store changes
	const cartCount = computed(() => cartStore.totalItems);

	const safeSubtotal = computed(() => {
		const p = Number(cartStore.totalPrice) || 0;
		return p.toFixed(2);
	});
	const searchInput = ref(null);

	const popularSearches = ref([
		"Summer Collection",
		"Dresses",
		"Sneakers",
		"Accessories",
		"Sale Items",
		"New Arrivals",
	]);

	// Desktop starts at 969px now
	const DESKTOP_MIN = 969;

	function handleResize() {
		if (window.innerWidth >= DESKTOP_MIN) {
			showMobileMenu.value = false;
		}
	}

	onMounted(() => {
		window.addEventListener("resize", handleResize);
		handleResize();
		// if logged in, fetch remote cart to sync
		if (authStore.checkAuth()) {
			cartStore.fetchRemoteCart && cartStore.fetchRemoteCart();
		}
	});

	onUnmounted(() => {
		window.removeEventListener("resize", handleResize);
	});

	function toggleMobileMenu() {
		showMobileMenu.value = !showMobileMenu.value;
	}

	function toggleSearch() {
		showSearchOverlay.value = true;
		showMobileMenu.value = false;
		nextTick(() => {
			searchInput.value && searchInput.value.focus();
		});
	}

	function closeSearch() {
		showSearchOverlay.value = false;
		searchQuery.value = "";
	}

	function submitSearch() {
		if (searchQuery.value.trim()) {
			console.log("Searching for:", searchQuery.value);
			closeSearch();
		}
	}

	function toggleContact() {
		showContactModal.value = true;
		showMobileMenu.value = false;
	}

	function closeContact() {
		showContactModal.value = false;
		contactMessage.value = "";
	}

	function submitContactForm() {
		if (contactMessage.value.trim()) {
			console.log("Contact message:", contactMessage.value);
			alert("Message sent successfully! We'll get back to you soon.");
			closeContact();
		}
	}

	function toggleCart() {
		showCartSidebar.value = true;
		showMobileMenu.value = false;
	}

	function closeCart() {
		showCartSidebar.value = false;
	}

	function toggleWishlist() {
		showWishlistSidebar.value = true;
		showMobileMenu.value = false;
	}

	function closeWishlist() {
		showWishlistSidebar.value = false;
	}

	function scrollToSection(sectionId) {
		showMobileMenu.value = false;
		const el = document.getElementById(sectionId);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	}

	// auth
	const router = useRouter();

	function handleLogout() {
		// clear wishlist locally so guest sees empty wishlist after logout
		try {
			if (wishlistStore && wishlistStore.items) {
				wishlistStore.items = [];
			}
		} catch (e) {
			// ignore
		}
		authStore.logout();
		router.push("/");
	}

	function updateCartQuantity(productId, quantity) {
		if (quantity <= 0) {
			cartStore
				.syncRemove(productId)
				.then(() => {
					$q.notify({ type: "positive", message: "Item removed from cart" });
				})
				.catch(() => {
					$q.notify({ type: "negative", message: "Remove failed" });
				});
		} else {
			cartStore
				.syncUpdate(productId, quantity)
				.then(() => {
					$q.notify({ type: "positive", message: "Cart updated" });
				})
				.catch(() => {
					$q.notify({ type: "negative", message: "Update failed" });
				});
		}
	}

	function removeCartItem(productId) {
		cartStore
			.syncRemove(productId)
			.then(() => {
				$q.notify({ type: "positive", message: "Item removed from cart" });
			})
			.catch(() => {
				$q.notify({ type: "negative", message: "Remove failed" });
			});
	}

	function proceedToCheckout() {
		// quick placeholder
		router.push("/checkout");
		closeCart();
	}
</script>

<style scoped>
	/* Desktop breakpoint >= 969px */
	.show-desktop {
		display: none;
	}
	.hide-desktop {
		display: block;
	}
	@media (min-width: 969px) {
		.show-desktop {
			display: flex;
		}
		.hide-desktop {
			display: none;
		}
	}

	/* Animations */
	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes slideInRight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
	.fixed {
		animation: fadeInScale 0.3s ease-out;
	}
	.bg-white.w-full.max-w-md.h-full {
		animation: slideInRight 0.3s ease-out;
	}

	/* Scrollbar */
	::-webkit-scrollbar {
		width: 6px;
	}
	::-webkit-scrollbar-track {
		background: #f1f5f9;
	}
	::-webkit-scrollbar-thumb {
		background: linear-gradient(to bottom, #6366f1, #8b5cf6);
		border-radius: 3px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(to bottom, #4f46e5, #7c3aed);
	}

	/* Focus */
	button:focus,
	input:focus,
	textarea:focus {
		outline: 2px solid #6366f1;
		outline-offset: 2px;
	}

	/* Transitions */
	* {
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke, opacity, box-shadow, transform,
			filter, backdrop-filter;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 200ms;
	}

	/* Small devices tweaks */
	@media (max-width: 640px) {
		.max-w-2xl {
			max-width: 95vw;
		}
		.max-w-md {
			max-width: 100vw;
		}
	}

	/* Touch targets */
	@media (hover: none) and (pointer: coarse) {
		button {
			min-height: 44px;
			min-width: 44px;
		}
	}

	/* High contrast */
	@media (prefers-contrast: high) {
		.bg-white\/95 {
			background: #fff;
		}
		.text-gray-600 {
			color: #000;
		}
		.border-gray-200\/50 {
			border-color: #000;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
