<template>
	<q-layout view="hHh lpR fFf">
		<!-- Only show Navbar for non-admin and non-auth routes -->
		<Navbar v-if="!isAdminRoute && !isAuthRoute" />

		<q-page-container>
			<router-view :class="{ 'body--dark': $q.dark.isActive }" />
		</q-page-container>

		<!-- Only show Footer for non-admin and non-auth routes -->
		<Footer v-if="!isAdminRoute && !isAuthRoute" />
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
