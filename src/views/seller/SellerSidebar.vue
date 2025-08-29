<template>
	<div class="seller-sidebar-wrap">
		<!-- decorative background behind sidebar -->
		<div
			class="sidebar-bg"
			aria-hidden="true"
			v-show="!isMobile || drawer"></div>

		<!-- mobile open button -->
		<q-btn
			v-if="isMobile"
			class="mobile-open-btn"
			dense
			fab
			icon="menu"
			aria-label="Open menu"
			@click="drawer = true" />

		<q-drawer
			v-model="drawer"
			side="left"
			:width="drawerWidth"
			bordered
			class="seller-drawer"
			:behavior="isMobile ? 'mobile' : 'desktop'"
			:overlay="isMobile"
			:swipe-close="false"
			:swipe-to-open="false"
			@update:model-value="onDrawerModelUpdate">
			<div class="inner q-pa-sm flex flex-col h-full" :style="{ zIndex: 2 }">
				<!-- Brand -->
				<div class="brand row items-center q-px-sm q-py-xs">
					<div class="brand-left row items-center gap-3">
						<q-avatar
							:size="collapsed ? 44 : 48"
							class="brand-avatar"
							:style="avatarStyle">
							<q-icon name="storefront" />
						</q-avatar>

						<div v-if="!collapsed" class="brand-text">
							<div class="brand-title">Seller Panel</div>
							<div class="brand-sub">Manage your store</div>
						</div>
					</div>

					<div class="ml-auto actions">
						<q-btn
							dense
							flat
							round
							:icon="collapsed ? 'chevron_right' : 'chevron_left'"
							class="toggle-btn"
							@click="toggle"
							:aria-label="collapsed ? 'Expand' : 'Collapse'" />
					</div>
				</div>

				<q-separator spaced />

				<!-- Menu -->
				<q-list padding class="menu-list" :style="{ zIndex: 2 }">
					<q-item
						v-for="item in menu"
						:key="item.to"
						clickable
						:active="isActive(item)"
						@click="go(item)"
						class="menu-item"
						:dense="collapsed">
						<q-item-section avatar>
							<q-icon :name="item.icon" class="menu-icon" />
						</q-item-section>

						<q-item-section v-if="!collapsed">
							<q-item-label class="menu-label">{{ item.label }}</q-item-label>
							<q-item-label caption v-if="item.caption">{{
								item.caption
							}}</q-item-label>
						</q-item-section>

						<q-badge
							v-if="item.badge && !collapsed"
							:color="item.badgeColor || 'primary'"
							class="menu-badge">
							{{ item.badge }}
						</q-badge>

						<q-tooltip v-if="collapsed">{{ item.label }}</q-tooltip>
					</q-item>
				</q-list>

				<!-- Footer / user -->
				<div class="mt-auto q-pa-sm footer" :style="{ zIndex: 2 }">
					<q-separator spaced />

					<div class="user-row row items-center q-mt-sm">
						<q-avatar size="44" class="user-avatar" :style="avatarStyle">{{
							initials
						}}</q-avatar>

						<div v-if="!collapsed" class="user-meta q-ml-sm">
							<div class="user-name">{{ userName }}</div>
							<div class="user-role text-caption">{{ userRole }}</div>
						</div>

						<!-- Improved logout: visible in both collapsed and expanded -->
						<div class="ml-auto logout-wrap">
							<q-btn
								dense
								:unelevated="!collapsed"
								color="negative"
								icon="logout"
								@click="logout"
								:label="!collapsed ? 'Logout' : ''"
								class="logout-btn"
								round />
							<q-tooltip v-if="collapsed">Logout</q-tooltip>
						</div>
					</div>

					<div v-if="!collapsed" class="q-mt-sm">
						<q-btn
							unelevated
							color="primary"
							class="w-full"
							icon="home"
							label="Back to Home"
							@click="toHome" />
					</div>
				</div>
			</div>
		</q-drawer>
	</div>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import { useQuasar } from "quasar";
	import { useUserStore } from "@/stores/user";

	const $q = useQuasar();
	const router = useRouter();
	const route = useRoute();
	const userStore = useUserStore();

	// UI state
	const drawer = ref(true);
	const collapsed = ref(false);
	const width = ref(260);
	const compactBreakpoint = 900;

	// Use Quasar screen (reactive) for responsiveness
	const isMobile = computed(() => {
		return $q && $q.screen
			? $q.screen.width < compactBreakpoint || $q.screen.lt.md
			: window.innerWidth < compactBreakpoint;
	});

	// computed drawer width: full panel when mobile-open, compact icon width when closed
	const drawerWidth = computed(() => {
		if (isMobile.value) {
			// when open on mobile, use ~86% or max 360px; when closed keep small icon width
			const w = ($q && $q.screen && $q.screen.width) || window.innerWidth;
			return drawer.value ? Math.min(Math.floor(w * 0.86), 360) : 84;
		}
		return collapsed.value ? 84 : width.value;
	});

	// persist collapse preference (optional)
	const COLLAPSE_KEY = "sellerSidebarCollapsed";
	function saveCollapsed(v) {
		try {
			localStorage.setItem(COLLAPSE_KEY, v ? "1" : "0");
		} catch (e) {}
	}
	function loadCollapsed() {
		try {
			const v = localStorage.getItem(COLLAPSE_KEY);
			if (v === "1") return true;
			if (v === "0") return false;
		} catch (e) {}
		return null;
	}

	// safe localStorage access
	function safeGet(key, def = null) {
		try {
			if (typeof window === "undefined" || !window.localStorage) return def;
			return localStorage.getItem(key) ?? def;
		} catch (e) {
			return def;
		}
	}
	function safeGetNumber(key, def = 0) {
		const v = safeGet(key, null);
		return v == null ? def : Number(v);
	}

	// user
	const userName = computed(
		() => userStore?.name || safeGet("userName", "Seller")
	);
	const userRole = computed(
		() => userStore?.role || safeGet("userRole", "Seller")
	);
	const initials = computed(() => {
		const n = userName.value || "S";
		return n
			.split(" ")
			.map((s) => s[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	});
	const avatarStyle = computed(() => {
		const seed = (userName.value?.charCodeAt(0) || 40) % 360;
		return {
			background: `linear-gradient(135deg, hsl(${seed} 75% 48%), hsl(${
				(seed + 40) % 360
			} 70% 44%))`,
			color: "#fff",
		};
	});

	// menu (Settings removed)
	const menu = [
		{ to: "/seller/dashboard", icon: "dashboard", label: "Dashboard" },
		{ to: "/seller/products", icon: "inventory_2", label: "Products" },
		{
			to: "/seller/orders",
			icon: "assignment",
			label: "Orders",
			badge: safeGetNumber("sellerOrdersCount") || null,
			badgeColor: "accent",
		},
		{ to: "/seller/stock", icon: "inventory", label: "Update Stock" },
		{ to: "/seller/profile", icon: "person", label: "Profile" },
	];

	function isActive(item) {
		return route.path.startsWith(item.to);
	}
	function go(item) {
		if (item.to) {
			router.push(item.to);
			// auto-close on mobile for better UX
			if (isMobile.value) drawer.value = false;
		}
	}
	function toggle() {
		// on desktop toggle collapse, on mobile open/close drawer
		if (isMobile.value) {
			drawer.value = !drawer.value;
		} else {
			collapsed.value = !collapsed.value;
			saveCollapsed(collapsed.value);
		}
	}
	function toHome() {
		router.push("/");
	}
	async function logout() {
		// Clear UI state first
		try {
			drawer.value = false;
			collapsed.value = false;
		} catch (e) {}

		// Reset store if available
		try {
			if (typeof userStore.logout === "function") {
				await userStore.logout();
			} else if (typeof userStore.$reset === "function") {
				userStore.$reset();
			}
		} catch (e) {
			// ignore store errors
			console.debug("userStore reset error", e);
		}

		// Clear persisted values
		try {
			localStorage.removeItem("userName");
			localStorage.removeItem("userRole");
			localStorage.removeItem(COLLAPSE_KEY);
		} catch (e) {}

		// Soft navigation (no full page reload)
		try {
			router.replace({ path: "/" });
		} catch (e) {
			// fallback to hard redirect only if router fails
			window.location.href = "/";
		}

		// Notify user
		$q.notify({ type: "positive", message: "Logged out" });
	}

	// ensure drawer only toggles on explicit user action
	function onDrawerModelUpdate(val) {
		// ignore accidental programmatic opens when not intended
		// only allow change when coming from explicit UI actions
		drawer.value = Boolean(val);
		// keep collapsed state consistent for mobile
		if (isMobile.value) {
			collapsed.value = !drawer.value;
		}
	}

	// react to mobile/desktop changes: set sensible defaults
	watch(
		isMobile,
		(mobile) => {
			const persisted = loadCollapsed();
			if (!mobile) {
				// desktop: show drawer; use persisted collapse if present
				drawer.value = true;
				collapsed.value = persisted === null ? false : persisted;
				width.value = collapsed.value ? 84 : 260;
			} else {
				// mobile: keep drawer closed by default (icons only)
				drawer.value = false;
				// but keep collapsed state true only when drawer is closed
				collapsed.value = true;
				width.value = 84;
			}
		},
		{ immediate: true }
	);

	// when mobile drawer opens, show full labels; when closes, hide them again
	watch(drawer, (open) => {
		if (isMobile.value) {
			collapsed.value = !open; // open -> collapsed=false (show labels)
		}
	});

	// close drawer on navigation if mobile
	watch(
		() => route.path,
		() => {
			if (isMobile.value) drawer.value = false;
		}
	);

	onMounted(() => {
		// ensure width matches collapsed state on mount
		width.value = collapsed.value ? 84 : 260;
	});
</script>

<style scoped>
	/* wrapper holds decorative background */
	.seller-sidebar-wrap {
		position: relative;
		z-index: 30;
	}

	/* mobile open button */
	.mobile-open-btn {
		position: fixed;
		left: 12px;
		top: 12px;
		z-index: 120;
		box-shadow: 0 8px 22px rgba(2, 6, 23, 0.14);
		background: #fff;
		color: #0b63d6;
	}
	:deep(body.q-dark) .mobile-open-btn {
		background: rgba(255, 255, 255, 0.06);
		color: #cfe6ff;
	}

	/* decorative background behind sidebar (subtle, premium) */
	.sidebar-bg {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 320px; /* visible area behind drawer */
		background: radial-gradient(
				circle at 20% 20%,
				rgba(255, 255, 255, 0.03),
				transparent 20%
			),
			linear-gradient(180deg, rgba(11, 99, 214, 0.9), rgba(43, 155, 255, 0.85));
		filter: blur(28px);
		transform: translateX(-40px);
		pointer-events: none;
		z-index: 1;
		border-right: 1px solid rgba(255, 255, 255, 0.02);
	}

	/* drawer styling */
	.seller-drawer {
		background: linear-gradient(
			180deg,
			rgba(3, 105, 161, 0.98) 0%,
			rgba(22, 116, 250, 0.96) 100%
		);
		color: #fff;
		transition: width 200ms ease, box-shadow 200ms ease, transform 200ms ease;
		box-shadow: 0 12px 36px rgba(2, 6, 23, 0.16);
		border-right: 0;
		overflow: hidden;
		position: relative;
	}

	/* inner layout */
	.inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
	}

	/* brand */
	.brand {
		align-items: center;
		gap: 12px;
	}
	.brand-avatar {
		border-radius: 12px;
		box-shadow: 0 12px 40px rgba(2, 6, 23, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
	.brand-title {
		font-weight: 800;
		font-size: 1rem;
		letter-spacing: 0.2px;
	}
	.brand-sub {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.9);
	}

	/* toggle */
	.toggle-btn {
		color: rgba(255, 255, 255, 0.96);
	}

	/* menu */
	.menu-list {
		margin-top: 10px;
		padding: 4px;
	}
	.menu-item {
		border-radius: 10px;
		margin: 6px;
		transition: background 160ms ease, box-shadow 160ms ease;
		cursor: pointer;
	}
	.menu-item:hover {
		background: rgba(255, 255, 255, 0.04);
	}
	.menu-item.q-item--active {
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 22px rgba(2, 6, 23, 0.14);
	}

	.menu-icon {
		font-size: 20px;
		color: rgba(255, 255, 255, 0.95);
	}
	.menu-badge {
		margin-left: 8px;
	}

	/* user footer */
	.footer {
		padding-top: 12px;
	}
	.user-row {
		align-items: center;
		gap: 10px;
	}
	.user-avatar {
		box-shadow: 0 8px 24px rgba(2, 6, 23, 0.14);
		font-weight: 700;
	}
	.user-name {
		font-weight: 700;
	}
	.user-role {
		color: rgba(255, 255, 255, 0.9);
		font-size: 12px;
	}

	/* logout styling */
	.logout-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.logout-btn {
		transition: transform 140ms ease, box-shadow 140ms ease,
			background-color 140ms ease;
		border-radius: 10px;
		min-width: 44px;
	}
	.logout-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
	}
	:deep(.q-btn--unelevated.logout-btn) {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}
	:deep(.q-btn--unelevated.logout-btn:hover) {
		background: rgba(255, 255, 255, 0.12);
	}

	/* responsive tweaks */
	@media (max-width: 900px) {
		.seller-sidebar-wrap .sidebar-bg {
			width: 160px;
			transform: translateX(-20px);
			filter: blur(22px);
		}
		/* removed unconditional hiding of labels on small screens
           labels are now controlled by `collapsed` in the template */
		.menu-icon {
			font-size: 22px;
		}
		.brand-sub {
			display: none;
		}
	}
</style>
