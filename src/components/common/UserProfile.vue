<template>
	<q-btn-dropdown flat dense round class="profile-dropdown" @show="onDropdownShow">
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

			<!-- Loading state -->
			<q-item v-if="loading">
				<q-item-section>
					<q-item-label>Loading profile...</q-item-label>
				</q-item-section>
			</q-item>

			<!-- Error state -->
			<q-item v-else-if="error">
				<q-item-section>
					<q-item-label caption class="text-negative">{{ error }}</q-item-label>
				</q-item-section>
			</q-item>

			<!-- User Info Section -->
			<q-item v-else-if="profile">
				<q-item-section>
					<q-item-label class="user-name">{{ profile.name || profile.full_name || user?.name || user?.email }}</q-item-label>
					<q-item-label caption class="user-email">{{ profile.email || user?.email }}</q-item-label>
					<q-item-label caption class="user-role">Role: {{ profile.role || user?.role }}</q-item-label>
				</q-item-section>
			</q-item>

			<q-separator />

			<!-- View Profile Button -->
			<q-item clickable v-close-popup @click="goToProfilePage" v-if="profile">
				<q-item-section avatar>
					<q-icon name="person" color="primary" />
				</q-item-section>
				<q-item-section>
					<q-item-label>View full profile</q-item-label>
				</q-item-section>
			</q-item>

			<!-- Dashboard Navigation based on role -->
			<q-item clickable v-close-popup @click="goToDashboard" v-if="(profile?.role || user?.role) === 'seller' || (profile?.role || user?.role) === 'admin'">
				<q-item-section>
					<q-item-label>
						{{ (profile?.role || user?.role) === 'admin' ? 'Admin Dashboard' : 'Seller Dashboard' }}
					</q-item-label>
				</q-item-section>
				<q-item-section side="right" avatar>
					<q-icon name="arrow_forward" color="primary" />
				</q-item-section>
			</q-item>

			<q-separator v-if="(profile?.role || user?.role) === 'seller' || (profile?.role || user?.role) === 'admin'" />

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
import { ref, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import axios from "@/api/axios";

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.currentUser);

const loading = ref(false);
const error = ref(null);
const profile = ref(null);
const profileSource = ref(null); // 'customer' | 'seller' | null

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

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

async function tryEndpointsSequential(list) {
  for (const ep of list) {
    try {
      const res = await axios.get(ep);
      const payload = res?.data?.data ?? res?.data ?? res;
      return { payload, endpoint: ep };
    } catch (err) {
      // if it's a non-auth error (500, network) still continue trying other likely endpoints
      // allow falling through, but capture last error for reporting
      const status = err?.response?.status;
      // continue for 401/403 or other statuses; we'll handle error after loop
    }
  }
  throw new Error("All endpoints failed");
}

async function fetchProfile() {
  loading.value = true;
  error.value = null;
  profile.value = null;
  profileSource.value = null;

  const stored = getStoredUser();
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
    profileSource.value = endpoint.startsWith("/seller") ? "seller" : "customer";
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load profile (no endpoint responded)";
    console.error("fetch profile error", err);
  } finally {
    loading.value = false;
  }
}

function onDropdownShow() {
  fetchProfile();
}

const logout = () => {
  authStore.logout();
  router.push("/");
};

function goToProfilePage() {
  // route to different pages based on profileSource (if you have dedicated seller route)
  const dest = profileSource.value === "seller" ? "/seller/profile" : "/customer/profile";
  router.push(dest).catch(() => {});
}

// Add this function for dashboard navigation based on user role
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
