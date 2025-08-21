<template>
	<q-page
		class="bg-gradient-to-br from-blue-50 to-pink-50 min-h-screen flex flex-col">
		<!-- HERO SECTION -->
		<section class="w-full bg-white py-14">
			<div
				class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
				<div class="flex-1 text-center md:text-left">
					<h1
						class="text-4xl md:text-5xl font-extrabold font-serif text-pink-600 mb-4 drop-shadow-lg">
						Kids Fashion
					</h1>
					<p class="text-lg text-gray-600 mb-6">
						Discover playful, comfy, and stylish outfits for every little
						personality. From everyday essentials to party-perfect looks—let
						your kids shine!
					</p>
					<q-btn
						unelevated
						color="primary"
						class="rounded-full px-8 py-3 font-semibold text-lg shadow hover:scale-105 transition"
						label="Shop New Arrivals"
						@click="scrollToArrivals" />
				</div>
				<div class="flex-1 flex justify-center">
					<q-img
						src="https://via.placeholder.com/400x340.png?text=Kids+Fashion"
						alt="Kids Fashion"
						class="rounded-3xl shadow-xl w-full max-w-md"
						style="object-fit: cover; height: 340px" />
				</div>
			</div>
		</section>

		<!-- FEATURED CATEGORIES -->
		<section
			class="w-full py-12 bg-gradient-to-r from-pink-50 via-blue-50 to-yellow-50">
			<div class="max-w-6xl mx-auto px-4">
				<h2
					class="text-2xl md:text-3xl font-bold font-serif text-gray-800 mb-8 text-center">
					Featured Categories
				</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div
						v-for="cat in featuredCategories"
						:key="cat.title"
						class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center p-6 group cursor-pointer"
						@click="goToCategory(cat)">
						<q-img
							:src="cat.image"
							:alt="cat.title"
							class="rounded-xl mb-4 group-hover:scale-105 transition-transform"
							style="object-fit: cover; height: 120px; width: 120px" />
						<div class="font-semibold text-lg text-gray-900 mb-1">
							{{ cat.title }}
						</div>
						<div class="text-xs text-gray-500 text-center">{{ cat.desc }}</div>
						<q-btn
							flat
							color="primary"
							:label="cat.cta"
							class="mt-3 font-semibold text-xs" />
					</div>
				</div>
			</div>
		</section>

		<!-- NEW ARRIVALS -->
		<section ref="arrivalsSection" class="w-full py-14 bg-white">
			<div class="max-w-6xl mx-auto px-4">
				<div class="flex justify-between items-center mb-8">
					<h2 class="text-2xl md:text-3xl font-serif font-bold text-blue-700">
						New Arrivals for Kids
					</h2>
					<q-btn
						flat
						color="primary"
						label="View All"
						class="font-semibold"
						@click="viewAll" />
				</div>
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
					<div
						v-for="product in newArrivals"
						:key="product.id"
						class="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl shadow group hover:shadow-xl transition flex flex-col overflow-hidden">
						<q-img
							:src="product.image"
							:alt="product.title"
							class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
							style="border-radius: 1rem 1rem 0 0" />
						<div class="p-4 flex-1 flex flex-col justify-between">
							<div>
								<div class="font-serif text-base font-bold mb-1 text-gray-900">
									{{ product.title }}
								</div>
								<div class="text-gray-500 text-xs mb-2">
									{{ product.brand }}
								</div>
								<div class="flex items-center gap-2 mb-2">
									<q-rating
										:model-value="product.rating"
										max="5"
										size="16px"
										color="amber"
										readonly />
									<span class="text-xs text-gray-400"
										>({{ product.reviews }})</span
									>
								</div>
							</div>
							<div class="flex items-center justify-between mt-2">
								<div class="font-bold text-base text-pink-600">
									${{ product.price }}
								</div>
								<div class="flex gap-2">
									<q-btn
										dense
										round
										flat
										:icon="
											wishlist.includes(product.id)
												? 'favorite'
												: 'favorite_border'
										"
										:color="wishlist.includes(product.id) ? 'pink' : 'grey-6'"
										@click.stop="toggleWishlist(product.id)" />
									<q-btn
										dense
										round
										flat
										icon="shopping_cart"
										:color="cart.includes(product.id) ? 'primary' : 'grey-6'"
										@click.stop="addToCart(product.id)" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- PRODUCT DETAIL DIALOG -->
		<q-dialog v-model="showDetail" persistent>
			<ProductDetail
				v-if="selectedProduct"
				:product="selectedProduct"
				@close="showDetail = false"
				@add-to-cart="addToCart"
				@toggle-wishlist="toggleWishlist"
				:in-cart="cart.includes(selectedProduct?.id)"
				:in-wishlist="wishlist.includes(selectedProduct?.id)" />
		</q-dialog>
	</q-page>
</template>

<script setup>
	import { ref } from "vue";
	import { useQuasar } from "quasar";
	import { useRouter } from "vue-router";
	import ProductDetail from "./shopproduct/ProductDetail.vue";

	// Dummy Data
	const featuredCategories = [
		{
			title: "T-Shirts",
			desc: "Fun prints and soft cotton for all-day play.",
			image:
				"https://images.unsplash.com/photo-1503457574465-494bba506e52?auto=format&fit=crop&w=400&q=80",
			cta: "Shop T-Shirts",
			route: "/kids/tshirts",
		},
		{
			title: "Dresses",
			desc: "Twirl-worthy styles for every little star.",
			image:
				"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
			cta: "Shop Dresses",
			route: "/kids/dresses",
		},
		{
			title: "Shoes",
			desc: "Comfy kicks for running, jumping, and more.",
			image:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
			cta: "Shop Shoes",
			route: "/kids/shoes",
		},
		{
			title: "Accessories",
			desc: "Hats, bags, and more to complete the look.",
			image:
				"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
			cta: "Shop Accessories",
			route: "/kids/accessories",
		},
	];

	const newArrivals = [
		{
			id: 201,
			image:
				"https://images.unsplash.com/photo-1503457574465-494bba506e52?auto=format&fit=crop&w=400&q=80",
			title: "Rainbow Tee",
			brand: "MiniStyle",
			price: 19.99,
			rating: 4.7,
			reviews: 34,
		},
		{
			id: 202,
			image:
				"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
			title: "Summer Dress",
			brand: "Kiddo",
			price: 29.99,
			rating: 4.9,
			reviews: 41,
		},
		{
			id: 203,
			image:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
			title: "Sneaker Fun",
			brand: "PlayFeet",
			price: 24.99,
			rating: 4.5,
			reviews: 28,
		},
		{
			id: 204,
			image:
				"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
			title: "Cool Cap",
			brand: "TinyTrends",
			price: 12.99,
			rating: 4.8,
			reviews: 19,
		},
		{
			id: 205,
			image:
				"https://images.unsplash.com/photo-1503457574465-494bba506e52?auto=format&fit=crop&w=400&q=80",
			title: "Adventure Shorts",
			brand: "MiniStyle",
			price: 17.99,
			rating: 4.6,
			reviews: 22,
		},
		{
			id: 206,
			image:
				"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
			title: "Party Dress",
			brand: "Kiddo",
			price: 34.99,
			rating: 4.9,
			reviews: 37,
		},
		{
			id: 207,
			image:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
			title: "Sporty Sneakers",
			brand: "PlayFeet",
			price: 27.99,
			rating: 4.4,
			reviews: 25,
		},
		{
			id: 208,
			image:
				"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
			title: "Sunshine Hat",
			brand: "TinyTrends",
			price: 10.99,
			rating: 4.7,
			reviews: 16,
		},
	];

	const cart = ref([]);
	const wishlist = ref([]);
	const showDetail = ref(false);
	const selectedProduct = ref(null);

	const $q = useQuasar();
	const router = useRouter();
	const arrivalsSection = ref(null);

	function addToCart(productId) {
		if (!cart.value.includes(productId)) {
			cart.value.push(productId);
			$q.notify({ type: "positive", message: "Added to cart!" });
		}
	}
	function toggleWishlist(productId) {
		const idx = wishlist.value.indexOf(productId);
		if (idx === -1) {
			wishlist.value.push(productId);
			$q.notify({ type: "info", message: "Added to wishlist!" });
		} else {
			wishlist.value.splice(idx, 1);
			$q.notify({ type: "warning", message: "Removed from wishlist." });
		}
	}
	function viewAll() {
		$q.notify({ message: "View all kids products (not implemented)" });
	}
	function goToCategory(cat) {
		if (cat.route) {
			router.push(cat.route);
		} else {
			$q.notify({ message: `Go to: ${cat.title}` });
		}
	}
	function scrollToArrivals() {
		if (arrivalsSection.value) {
			arrivalsSection.value.scrollIntoView({ behavior: "smooth" });
		}
	}
</script>

<style scoped>
	/* Add any custom styles if needed */
</style>
