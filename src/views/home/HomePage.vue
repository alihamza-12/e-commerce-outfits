<template>
	<q-page class="bg-grey-1">
		<!-- Hero Section -->
		<section class="hero-section">
			<div class="hero-content">
				<div class="hero-left">
					<h1 class="hero-title">
						<span>Discover</span><br />
						<span class="hero-title-bold">Your Style</span>
					</h1>
					<p class="hero-desc">
						Shop the latest trends in fashion with exclusive collections for men
						and women.<br />
						Quality meets affordability in every piece.
					</p>
					<div class="hero-btns">
						<router-link to="/products/women" class="hero-btn hero-btn-primary">
							<i class="bi bi-gender-female"></i>
							Shop Women
						</router-link>
						<router-link to="/men" class="hero-btn hero-btn-outline">
							<i class="bi bi-gender-male"></i>
							Shop Men
						</router-link>
					</div>
				</div>
				<div class="hero-right">
					<div class="hero-img-card">
						<img
							src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
							alt="Fashion Collection"
							class="hero-img" />
					</div>
				</div>
			</div>
		</section>

		<!-- Animated Banner Section -->
		<section class="q-py-md">
			<div class="container q-px-md">
				<q-card
					class="banner-card q-pa-lg flex flex-row items-center justify-between shadow-4 animate-fadeInUp">
					<div class="flex items-center">
						<q-icon
							name="local_offer"
							color="primary"
							size="36px"
							class="q-mr-md animate-bounce" />
						<span class="text-h6 text-primary text-weight-bold"
							>Summer Sale: Up to 50% OFF on selected items!</span
						>
					</div>
					<q-btn color="primary" label="Shop Now" to="/shop" class="q-ml-md" />
				</q-card>
			</div>
		</section>

		<!-- Categories Section -->
		<section class="q-py-xl">
			<div class="container q-px-md">
				<h2 class="text-h4 text-center q-mb-xl animate-fadeInUp">
					Shop by Category
				</h2>
				<div class="row q-col-gutter-lg justify-center">
					<div
						v-for="cat in categories"
						:key="cat.name"
						class="col-12 col-sm-6 col-md-3">
						<q-card
							class="category-card cursor-pointer flex flex-col items-center q-pa-md hoverable animate-fadeInUp"
							@click="$router.push(cat.link)">
							<div class="category-img-wrapper q-mb-md">
								<q-img
									:src="cat.image"
									height="160px"
									width="100%"
									class="rounded-borders category-img"
									style="object-fit: cover">
									<div class="category-overlay absolute-full flex flex-center">
										<q-btn
											color="primary"
											label="Explore"
											size="md"
											flat
											class="category-explore-btn" />
									</div>
								</q-img>
							</div>
							<div class="text-h6 text-center q-mt-sm">{{ cat.name }}</div>
						</q-card>
					</div>
				</div>
			</div>
		</section>

		<!-- Featured Products -->
		<section class="q-py-xl bg-grey-2">
			<div class="container q-px-md">
				<h2 class="text-h4 text-center q-mb-xl animate-fadeInUp">
					Featured Products
				</h2>
				<div class="row q-col-gutter-lg">
					<div
						v-for="product in featuredProducts"
						:key="product.id"
						class="col-12 col-sm-6 col-md-4 col-lg-3">
						<q-card class="product-card hoverable animate-fadeInUp">
							<q-img
								:src="product.image"
								:alt="product.name"
								height="220px"
								class="rounded-borders product-img">
								<q-badge
									v-if="product.discount"
									color="red"
									class="absolute-top-right q-ma-sm">
									-{{ product.discount }}%
								</q-badge>
								<q-btn
									flat
									dense
									round
									icon="favorite_border"
									color="pink"
									class="absolute-top-left q-ma-sm"
									@click.stop="addToWishlist(product)" />
							</q-img>
							<q-card-section>
								<div class="row items-center">
									<div class="text-h6 ellipsis">{{ product.name }}</div>
									<q-space />
									<q-rating
										v-model="product.rating"
										size="18px"
										color="amber"
										readonly />
								</div>
								<div class="text-subtitle2 text-grey-7 q-mb-xs">
									{{ product.category }}
								</div>
								<div class="row items-center q-mt-sm">
									<div class="text-h6 text-primary">${{ product.price }}</div>
									<q-space />
									<q-btn
										color="primary"
										icon="shopping_cart"
										round
										size="md"
										@click="addToCart(product)" />
								</div>
							</q-card-section>
						</q-card>
					</div>
				</div>
				<div class="flex flex-center q-mt-xl">
					<q-btn
						color="primary"
						label="View All Products"
						size="lg"
						to="/shop" />
				</div>
			</div>
		</section>

		<!-- Brand Logos Section -->
		<section class="q-py-xl">
			<div class="container q-px-md">
				<div
					class="trusted-brands-header flex flex-center items-center q-mb-lg">
					<q-icon
						name="verified"
						color="primary"
						size="32px"
						class="trusted-icon q-mr-sm" />
					<h2 class="trusted-title text-h5 text-center text-grey-8">
						Trusted by Top Brands
					</h2>
				</div>
				<div class="row q-col-gutter-xl justify-center items-center">
					<div v-for="brand in brands" :key="brand.name" class="col-auto">
						<q-img
							:src="brand.logo"
							:alt="brand.name"
							style="width: 100px; height: 40px"
							class="brand-logo-img animate-fadeIn trusted-brand-img" />
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="q-py-xl">
			<div class="container q-px-md">
				<div class="row q-col-gutter-xl justify-center">
					<div
						v-for="feature in features"
						:key="feature.title"
						class="col-12 col-md-4">
						<q-card
							class="feature-card flex flex-col items-center q-pa-lg hoverable animate-fadeInUp">
							<q-icon
								:name="feature.icon"
								size="56px"
								:color="feature.color"
								class="q-mb-md" />
							<h3 class="text-h5 q-mb-sm text-center">{{ feature.title }}</h3>
							<p class="text-grey-7 text-center">{{ feature.desc }}</p>
						</q-card>
					</div>
				</div>
			</div>
		</section>

		<!-- Testimonials Section -->
		<section class="q-py-xl bg-grey-2">
			<div class="container q-px-md">
				<h2 class="text-h4 text-center q-mb-xl animate-fadeInUp">
					What Our Customers Say
				</h2>
				<div class="row q-col-gutter-lg justify-center">
					<div v-for="t in testimonials" :key="t.name" class="col-12 col-md-4">
						<q-card
							class="testimonial-card q-pa-lg flex flex-col items-center animate-fadeInUp">
							<q-avatar size="64px" class="q-mb-md">
								<img :src="t.avatar" :alt="t.name" />
							</q-avatar>
							<q-rating
								v-model="t.rating"
								size="20px"
								color="amber"
								readonly
								class="q-mb-sm" />
							<div class="text-subtitle1 text-center q-mb-md">
								"{{ t.text }}"
							</div>
							<div class="text-caption text-grey-7">{{ t.name }}</div>
						</q-card>
					</div>
				</div>
			</div>
		</section>

		<!-- Newsletter Section -->
		<section class="q-py-xl bg-primary">
			<div class="container q-px-md">
				<div class="row justify-center">
					<div class="col-12 col-md-8 col-lg-6">
						<q-card
							class="newsletter-card q-pa-xl flex flex-col items-center animate-fadeInUp">
							<div class="newsletter-icon-wrapper">
								<q-icon
									name="email"
									size="48px"
									color="primary"
									class="newsletter-icon" />
							</div>
							<h2 class="text-h4 q-mb-md text-center newsletter-title">
								Stay Updated
							</h2>
							<p class="q-mb-lg text-center newsletter-desc">
								Subscribe to our newsletter for exclusive offers and new
								arrivals.
							</p>
							<q-form
								@submit="subscribeNewsletter"
								class="q-gutter-md flex flex-col items-center w-full">
								<q-input
									v-model="email"
									type="email"
									label="Enter your email"
									filled
									bg-color="white"
									color="primary"
									class="newsletter-input"
									:rules="[
										(val) => !!val || 'Email is required',
										(val) =>
											/.+@.+\..+/.test(val) || 'Please enter a valid email',
									]"
									style="width: 100%; max-width: 350px" />
								<q-btn
									type="submit"
									label="Subscribe"
									color="primary"
									text-color="white"
									size="lg"
									:loading="loading"
									class="newsletter-btn"
									style="width: 100%; max-width: 200px" />
							</q-form>
						</q-card>
					</div>
				</div>
			</div>
		</section>
	</q-page>
</template>

<script setup>
	import { ref } from "vue";
	import { useQuasar } from "quasar";

	const $q = useQuasar();
	const email = ref("");
	const loading = ref(false);

	const categories = [
		{
			name: "Women",
			icon: "female",
			color: "pink-5",
			image:
				"https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400",
			link: "/products/women",
		},
		{
			name: "Men",
			icon: "male",
			color: "blue-5",
			image:
				"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400",
			link: "/men",
		},
		{
			name: "Accessories",
			icon: "watch",
			color: "amber-7",
			image:
				"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
			link: "/products/accessories",
		},
		{
			name: "Shoes",
			icon: "directions_run",
			color: "deep-orange-5",
			image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
			link: "/products/shoes",
		},
	];

	const featuredProducts = ref([
		{
			id: 1,
			name: "Classic White T-Shirt",
			category: "Women",
			price: 29.99,
			image:
				"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
			discount: 20,
			rating: 4.5,
		},
		{
			id: 2,
			name: "Denim Jacket",
			category: "Men",
			price: 89.99,
			image:
				"https://images.unsplash.com/photo-1591047139821-d76591b7715a?w=400",
			discount: 15,
			rating: 4.2,
		},
		{
			id: 3,
			name: "Summer Dress",
			category: "Women",
			price: 59.99,
			image:
				"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
			discount: 0,
			rating: 4.8,
		},
		{
			id: 4,
			name: "Running Shoes",
			category: "Shoes",
			price: 119.99,
			image: "https://images.unsplash.com/photo-1542291026-7eec2647b263?w=400",
			discount: 25,
			rating: 4.7,
		},
		{
			id: 5,
			name: "Leather Handbag",
			category: "Accessories",
			price: 79.99,
			image:
				"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400",
			discount: 10,
			rating: 4.6,
		},
		{
			id: 6,
			name: "Slim Fit Jeans",
			category: "Men",
			price: 49.99,
			image:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
			discount: 0,
			rating: 4.1,
		},
		{
			id: 7,
			name: "Silk Scarf",
			category: "Accessories",
			price: 24.99,
			image:
				"https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?w=400",
			discount: 5,
			rating: 4.3,
		},
		{
			id: 8,
			name: "Sneakers",
			category: "Shoes",
			price: 99.99,
			image:
				"https://images.unsplash.com/photo-1517260911205-8c6f6fa6c43a?w=400",
			discount: 0,
			rating: 4.4,
		},
	]);

	const brands = [
		{
			name: "Nike",
			logo: "https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png",
		},
		{
			name: "Adidas",
			logo: "data:image/png;base64,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",
		},
		{
			name: "Zara",
			logo: "https://1000logos.net/wp-content/uploads/2017/05/Zara-logo.png",
		},
		{
			name: "H&M",
			logo: "data:image/png;base64,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",
		},
		{
			name: "Gucci",
			logo: "data:image/png;base64,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",
		},
	];

	const testimonials = [
		{
			name: "Ayesha Khan",
			avatar: "https://randomuser.me/api/portraits/women/44.jpg",
			rating: 5,
			text: "Amazing quality and fast delivery! My go-to store for all things fashion.",
		},
		{
			name: "Ali Raza",
			avatar: "https://randomuser.me/api/portraits/men/32.jpg",
			rating: 4,
			text: "Great selection and easy checkout. Highly recommended.",
		},
		{
			name: "Sara Malik",
			avatar: "https://randomuser.me/api/portraits/women/65.jpg",
			rating: 5,
			text: "Love the new arrivals and the customer service is top-notch!",
		},
	];

	const features = [
		{
			icon: "local_shipping",
			color: "primary",
			title: "Free Shipping",
			desc: "Free shipping on orders over $50",
		},
		{
			icon: "shield",
			color: "primary",
			title: "Secure Payment",
			desc: "100% secure payment processing",
		},
		{
			icon: "refresh",
			color: "primary",
			title: "Easy Returns",
			desc: "30-day return policy",
		},
	];

	const addToCart = (product) => {
		$q.notify({
			color: "positive",
			position: "top",
			message: `${product.name} added to cart`,
			icon: "check_circle",
		});
	};

	const addToWishlist = (product) => {
		$q.notify({
			color: "pink",
			position: "top",
			message: `${product.name} added to wishlist`,
			icon: "favorite",
		});
	};

	const subscribeNewsletter = () => {
		loading.value = true;
		setTimeout(() => {
			loading.value = false;
			$q.notify({
				color: "positive",
				position: "top",
				message: "Successfully subscribed to newsletter",
				icon: "email",
			});
			email.value = "";
		}, 1000);
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.custom-hero-card {
		min-height: 420px;
		/* border-radius: 18px; */
		animation: fadeInUp 1s;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
	}

	.custom-hero-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		opacity: 0.7;
		z-index: 1;
	}

	.custom-hero-title {
		font-size: 2.5rem;
		line-height: 1.2;
		margin-bottom: 1rem;
		position: relative;
		display: inline-block;
		color: #fff;
		z-index: 2;
	}

	.custom-hero-title br {
		display: none;
	}

	.custom-hero-desc {
		font-size: 1.125rem;
		line-height: 1.6;
		margin-bottom: 2rem;
		color: #fff;
		z-index: 2;
		text-align: center;
	}

	.custom-hero-btns {
		display: flex;
		gap: 1rem;
		z-index: 2;
	}

	.custom-hero-btn {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border-radius: 30px;
		text-align: center;
		transition: all 0.3s;
	}

	.primary-btn {
		background: #027be3;
		color: #fff;
		box-shadow: 0 4px 12px rgba(2, 123, 227, 0.2);
	}

	.primary-btn:hover {
		background: #0056b3;
	}

	.outline-btn {
		border: 2px solid #fff;
		color: #fff;
		background: transparent;
	}

	.outline-btn:hover {
		background: #fff;
		color: #027be3;
	}

	.custom-hero-img {
		max-width: 100%;
		height: auto;
		border-radius: 14px;
		animation: zoomIn 1.5s;
	}

	.banner-card {
		border-radius: 14px;
		background: linear-gradient(90deg, #e3f0ff 0%, #f8fafc 100%);
		box-shadow: 0 4px 24px rgba(2, 123, 227, 0.1);
		animation: fadeInUp 1.1s;
	}

	.category-card {
		border-radius: 14px;
		min-height: 320px;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 12px rgba(2, 123, 227, 0.08);
		animation: fadeInUp 1.2s;
	}

	.category-card:hover {
		transform: translateY(-10px) scale(1.05);
		box-shadow: 0 12px 32px rgba(2, 123, 227, 0.16);
	}

	.product-card {
		border-radius: 14px;
		min-height: 340px;
		transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 12px rgba(2, 123, 227, 0.08);
		animation: fadeInUp 1.3s;
	}

	.product-card:hover {
		box-shadow: 0 12px 32px rgba(2, 123, 227, 0.16);
		transform: translateY(-8px) scale(1.04);
	}

	.feature-card {
		border-radius: 14px;
		min-height: 220px;
		transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 12px rgba(2, 123, 227, 0.08);
		animation: fadeInUp 1.4s;
	}

	.feature-card:hover {
		box-shadow: 0 12px 32px rgba(2, 123, 227, 0.16);
		transform: translateY(-8px) scale(1.04);
	}

	.newsletter-card {
		border-radius: 14px;
		box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		animation: fadeInUp 1.5s;
	}

	.newsletter-btn {
		font-weight: 600;
		letter-spacing: 0.5px;
	}

	.brand-logo-img {
		filter: grayscale(0.2) brightness(0.95);
		opacity: 0.85;
		transition: filter 0.3s, opacity 0.3s, transform 0.3s;
	}

	.brand-logo-img:hover {
		filter: grayscale(0) brightness(1.1);
		opacity: 1;
		transform: scale(1.08);
	}

	.testimonial-card {
		border-radius: 14px;
		min-height: 220px;
		background: #fff;
		box-shadow: 0 2px 12px rgba(2, 123, 227, 0.08);
		transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeInUp 1.6s;
	}

	.testimonial-card:hover {
		box-shadow: 0 12px 32px rgba(2, 123, 227, 0.16);
		transform: translateY(-8px) scale(1.04);
	}

	.animate-fadeInUp {
		animation: fadeInUp 1s;
	}

	.animate-fadeIn {
		animation: fadeIn 1.2s;
	}

	.animate-gradientText {
		background: linear-gradient(90deg, #027be3 0%, #00c6ff 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradientMove 2.5s infinite alternate;
	}

	.animate-bounce {
		animation: bounce 1.2s infinite;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(40px);
		}

		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes gradientMove {
		0% {
			background-position: 0%;
		}

		100% {
			background-position: 100%;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-10px);
		}
	}

	@media (max-width: 599px) {
		.custom-hero-card {
			padding: 2rem 0.5rem !important;
			min-height: 320px;
		}

		.category-card,
		.product-card,
		.feature-card,
		.testimonial-card {
			min-height: 180px;
		}
	}

	.hero-section {
		width: 100%;
		background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
		border-radius: 9px;
		margin-bottom: 2.5rem;
		padding: 0;
		min-height: 480px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
	}

	.hero-content {
		display: flex;
		align-items: stretch;
		justify-content: center;
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
		padding: 0;
	}

	.hero-left {
		flex: 1.1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 4.5rem 2.5rem 4.5rem 4rem;
		z-index: 2;
	}

	.hero-title {
		font-size: 3.2rem;
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 1.2rem;
		background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
		letter-spacing: 1px;
		text-shadow: 0 4px 24px rgba(0, 123, 255, 0.13);
		animation: gradientMove 3s infinite alternate;
	}

	.hero-title-bold {
		font-weight: 900;
		font-size: 3.7rem;
		letter-spacing: 1.5px;
		display: inline-block;
	}

	.hero-desc {
		font-size: 1.35rem;
		color: #e3f2fd;
		margin-bottom: 2.2rem;
		font-weight: 500;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		max-width: 600px;
	}

	.hero-btns {
		display: flex;
		gap: 1.2rem;
		margin-top: 0.5rem;
	}

	.hero-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.85rem 2.2rem;
		font-size: 1.18rem;
		font-weight: 600;
		border-radius: 1.5rem;
		box-shadow: 0 2px 12px rgba(33, 150, 243, 0.13);
		transition: background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s,
			transform 0.18s;
		text-decoration: none;
		letter-spacing: 0.5px;
		outline: none;
		border: none;
		cursor: pointer;
		position: relative;
	}

	.hero-btn-primary {
		background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
		color: #22223b;
		border: none;
	}
	.hero-btn-primary:hover,
	.hero-btn-primary:focus {
		background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
		color: #fff;
		box-shadow: 0 6px 24px rgba(67, 233, 123, 0.18);
		transform: translateY(-2px) scale(1.04);
	}

	.hero-btn-outline {
		background: transparent;
		color: #fff;
		border: 2px solid #fff;
	}
	.hero-btn-outline:hover,
	.hero-btn-outline:focus {
		background: #fff;
		color: #1976d2;
		border-color: #43e97b;
		box-shadow: 0 6px 24px rgba(33, 150, 243, 0.13);
		transform: translateY(-2px) scale(1.04);
	}

	.hero-btn i {
		font-size: 1.3em;
		margin-right: 0.2em;
		transition: color 0.2s;
	}

	.hero-right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 2.5rem 2.5rem 0;
	}

	.hero-img-card {
		background: #fff;
		border-radius: 1.7rem;
		box-shadow: 0 8px 32px rgba(2, 123, 227, 0.18);
		padding: 0.7rem;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 480px;
		width: 100%;
		animation: fadeIn 1.2s;
	}

	.hero-img {
		border-radius: 1.2rem;
		width: 100%;
		max-width: 440px;
		height: auto;
		object-fit: cover;
		display: block;
	}

	@keyframes gradientMove {
		0% {
			background-position: 0%;
		}
		100% {
			background-position: 100%;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@media (max-width: 1200px) {
		.hero-title {
			font-size: 2.2rem;
		}
		.hero-title-bold {
			font-size: 2.5rem;
		}
		.hero-left {
			padding: 3rem 1.2rem 3rem 1.2rem;
		}
		.hero-right {
			padding: 1.2rem;
		}
	}

	@media (max-width: 900px) {
		.hero-content {
			flex-direction: column;
			align-items: stretch;
			padding: 0;
		}
		.hero-section {
			border-radius: 14px;
			min-height: 320px;
			padding: 0;
		}
		.hero-left,
		.hero-right {
			padding: 2rem 0.7rem;
		}
		.hero-img-card {
			margin: 2rem auto 0 auto;
			max-width: 98vw;
		}
	}

	@media (max-width: 600px) {
		.hero-section {
			border-radius: 0;
			min-height: 220px;
			padding: 0;
		}
		.hero-title {
			font-size: 1.3rem;
		}
		.hero-title-bold {
			font-size: 1.5rem;
		}
		.hero-left,
		.hero-right {
			padding: 1.2rem 0.5rem;
		}
		.hero-img-card {
			padding: 0.2rem;
			border-radius: 0.7rem;
		}
		.hero-img {
			border-radius: 0.5rem;
		}
	}
</style>
