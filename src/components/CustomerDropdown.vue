<template>
	<div class="relative" ref="root">
		<!-- Avatar button -->
		<button
			@click="toggle"
			class="focus:outline-none rounded-full p-0 relative group"
			:title="localName || 'Profile'"
			aria-haspopup="true"
			:aria-expanded="open.toString()">
			<!-- Main avatar -->
			<img
				v-if="avatarUrl"
				:src="avatarUrl"
				alt="avatar"
				class="w-11 h-11 rounded-full object-cover border-2 border-gray-200 shadow-sm group-hover:scale-105 transition-transform" />

			<!-- If avatar not available, show initials -->
			<div
				v-else
				class="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 flex items-center justify-center text-white font-semibold shadow-sm">
				{{ initials }}
			</div>

			<!-- Second small decorative avatar option (example: notification dot / alt avatar) -->
			<div
				class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-500 shadow-md"
				title="Online"></div>
		</button>

		<!-- Dropdown -->
		<transition name="fade-scale">
			<div
				v-if="open"
				class="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 p-4">
				<div v-if="loading" class="text-sm text-gray-600">Loading profile…</div>

				<div v-else-if="error" class="text-sm text-red-600">
					{{ error }}
				</div>

				<div v-else-if="profile">
					<div class="flex items-center gap-3">
						<img
							v-if="avatarUrl"
							:src="avatarUrl"
							class="w-12 h-12 rounded-full object-cover border" />
						<div
							v-else
							class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
							{{ initials }}
						</div>
						<div>
							<div class="font-semibold text-gray-800">
								{{ profile.name || profile.full_name || localName || "—" }}
							</div>
							<div class="text-sm text-gray-500">
								{{ profile.email || "—" }}
							</div>
							<div class="text-xs text-gray-400">
								Role: {{ profile.role || "customer" }}
							</div>
						</div>
					</div>

					<hr class="my-3" />

					<div class="text-sm text-gray-700 space-y-2">
						<div>
							<span class="text-xs text-gray-500">Phone: </span
							>{{ profile.phone || "—" }}
						</div>
						<div>
							<span class="text-xs text-gray-500">Address: </span
							>{{ formatAddress(profile) }}
						</div>
						<div>
							<span class="text-xs text-gray-500">Country: </span>
							{{ profile.country || profile.country_name || "—" }}
						</div>
					</div>

					<div class="mt-3 flex gap-2">
						<button
							@click="goToProfilePage"
							class="flex-1 bg-gray-100 hover:bg-gray-200 text-sm rounded px-3 py-2">
							View full profile
						</button>
						<button
							@click="logout"
							class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded px-3 py-2">
							Logout
						</button>
					</div>

					<details class="mt-3 text-xs text-gray-500">
						<summary class="cursor-pointer">Raw data</summary>
						<pre
							class="mt-2 max-h-36 overflow-auto text-xs bg-gray-50 p-2 rounded"
							>{{ profile }}</pre
						>
					</details>
				</div>

				<div v-else class="text-sm text-gray-600">No profile available.</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios";

const open = ref(false);
const loading = ref(false);
const error = ref(null);
const profile = ref(null);
const root = ref(null);
const router = useRouter();
const profileSource = ref(null); // 'customer' | 'seller' | null

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const localName = computed(() => {
  const u = getStoredUser();
  return u?.name || u?.full_name || u?.company_name || null;
});

const avatarUrl = computed(() => {
  if (profile.value?.avatar) return profile.value.avatar;
  const u = getStoredUser();
  if (u?.avatar) return u.avatar;
  return null;
});

const initials = computed(() => {
  const name = profile.value?.name || localName.value || "U";
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
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

function toggle(event) {
  event.stopPropagation(); // Prevent event from bubbling up to parent elements
  open.value = !open.value;
  if (open.value) {
    fetchProfile();
  }
}

function onDocClick(e) {
  if (!root.value) return;
  if (!root.value.contains(e.target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocClick);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("auth-changed"));
  window.location.href = "/";
}

function goToProfilePage() {
  open.value = false;
  // route to different pages based on profileSource (if you have dedicated seller route)
  const dest = profileSource.value === "seller" ? "/seller/profile" : "/customer/profile";
  router.push(dest).catch(() => {});
}

function formatDate(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}
function formatAddress(obj) {
  const parts = [];
  if (obj?.address) parts.push(obj.address);
  if (obj?.city) parts.push(obj.city);
  if (obj?.postal_code) parts.push(obj.postal_code);
  if (obj?.country) parts.push(obj.country);
  return parts.join(", ") || "—";
}
</script>

<style scoped>
	.fade-scale-enter-active,
	.fade-scale-leave-active {
		transition: transform 0.12s ease, opacity 0.12s ease;
	}
	.fade-scale-enter-from {
		transform: translateY(-6px) scale(0.98);
		opacity: 0;
	}
	.fade-scale-enter-to {
		transform: translateY(0) scale(1);
		opacity: 1;
	}
	.fade-scale-leave-from {
		transform: translateY(0) scale(1);
		opacity: 1;
	}
	.fade-scale-leave-to {
		transform: translateY(-6px) scale(0.98);
		opacity: 0;
	}
</style>
