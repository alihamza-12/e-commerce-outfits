<template>
	<q-header elevated class="navbar-root">
		<q-toolbar class="q-px-md">
			<!-- Search Bar (shows when search icon clicked) -->
			<transition name="fade">
				<div v-if="showSearch" class="search-bar-container">
					<q-input v-model="searchQuery" autofocus placeholder="Search navigation..." class="search-bar"
						@blur="hideSearch" @keyup.enter="submitSearch" dense outlined clearable>
						<template #append>
							<q-btn flat round icon="close" @click="hideSearch" />
						</template>
					</q-input>
				</div>
			</transition>

			<!-- Logo -->
			<q-toolbar-title>
				<router-link to="/" class="brand-logo brand-trusted">
					StyleHub
					<span class="trusted-badge">
						<q-icon name="verified" size="18px" color="primary" />
						Trusted Brand
					</span>
				</router-link>
			</q-toolbar-title>

			<!-- Desktop Navigation -->
			<div class="desktop-menu row items-center q-gutter-md">
				<router-link v-for="(item, index) in filteredNavItems" :key="index" :to="item.to"
					class="nav-link shop-underline" active-class="active-link">
					{{ item.label }}
				</router-link>
			</div>

			<!-- Right Side Icons -->
			<div class="row items-center q-gutter-sm desktop-icons">
				<q-btn flat round dense icon="search" class="icon-btn search-anim" @click="showSearchBar" />
				<q-btn flat round dense icon="shopping_cart" class="icon-btn cart-anim"
					:class="{ 'spin-once': cartSpinning }" />

				<!-- Show UserProfile when logged in, auth buttons when logged out -->
				<UserProfile v-if="isLoggedIn" />
				<template v-else>
					<router-link to="/registeruser" class="signup-btn q-ml-md" active-class="active-auth-btn">
						Sign Up
					</router-link>
					<router-link to="/loginuser" class="login-btn q-ml-sm" active-class="active-auth-btn">
						Log In
					</router-link>
				</template>
			</div>

			<!-- Mobile Toggle Button -->
			<q-btn flat dense round :icon="drawer ? 'close' : 'menu'" class="mobile-menu-btn"
				@click="drawer = !drawer" />
		</q-toolbar>

		<!-- Mobile Drawer -->
		<q-drawer v-model="drawer" side="right" overlay class="drawer-root" :width="280">
			<q-scroll-area class="fit">
				<q-list class="q-pa-md">
					<q-item v-for="(item, index) in filteredNavItems" :key="index" clickable tag="router-link"
						:to="item.to" active-class="active-drawer-link" @click="drawer = false" class="drawer-link">
						<q-item-section>{{ item.label }}</q-item-section>
					</q-item>

					<q-separator class="q-my-md" />

					<q-item clickable class="drawer-link" @click="showSearchBar">
						<q-item-section avatar>
							<q-icon name="search" />
						</q-item-section>
						<q-item-section>Search</q-item-section>
					</q-item>

					<q-item clickable class="drawer-link" @click="drawer = false">
						<q-item-section avatar>
							<q-icon name="shopping_cart" />
						</q-item-section>
						<q-item-section>Cart</q-item-section>
						<q-badge color="red" class="q-ml-sm">3</q-badge>
					</q-item>

					<template v-if="isLoggedIn">
						<UserProfile />
					</template>
					<template v-else>
						<q-item clickable class="drawer-link" @click="drawer = false">
							<q-item-section avatar>
								<q-icon name="person" />
							</q-item-section>
							<q-item-section>Login</q-item-section>
						</q-item>
					</template>
				</q-list>
			</q-scroll-area>
		</q-drawer>
	</q-header>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useAuthStore } from '../stores/auth';
import UserProfile from './common/UserProfile.vue';

const authStore = useAuthStore();
const drawer = ref(false);
const showSearch = ref(false);
const searchQuery = ref("");
const cartSpinning = ref(false);

const isLoggedIn = computed(() => authStore.isAuthenticated);

const navItems = [
	{ label: "Home", to: "/" },
	{ label: "Shop", to: "/shop" },
	{ label: "Men", to: "/men" },
	{ label: "Women", to: "/women" },
	{ label: "Kids", to: "/kids" },
	{ label: "Contact", to: "/contact" },
	
];

// Filter nav items by search query (case-insensitive)
const filteredNavItems = computed(() => {
	if (!showSearch.value || !searchQuery.value.trim()) return navItems;
	return navItems.filter((item) =>
		item.label.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
	);
});

function showSearchBar() {
	showSearch.value = true;
	drawer.value = false;
	nextTick(() => {
		const input = document.querySelector(".search-bar input");
		if (input) input.focus();
	});
}

function hideSearch() {
	showSearch.value = false;
	searchQuery.value = "";
}

function submitSearch() {
	// You can handle your search logic here
	showSearch.value = false;
}
</script>

<style scoped>
.navbar-root {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	color: #23272b;
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
	font-family: "Inter", "Segoe UI", Arial, sans-serif;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 1000;
	backdrop-filter: blur(10px);
	padding-bottom: 12px;
	/* Add this line for bottom padding */
	margin-bottom: 24px;
	/* Add this line */
}

/* Brand logo styling */
.brand-logo {
	text-decoration: none;
	font-size: 1.7rem;
	font-weight: 800;
	color: #23272b;
	letter-spacing: -0.5px;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	padding: 4px 10px;
	border-radius: 10px;
	position: relative;
	overflow: hidden;
}

.brand-logo::before {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg,
			transparent,
			rgba(2, 123, 227, 0.1),
			transparent);
	transition: all 0.6s ease;
}

.brand-logo:hover {
	color: #027be3;
	text-shadow: 0 2px 12px rgba(2, 123, 227, 0.3);
	background: rgba(240, 248, 255, 0.7);
	transform: translateY(-1px);
}

.brand-logo:hover::before {
	left: 100%;
}

.brand-trusted {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	position: relative;
}

/* Trusted badge styling */
.trusted-badge {
	display: inline-flex;
	align-items: center;
	background: linear-gradient(90deg, #e3f2fd 0%, #fffde7 100%);
	color: #027be3;
	font-size: 0.95rem;
	font-weight: 600;
	border-radius: 8px;
	padding: 2px 10px 2px 6px;
	margin-left: 10px;
	box-shadow: 0 2px 8px rgba(2, 123, 227, 0.07);
	animation: badge-pop 0.7s cubic-bezier(0.4, 0, 0.2, 1);
	border: 1px solid #b3e5fc;
	transition: background 0.3s;
}

.trusted-badge q-icon {
	margin-right: 4px;
	animation: badge-bounce 1.2s infinite alternate;
}

@keyframes badge-pop {
	0% {
		transform: scale(0.7);
		opacity: 0;
	}

	60% {
		transform: scale(1.1);
		opacity: 1;
	}

	100% {
		transform: scale(1);
	}
}

@keyframes badge-bounce {
	0% {
		transform: translateY(0);
	}

	100% {
		transform: translateY(-2px);
	}
}

.brand-trusted:hover .trusted-badge {
	background: linear-gradient(90deg, #fffde7 0%, #e3f2fd 100%);
	color: #01579b;
	border-color: #81d4fa;
}

/* Desktop nav links */
.nav-link {
	text-decoration: none;
	color: #23272b;
	font-weight: 500;
	padding: 8px 20px;
	border-radius: 10px;
	font-size: 1.05rem;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	z-index: 1;
	overflow: hidden;
	display: inline-block;
}

.nav-link::before {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 3px;
	background: linear-gradient(90deg, #ffd600, #ffed85, #ffd600);
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	transform: translateX(-50%);
	border-radius: 3px;
	z-index: 2;
}

.nav-link::after {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg,
			rgba(2, 123, 227, 0.1) 0%,
			transparent 100%);
	opacity: 0;
	transition: all 0.3s ease;
	z-index: -1;
	border-radius: 10px;
}

.nav-link:hover,
.nav-link:focus {
	color: #027be3;
	background: transparent;
	transform: translateY(-3px);
	outline: none;
}

.nav-link:hover::before,
.nav-link:focus::before {
	width: 80%;
}

.nav-link:hover::after,
.nav-link:focus::after {
	opacity: 1;
}

.active-link {
	color: #027be3 !important;
	font-weight: 700;
	background: rgba(2, 123, 227, 0.1) !important;
	box-shadow: 0 4px 12px rgba(2, 123, 227, 0.15);
}

/* Icons styling */
.icon-btn {
	color: #23272b;
	background: transparent;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	z-index: 1;
	border-radius: 50%;
}

.icon-btn::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg,
			rgba(2, 123, 227, 0.1) 0%,
			transparent 100%);
	border-radius: 50%;
	opacity: 0;
	transition: all 0.3s ease;
	z-index: -1;
}

.icon-btn::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 2px;
	background: linear-gradient(90deg, #ffd600, #ffed85, #ffd600);
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	transform: translateX(-50%);
	border-radius: 2px;
	z-index: 2;
}

.icon-btn:hover,
.icon-btn:focus {
	color: #027be3;
	background: transparent;
	transform: translateY(-3px) scale(1.15);
	outline: none;
}

.icon-btn:hover::before,
.icon-btn:focus::before {
	opacity: 1;
}

.icon-btn:hover::after,
.icon-btn:focus::after {
	width: 60%;
}

.cart-badge {
	animation: pulse 2s infinite;
}

/* Mobile menu button */
.mobile-menu-btn {
	display: none;
	color: #23272b;
	background: transparent;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	border-radius: 50%;
}

.mobile-menu-btn:hover,
.mobile-menu-btn:focus {
	background: rgba(2, 123, 227, 0.1);
	color: #027be3;
	transform: rotate(90deg);
	outline: none;
}

/* Drawer styling */
.drawer-root {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
	color: #23272b !important;
	box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1) !important;
}

.drawer-link {
	font-size: 1.1rem;
	font-weight: 500;
	color: #23272b;
	border-radius: 10px;
	margin-bottom: 5px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-link::before {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg,
			transparent,
			rgba(2, 123, 227, 0.1),
			transparent);
	transition: all 0.5s ease;
}

.drawer-link:hover,
.drawer-link:focus {
	background: rgba(2, 123, 227, 0.1);
	color: #027be3;
	transform: translateX(5px);
	outline: none;
}

.drawer-link:hover::before,
.drawer-link:focus::before {
	left: 100%;
}

.active-drawer-link {
	color: #027be3 !important;
	font-weight: 700;
	background: rgba(2, 123, 227, 0.1) !important;
	box-shadow: 2px 0 10px rgba(2, 123, 227, 0.15);
}

/* Animations */
@keyframes pulse {
	0% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
	}

	70% {
		transform: scale(1.05);
		box-shadow: 0 0 0 6px rgba(255, 0, 0, 0);
	}

	100% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
	}
}

@keyframes spin-cart {
	0% {
		transform: rotate(0deg) scale(1.15);
	}

	60% {
		transform: rotate(80deg) scale(1.22);
	}

	100% {
		transform: rotate(90deg) scale(1.15);
	}
}

.spin-once {
	animation: spin-cart 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive rules */
@media (max-width: 1023px) {

	.desktop-menu,
	.desktop-icons {
		display: none !important;
	}

	.mobile-menu-btn {
		display: inline-flex !important;
	}

	.brand-logo {
		font-size: 1.4rem;
		padding: 3px 6px;
	}

	.q-toolbar {
		flex-wrap: wrap !important;
	}

	.q-toolbar-title {
		flex: 1 1 100%;
		min-width: 0;
	}
}

@media (max-width: 599px) {
	.navbar-root {
		font-size: 14px;
		padding: 0;
	}

	.brand-logo {
		font-size: 1.2rem;
		padding: 2px 4px;
	}

	.drawer-root {
		width: 240px !important;
	}
}

/* Shop link underline animation (no spin) */
.shop-underline {
	position: relative;
	overflow: hidden;
}

.shop-underline::after {
	content: "";
	position: absolute;
	left: 0;
	bottom: 0;
	width: 0;
	height: 3px;
	background: #ffd600;
	transition: width 0.2s;
	border-radius: 3px;
	transform: none;
}

.shop-underline:hover::after,
.shop-underline:focus::after {
	width: 100%;
	left: 0;
}

/* Cart icon spin animation */
.cart-anim.spin-once {
	animation: spin-cart 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Search icon animation */
.search-anim {
	transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
}

.search-anim:hover,
.search-anim:focus {
	transform: scale(1.18) rotate(-8deg);
	box-shadow: 0 2px 8px rgba(2, 123, 227, 0.13);
	background: rgba(2, 123, 227, 0.08);
	color: #027be3;
}

/* Search bar styles */
.search-bar-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	z-index: 2000;
	background: rgba(255, 255, 255, 0.98);
	padding: 16px 0 8px 0;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
	display: flex;
	justify-content: center;
	align-items: center;
}

.search-bar {
	width: 400px;
	max-width: 90vw;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Auth Buttons */
.signup-btn,
.login-btn {
	display: inline-block;
	padding: 0.45rem 1.2rem;
	/* Smaller padding */
	font-size: 1rem;
	/* Smaller font */
	font-weight: 500;
	border-radius: 8px;
	transition: background 0.2s, color 0.2s;
	text-decoration: none;
	margin-left: 0.5rem;
}

.signup-btn {
	background: #43e97b;
	color: #222;
}

.signup-btn:hover,
.signup-btn.active-auth-btn {
	background: #38c172;
	color: #fff;
}

.login-btn {
	background: #23272b;
	color: #fff;
}

.login-btn:hover,
.login-btn.active-auth-btn {
	background: #343a40;
	color: #fff;
}

.hero-section {
	margin-top: 32px;
	/* ...existing code... */
}
</style>
