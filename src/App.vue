<template>
	<q-layout view="hHh lpR fFf">
		<!-- Navbar sirf tab dikhaye jab route seller panel ka na ho, aur na hi login/signup ho -->
		<Navbar v-if="!isSellerRoute && !isAuthRoute" />
		<q-page-container>
			<router-view :class="{ 'body--dark': $q.dark.isActive }" />
		</q-page-container>
		<Footer v-if="!isSellerRoute && !isAuthRoute" />
	</q-layout>
</template>

<script setup>
	import { computed } from "vue";
	import { useRoute } from "vue-router";
	import { useQuasar } from "quasar";
	import Navbar from "./components/Navbar.vue";
	import Footer from "./components/Footer.vue";

	const $q = useQuasar();
	const route = useRoute();

	// Check if current route is an admin route
	const isAdminRoute = computed(() => {
		return route.path.startsWith("/admin");
	});

	// Check if current route is an auth route (register or login)
	const isAuthRoute = computed(() => {
		return ["/registeruser", "/loginuser"].includes(route.path);
	});

	// Hide footer on seller routes
	const hideFooter = computed(() => route.path.startsWith("/seller"));

	// Seller route check
	const isSellerRoute = computed(() => route.path.startsWith("/seller"));
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.q-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.q-page-container {
		flex: 1;
	}
</style>
