<template>
	<q-btn-dropdown flat dense round class="profile-dropdown">
		<template #label>
			<div class="profile-icon-container">
				<q-avatar
					size="40px"
					class="profile-avatar"
					:style="{ background: getGradientColor }">
					<q-icon
						name="person"
						size="24px"
						color="white"
						v-if="!user?.avatar" />
					<img v-else :src="user.avatar" alt="Profile" class="profile-image" />
				</q-avatar>
			</div>
		</template>

		<q-list>
			<q-separator />

			<!-- Back to Seller Dashboard Button -->
			<q-item clickable v-close-popup @click="goToDashboard">
				<q-item-section>
					<q-item-label>Back to Seller Dashboard</q-item-label>
				</q-item-section>
				<q-item-section side="right" avatar>
					<q-icon name="arrow_forward" color="primary" />
				</q-item-section>
			</q-item>

			<q-separator />

			<q-item clickable v-close-popup @click="logout">
				<q-item-section avatar>
					<q-icon name="logout" color="negative" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Logout</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-btn-dropdown>
</template>

<script setup>
	import { computed } from "vue";
	import { useAuthStore } from "../../stores/auth";
	import { useRouter } from "vue-router";

	const authStore = useAuthStore();
	const router = useRouter();
	const user = computed(() => authStore.currentUser);

	const getGradientColor = computed(() => {
		// Generate a gradient based on user email or name
		const colors = [
			"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
			"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
			"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
			"linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
			"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
			"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
			"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
		];

		if (user.value?.email) {
			const hash = user.value.email.split("").reduce((a, b) => {
				a = (a << 5) - a + b.charCodeAt(0);
				return a & a;
			}, 0);
			return colors[Math.abs(hash) % colors.length];
		}

		return colors[0];
	});

	const logout = () => {
		authStore.logout();
		router.push("/");
	};

	// Add this function for dashboard navigation
	function goToDashboard() {
		router.push("/seller/dashboard");
	}
</script>

<style scoped>
	.profile-dropdown {
		min-width: 40px;
	}

	.profile-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-avatar {
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.profile-avatar:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	.profile-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.user-name {
		font-weight: 600;
		color: #23272b;
	}

	.user-email {
		color: #666;
	}

	.q-btn-dropdown :deep(.q-btn__content) {
		padding: 0;
	}
</style>
