<template>
	<q-header elevated class="navbar-root">
		<q-toolbar class="q-px-md">
			<!-- Search Bar (shows when search icon clicked) -->
			<transition name="fade">
				<div v-if="showSearch" class="search-bar-container">
					<q-input
						v-model="searchQuery"
						autofocus
						placeholder="Search navigation..."
						class="search-bar"
						@blur="hideSearch"
						@keyup.enter="submitSearch"
						dense
						outlined
						clearable>
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
				<router-link
					v-for="(item, index) in filteredNavItems"
					:key="index"
					:to="item.to"
					class="nav-link shop-underline"
					active-class="active-link">
					{{ item.label }}
				</router-link>
			</div>

			<!-- Right Side Icons -->
			<div class="row items-center q-gutter-sm desktop-icons">
				<q-btn
					flat
					round
					dense
					icon="search"
					class="icon-btn search-anim"
					@click="showSearchBar" />
				<q-btn
					flat
					round
					dense
					icon="shopping_cart"
					class="icon-btn cart-anim relative"
					:class="{ 'spin-once': cartSpinning }"
					@click="showCartModal = true">
					<q-badge
						v-if="cartStore.totalItems > 0"
						color="red"
						floating
						class="cart-badge">
						{{ cartStore.totalItems }}
					</q-badge>
				</q-btn>

				<!-- Show customer dropdown when logged in, auth buttons when logged out -->
				<CustomerDropdown v-if="isLoggedIn" />
				<template v-else>
					<router-link
						to="/registeruser"
						class="signup-btn q-ml-md"
						active-class="active-auth-btn">
						Sign Up
					</router-link>
					<router-link
						to="/loginuser"
						class="login-btn q-ml-sm"
						active-class="active-auth-btn">
						Log In
					</router-link>
				</template>
			</div>

			<!-- Mobile Toggle Button (main branch version) -->
			<q-btn flat dense round :icon="drawer ? 'close' : 'menu'" class="mobile-menu-btn"
				@click="toggleDrawer" ref="menuButton" />
		</q-toolbar>

		<!-- Mobile Dropdown Menu (main branch version) -->
		<q-menu v-model="drawer" :target="$refs.menuButton?.$el" anchor="bottom right" self="top right" class="mobile-dropdown-menu">
			<q-list class="q-pa-sm" style="min-width: 250px">
				<!-- Navigation Items -->
				<q-item v-for="(item, index) in navItems" :key="index" clickable tag="router-link"
					:to="item.to" active-class="active-dropdown-link" @click="drawer = false" class="dropdown-link">
					<q-item-section avatar>
						<q-icon :name="getNavIcon(item.label)" />
					</q-item-section>
					<q-item-section>
						<div class="nav-item-content">
							<div class="nav-label">{{ item.label }}</div>
							<div class="nav-subtitle" v-if="getNavSubtitle(item.label)">{{ getNavSubtitle(item.label) }}</div>
						</div>
					</q-item-section>
				</q-item>

				<q-separator class="q-my-md" />

				<!-- Quick Actions -->
				<q-item clickable class="dropdown-link action-item" @click="showSearchBar">
					<q-item-section avatar>
						<q-icon name="search" color="blue-6" />
					</q-item-section>
					<q-item-section>
						<div class="nav-item-content">
							<div class="nav-label">Search</div>
							<div class="nav-subtitle">Find products quickly</div>
						</div>
					</q-item-section>
				</q-item>

				<q-item clickable class="dropdown-link action-item" @click="showCartModal = true; drawer = false">
					<q-item-section avatar>
						<q-icon name="shopping_cart" color="orange-6" />
					</q-item-section>
					<q-item-section>
						<div class="nav-item-content">
							<div class="nav-label">Cart</div>
							<div class="nav-subtitle">{{ cartStore.totalItems }} item(s)</div>
						</div>
					</q-item-section>
					<q-badge v-if="cartStore.totalItems > 0" color="red" floating class="cart-badge-mobile">
						{{ cartStore.totalItems }}
					</q-badge>
				</q-item>

				<q-separator class="q-my-md" />

				<!-- Authentication Section -->
				<template v-if="isLoggedIn">
					<q-item class="user-profile-section">
						<UserProfile />
					</q-item>
				</template>
				<template v-else>
					<div class="auth-section q-px-md q-pb-md">
						<q-btn 
							to="/loginuser" 
							unelevated 
							color="primary" 
							class="full-width q-mb-sm auth-btn"
							@click="drawer = false"
						>
							<q-icon name="login" class="q-mr-sm" />
							Log In
						</q-btn>
						<q-btn 
							to="/registeruser" 
							outline 
							color="primary" 
							class="full-width auth-btn"
							@click="drawer = false"
						>
							<q-icon name="person_add" class="q-mr-sm" />
							Sign Up
						</q-btn>
					</div>
				</template>
			</q-list>
		</q-menu>

		<!-- Cart Modal -->
		<CartModal v-model="showCartModal" />
		
	</q-header>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "../stores/auth";
import { useCartStore } from "../stores/cart";
import CartModal from "./CartModal.vue";
import CustomerDropdown from "@/components/CustomerDropdown.vue";
import UserProfile from "./common/UserProfile.vue";

const $q = useQuasar();
const cartStore = useCartStore();
const authStore = useAuthStore();

const drawer = ref(false);
const showSearch = ref(false);
const searchQuery = ref("");
const cartSpinning = ref(false);
const showCartModal = ref(false);

const isLoggedIn = computed(() => authStore.isAuthenticated);

const navItems = [
	{ label: "Home", to: "/" },
	{ label: "Shop", to: "/shop" },
	{ label: "Men", to: "/men" },
	{ label: "Women", to: "/women" },
	{ label: "Kids", to: "/kids" },
	{ label: "Contact", to: "/contact" },
];

const filteredNavItems = computed(() => {
	if (isLoggedIn.value) {
		return navItems;
	} else {
		return navItems.filter((item) => item.label !== "Contact");
	}
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
	showSearch.value = false;
}

function goToCart() {
	$q.notify({ message: "Go to cart page (not implemented)" });
}

function toggleDrawer() {
	drawer.value = !drawer.value;
}

// Helper functions for mobile dropdown menu
function getNavIcon(label) {
	const iconMap = {
		"Home": "home",
		"Shop": "store",
		"Men": "man",
		"Women": "woman",
		"Kids": "child_care",
		"Contact": "contact_mail"
	};
	return iconMap[label] || "label";
}

function getNavSubtitle(label) {
	const subtitleMap = {
		"Shop": "Browse all products",
		"Men": "Men's fashion",
		"Women": "Women's collection",
		"Kids": "Children's clothing",
		"Contact": "Get in touch with us"
	};
	return subtitleMap[label] || "";
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
        margin-bottom: 24px;
    }

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

    .brand-trusted {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        position: relative;
    }

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

    .icon-btn {
        color: #23272b;
        background: transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1;
        border-radius: 50%;
    }

    .cart-badge {
        animation: pulse 2s infinite;
    }

    .mobile-menu-btn {
        display: none;
        color: #23272b;
        background: transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 50%;
    }

    .drawer-root {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
        color: #23272b !important;
        box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1) !important;
    }

    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(255, 0, 0, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
    }

    @media (max-width: 1023px) {
        .desktop-menu,
        .desktop-icons {
            display: none !important;
        }
        .mobile-menu-btn {
            display: inline-flex !important;
        }
        .brand-logo { font-size: 1.4rem; padding: 3px 6px; }
        .q-toolbar { flex-wrap: wrap !important; }
        .q-toolbar-title { flex: 1 1 100%; min-width: 0; }
    }

    /* Search bar */
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
    .search-bar { width: 400px; max-width: 90vw; }

    /* Auth Buttons */
    .signup-btn, .login-btn {
        display: inline-block;
        padding: 0.45rem 1.2rem;
        font-size: 1rem;
        font-weight: 500;
        border-radius: 8px;
        transition: background 0.2s, color 0.2s;
        text-decoration: none;
        margin-left: 0.5rem;
    }

    .signup-btn { background: #43e97b; color: #222; }
    .signup-btn:hover, .signup-btn.active-auth-btn { background: #38c172; color: #fff; }
    .login-btn { background: #23272b; color: #fff; }
    .login-btn:hover, .login-btn.active-auth-btn { background: #343a40; color: #fff; }

    /* Drawer link styles */
    .drawer-link { font-size: 1.1rem; font-weight: 500; color: #23272b; border-radius: 10px; margin-bottom: 5px; }
    .active-drawer-link { color: #027be3 !important; font-weight: 700; background: rgba(2, 123, 227, 0.1) !important; box-shadow: 2px 0 10px rgba(2, 123, 227, 0.15); }

    .fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>