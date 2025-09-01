<template>
	<q-btn-dropdown
		ref="profileDropdown"
		flat
		dense
		round
		class="profile-dropdown"
		dropdown-icon=""
		@show="onDropdownShow"
		content-class="profile-dropdown-content">
		<template #label>
			<div class="profile-icon-container">
				<div class="relative">
					<q-avatar
						size="44px"
						class="profile-avatar cursor-pointer transition-all duration-300 hover:scale-110"
						:style="!user?.avatar ? { background: getGradientColor } : {}">
						<span
							v-if="!user?.avatar"
							class="text-white font-bold text-lg select-none">
							{{ getUserInitials }}
						</span>
						<img
							v-else
							:src="user.avatar"
							alt="Profile"
							class="w-full h-full object-cover" />
					</q-avatar>

					<!-- Online status indicator -->
					<div
						class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
				</div>
			</div>
		</template>

		<q-list class="dropdown-list min-w-[280px] max-w-[320px]">
			<!-- Header with gradient background -->
			<div
				class="dropdown-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
				<!-- Close button -->
				<q-btn
					flat
					dense
					tround
					icon="close"
					class="close-btn"
					aria-label="Close menu"
					@click="closeDropdown" />
				<div class="flex items-center space-x-3">
					<q-avatar
						size="50px"
						:style="!user?.avatar ? { background: getGradientColor } : {}"
						class="shadow-lg">
						<span
							v-if="!user?.avatar"
							class="text-white font-bold text-xl select-none">
							{{ getUserInitials }}
						</span>
						<img
							v-else
							:src="user.avatar"
							alt="Profile"
							class="w-full h-full object-cover" />
					</q-avatar>

					<div class="flex-1 min-w-0">
						<h3
							class="text-white font-semibold text-lg truncate"
							v-if="profile">
							{{ profile.name || profile.full_name || user?.name || "User" }}
						</h3>
						<p class="text-blue-100 text-sm truncate" v-if="profile">
							{{ profile.email || user?.email }}
						</p>
						<span
							class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white mt-1"
							v-if="profile?.role || user?.role">
							{{
								(profile?.role || user?.role)?.charAt(0).toUpperCase() +
								(profile?.role || user?.role)?.slice(1)
							}}
						</span>
					</div>
				</div>
			</div>

			<!-- Loading state -->
			<q-item v-if="loading" class="py-6">
				<q-item-section class="text-center">
					<q-spinner-dots color="primary" size="2em" />
					<q-item-label class="text-gray-600 mt-2"
						>Loading profile...</q-item-label
					>
				</q-item-section>
			</q-item>

			<!-- Error state -->
			<q-item v-else-if="error" class="py-4">
				<q-item-section class="text-center">
					<q-icon name="error_outline" color="negative" size="2em" />
					<q-item-label caption class="text-red-500 mt-2">{{
						error
					}}</q-item-label>
				</q-item-section>
			</q-item>

			<!-- Menu Items -->
			<template v-else-if="profile">
				<div class="py-2">
					<!-- View Profile -->
					<q-item
						clickable
						v-close-popup
						@click="goToProfilePage"
						class="menu-item hover:bg-gray-50 transition-colors duration-200 mx-2 rounded-lg">
						<q-item-section avatar>
							<div class="icon-wrapper bg-blue-100 text-blue-600">
								<q-icon name="person" size="20px" />
							</div>
						</q-item-section>
						<q-item-section>
							<q-item-label class="font-medium text-gray-800"
								>View Profile</q-item-label
							>
							<q-item-label caption class="text-gray-500"
								>Manage your account details</q-item-label
							>
						</q-item-section>
						<q-item-section side>
							<q-icon name="chevron_right" color="gray-400" size="18px" />
						</q-item-section>
					</q-item>

					<!-- View All Orders (open orders page) - visible for customers/buyers only -->
					<q-item
						v-if="
							(profile?.role || user?.role) === 'customer' ||
							(profile?.role || user?.role) === 'buyer'
						"
						clickable
						v-close-popup
						@click="goToOrders"
						class="menu-item hover:bg-gray-50 transition-colors duration-200 mx-2 rounded-lg">
						<q-item-section avatar>
							<div class="icon-wrapper bg-teal-100 text-teal-600">
								<q-icon name="receipt_long" size="20px" />
							</div>
						</q-item-section>
						<q-item-section>
							<q-item-label class="font-medium text-gray-800"
								>View All Orders</q-item-label
							>
							<q-item-label caption class="text-gray-500"
								>See all your past orders</q-item-label
							>
						</q-item-section>
						<q-item-section side>
							<q-icon name="chevron_right" color="gray-400" size="18px" />
						</q-item-section>
					</q-item>

					<!-- Edit Profile -->
					<q-item
						clickable
						v-close-popup
						@click="editProfile"
						class="menu-item hover:bg-gray-50 transition-colors duration-200 mx-2 rounded-lg">
						<q-item-section avatar>
							<div class="icon-wrapper bg-green-100 text-green-600">
								<q-icon name="edit" size="20px" />
							</div>
						</q-item-section>
						<q-item-section>
							<q-item-label class="font-medium text-gray-800"
								>Edit Profile</q-item-label
							>
							<q-item-label caption class="text-gray-500"
								>Update your information</q-item-label
							>
						</q-item-section>
						<q-item-section side>
							<q-icon name="chevron_right" color="gray-400" size="18px" />
						</q-item-section>
					</q-item>

					<!-- Settings (admin only) -->
					<q-item
						v-if="(profile?.role || user?.role) === 'admin'"
						clickable
						v-close-popup
						class="menu-item hover:bg-gray-50 transition-colors duration-200 mx-2 rounded-lg">
						<q-item-section avatar>
							<div class="icon-wrapper bg-purple-100 text-purple-600">
								<q-icon name="settings" size="20px" />
							</div>
						</q-item-section>
						<q-item-section>
							<q-item-label class="font-medium text-gray-800"
								>Settings</q-item-label
							>
							<q-item-label caption class="text-gray-500"
								>Preferences and privacy</q-item-label
							>
						</q-item-section>
						<q-item-section side>
							<q-icon name="chevron_right" color="gray-400" size="18px" />
						</q-item-section>
					</q-item>

					<!-- Dashboard Navigation -->
					<q-item
						clickable
						v-close-popup
						@click="goToDashboard"
						v-if="
							(profile?.role || user?.role) === 'seller' ||
							(profile?.role || user?.role) === 'admin'
						"
						class="menu-item hover:bg-gray-50 transition-colors duration-200 mx-2 rounded-lg">
						<q-item-section avatar>
							<div class="icon-wrapper bg-indigo-100 text-indigo-600">
								<q-icon name="dashboard" size="20px" />
							</div>
						</q-item-section>
						<q-item-section>
							<q-item-label class="font-medium text-gray-800">
								{{
									(profile?.role || user?.role) === "admin"
										? "Admin Dashboard"
										: "Seller Dashboard"
								}}
							</q-item-label>
							<q-item-label caption class="text-gray-500">
								{{
									(profile?.role || user?.role) === "admin"
										? "Manage system settings"
										: "Manage your products"
								}}
							</q-item-label>
						</q-item-section>
						<q-item-section side>
							<q-icon name="chevron_right" color="gray-400" size="18px" />
						</q-item-section>
					</q-item>
				</div>

				<!-- Divider -->
				<q-separator class="my-2" />

				<!-- Logout -->
				<div class="pb-2">
					<q-item
						clickable
						v-close-popup
						@click="logout"
						class="menu-item hover:bg-red-50 transition-colors duration-200 mx-2 rounded-lg">
						<q-item-section avatar>
							<div class="icon-wrapper bg-red-100 text-red-600">
								<q-icon name="logout" size="20px" />
							</div>
						</q-item-section>
						<q-item-section>
							<q-item-label class="font-medium text-red-700"
								>Logout</q-item-label
							>
							<q-item-label caption class="text-red-500"
								>Sign out of your account</q-item-label
							>
						</q-item-section>
					</q-item>
				</div>
			</template>
		</q-list>
	</q-btn-dropdown>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useAuthStore } from "../../stores/auth";
	import { useRouter } from "vue-router";
	import axios from "@/api/axios";

	const authStore = useAuthStore();
	const router = useRouter();
	const user = computed(() => authStore.currentUser || authStore.user);

	const loading = ref(false);
	const error = ref(null);
	const profile = ref(null);
	const profileSource = ref(null); // 'customer' | 'seller' | null
	const profileDropdown = ref(null);



	const getUserInitials = computed(() => {
		const name =
			profile.value?.name ||
			profile.value?.full_name ||
			user.value?.name ||
			user.value?.email ||
			"User";

		// Split the name into words and get first letter of each word
		const words = name.split(" ").filter((word) => word.length > 0);

		if (words.length >= 2) {
			// If we have multiple words, take first letter of first two words
			return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
		} else if (words.length === 1) {
			// If only one word, take first two letters
			const word = words[0];
			return word.length >= 2
				? (word.charAt(0) + word.charAt(1)).toUpperCase()
				: word.charAt(0).toUpperCase();
		}

		return "U"; // Default fallback
	});

	const getGradientColor = computed(() => {
		// Enhanced gradient colors with modern design
		const colors = [
			"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
			"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
			"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
			"linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
			"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
			"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
			"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
			"linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
			"linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
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

	async function tryEndpointsSequential(list) {
		for (const ep of list) {
			try {
				const res = await axios.get(ep);
				const payload = res?.data?.data ?? res?.data ?? res;
				return { payload, endpoint: ep };
			} catch (err) {
				// Continue trying other endpoints
				const status = err?.response?.status;
			}
		}
		throw new Error("All endpoints failed");
	}

	async function fetchProfile() {
		loading.value = true;
		error.value = null;
		profile.value = null;
		profileSource.value = null;

		const stored = authStore.currentUser || authStore.user || null;
		const role = stored?.role?.toString()?.toLowerCase?.() || null;

		const customerEndpoints = ["/customer/profile", "/customer/me"];
		const sellerEndpoints = ["/seller/profile", "/seller/me", "/seller"];

		// Prefer endpoints based on known role, then try the other group as fallback
		const tryList =
			role === "seller"
				? [...sellerEndpoints, ...customerEndpoints]
				: [...customerEndpoints, ...sellerEndpoints];

		try {
			const { payload, endpoint } = await tryEndpointsSequential(tryList);
			profile.value = payload;
			profileSource.value = endpoint.startsWith("/seller")
				? "seller"
				: "customer";
		} catch (err) {
			error.value =
				err?.response?.data?.message ||
				err?.message ||
				"Failed to load profile";
			console.error("fetch profile error", err);
		} finally {
			loading.value = false;
		}
	}

	function onDropdownShow() {
		fetchProfile();
	}

	function closeDropdown() {
		// q-btn-dropdown exposes hide() method via ref
		if (profileDropdown.value && profileDropdown.value.hide) {
			profileDropdown.value.hide();
		}
	}

	const logout = () => {
		authStore.logout();
		router.push("/");
	};

	function goToProfilePage() {
		const dest =
			profileSource.value === "seller"
				? "/seller/profile"
				: "/customer/profile";
		router.push(dest).catch(() => {});
	}

	function editProfile() {
		const dest =
			profileSource.value === "seller"
				? "/seller/profile?edit=1"
				: "/customer/profile?edit=1";
		router.push(dest).catch(() => {});
	}

	function goToOrders() {
		router.push("/customer/orders");
	}

	function goToDashboard() {
		const role = profile.value?.role || user.value?.role;
		switch (role) {
			case "admin":
				router.push("/admin/dashboard");
				break;
			case "seller":
				router.push("/seller/dashboard");
				break;
			case "buyer":
				router.push("/");
				break;
			default:
				router.push("/");
		}
	}
</script>

<style scoped>
	/* Main dropdown styling */
	.profile-dropdown {
		min-width: 44px;
		position: relative;
	}

	.profile-dropdown :deep(.q-btn) {
		border-radius: 50%;
		padding: 2px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.profile-dropdown :deep(.q-btn:hover) {
		background-color: rgba(59, 130, 246, 0.1);
		transform: scale(1.05);
	}

	.profile-dropdown :deep(.q-btn__content) {
		padding: 0;
		min-height: 0;
	}

	/* Profile icon container */
	.profile-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	/* Profile avatar styling */
	.profile-avatar {
		border: 3px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
	}

	.profile-avatar:hover {
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
	}

	/* Fix avatar image display */
	.profile-avatar img {
		border-radius: 50%;
		transition: all 0.3s ease;
		display: block;
	}

	.profile-avatar :deep(.q-avatar__content) {
		border-radius: 50%;
		overflow: hidden;
	}

	/* Dropdown content styling */
	.profile-dropdown :deep(.profile-dropdown-content) {
		border-radius: 16px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(229, 231, 235, 0.8);
		backdrop-filter: blur(10px);
		background: rgba(255, 255, 255, 0.95);
		margin-top: 8px;
		overflow: hidden;
		animation: dropdownFadeIn 0.2s ease-out;
	}

	@keyframes dropdownFadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* List styling */
	.dropdown-list {
		padding: 0;
		border-radius: 16px;
		overflow: hidden;
	}

	/* Header styling */
	.dropdown-header {
		background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
		position: relative;
		overflow: hidden;
	}

	/* Close button inside header */
	.close-btn {
		position: absolute;
		top: 8px;
		right: 8px;
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 8px;
		min-width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s ease;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.12);
	}

	.dropdown-header::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			45deg,
			transparent 30%,
			rgba(255, 255, 255, 0.1) 50%,
			transparent 70%
		);
		transform: translateX(-100%);
		animation: shimmer 3s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* Menu item styling */
	.menu-item {
		padding: 12px 16px;
		margin: 4px 8px;
		border-radius: 12px;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.menu-item:hover {
		background: linear-gradient(
			135deg,
			rgba(59, 130, 246, 0.08) 0%,
			rgba(147, 51, 234, 0.08) 100%
		);
		transform: translateX(4px);
	}

	.menu-item:active {
		transform: translateX(2px) scale(0.98);
	}

	/* Icon wrapper styling */
	.icon-wrapper {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.menu-item:hover .icon-wrapper {
		transform: scale(1.1);
	}

	/* Item labels */
	.menu-item .q-item__label {
		transition: color 0.2s ease;
	}

	.menu-item:hover .q-item__label {
		color: #1f2937;
	}

	/* Logout item special styling */
	.menu-item:hover .text-red-700 {
		color: #dc2626 !important;
	}

	.menu-item:hover .text-red-500 {
		color: #ef4444 !important;
	}

	/* Separator styling */
	.q-separator {
		background: linear-gradient(
			90deg,
			transparent,
			rgba(229, 231, 235, 0.8),
			transparent
		);
		height: 1px;
		margin: 8px 16px;
	}

	/* Responsive design */
	@media (max-width: 480px) {
		.profile-dropdown :deep(.profile-dropdown-content) {
			min-width: 260px;
			max-width: calc(100vw - 32px);
		}

		.dropdown-header {
			padding: 16px;
		}

		.menu-item {
			padding: 10px 12px;
		}
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.profile-dropdown :deep(.profile-dropdown-content) {
			background: rgba(31, 41, 55, 0.95);
			border-color: rgba(75, 85, 99, 0.8);
		}

		.menu-item:hover {
			background: linear-gradient(
				135deg,
				rgba(59, 130, 246, 0.15) 0%,
				rgba(147, 51, 234, 0.15) 100%
			);
		}

		.dropdown-list .q-item__label {
			color: #f9fafb;
		}

		.dropdown-list .q-item__label--caption {
			color: #d1d5db;
		}
	}

	/* Loading animation */
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.loading-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	/* Micro-interactions */
	.profile-dropdown :deep(.q-btn) {
		position: relative;
		overflow: hidden;
	}

	.profile-dropdown :deep(.q-btn)::before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(59, 130, 246, 0.2);
		transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
		transform: translate(-50%, -50%);
		z-index: 0;
	}

	.profile-dropdown :deep(.q-btn:active)::before {
		width: 200px;
		height: 200px;
		top: 50%;
		left: 50%;
	}

	/* Enhanced focus states for accessibility */
	.profile-dropdown :deep(.q-btn:focus-visible) {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	.menu-item:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: -2px;
		border-radius: 12px;
	}

	/* Status indicator animations */
	@keyframes statusPulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.status-indicator {
		animation: statusPulse 2s infinite;
	}
</style>
