<template>
	<q-drawer
		show-if-above
		v-model="drawer"
		side="left"
		bordered
		class="bg-primary text-white"
		:width="220"
		:breakpoint="600">
		<div class="q-pa-md flex flex-col h-full">
			<div class="flex items-center mb-8">
				<q-icon name="storefront" size="32px" class="mr-2" />
				<span class="text-xl font-bold">Seller Panel</span>
			</div>

			<q-list>
				<q-item clickable to="/seller/dashboard" active-class="bg-blue-8">
					<q-item-section avatar><q-icon name="dashboard" /></q-item-section>
					<q-item-section>Dashboard</q-item-section>
				</q-item>

				<q-item clickable to="/seller/products" active-class="bg-blue-8">
					<q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
					<q-item-section>Products</q-item-section>
				</q-item>

				<q-item clickable to="/seller/orders" active-class="bg-blue-8">
					<q-item-section avatar><q-icon name="assignment" /></q-item-section>
					<q-item-section>Orders</q-item-section>
				</q-item>

				<q-item clickable to="/seller/inventory" active-class="bg-blue-8">
					<q-item-section avatar><q-icon name="warehouse" /></q-item-section>
					<q-item-section>Inventory</q-item-section>
				</q-item>
        
				<q-item clickable to="/seller/settings" active-class="bg-blue-8">
					<q-item-section avatar><q-icon name="settings" /></q-item-section>
					<q-item-section>Seller Status</q-item-section>
				</q-item>
        <q-item clickable to="/seller/profile" active-class="bg-blue-8">
					<q-item-section avatar><q-icon name="person" /></q-item-section>
					<q-item-section>Profile</q-item-section>
				</q-item>
			</q-list>

			<div class="mt-auto">
				<q-separator />
				<div class="flex items-center q-mt-md q-mb-sm">
					<q-avatar icon="person" color="white" text-color="primary" />
					<div class="q-ml-sm">
						<div class="text-bold">{{ userName }}</div>
						<div class="text-caption">{{ userRole }}</div>
					</div>
				</div>
				<q-btn
					label="Back to Home"
					color="negative"
					icon="logout"
					class="full-width"
					unelevated
					@click="logout" />
			</div>
		</div>
	</q-drawer>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { useUserStore } from "@/stores/user"; // Pinia user store

	const drawer = ref(true);
	const userStore = useUserStore();
	const userName = ref("User");
	const userRole = ref("Seller");
	const router = useRouter();

	onMounted(() => {
		// Get user info from localStorage or Pinia store
		const name = localStorage.getItem("userName") || userStore.name;
		const role = localStorage.getItem("userRole") || userStore.role;
		if (name) userName.value = name;
		if (role) userRole.value = role;
	});

	function logout() {
		// Clear user info from localStorage
		localStorage.removeItem("userName");
		localStorage.removeItem("userRole");
		// Reset Pinia user store
		userStore.$reset();
		// Redirect to home
		router.push("/");
	}
</script>

<style scoped>
	.q-drawer {
		min-width: 220px;
		max-width: 100vw;
		overflow-x: auto;
	}
</style>
