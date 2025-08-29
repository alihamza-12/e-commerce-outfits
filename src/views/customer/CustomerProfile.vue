<template>
	<div class="profile-page px-4 py-8 max-w-6xl mx-auto">
		<!-- Header card -->
		<div class="header-card rounded-2xl overflow-hidden shadow-lg relative">
			<div class="header-bg"></div>

			<div class="header-content flex items-center gap-6 p-6 md:p-8">
				<!-- Avatar -->
				<div class="avatar-wrap">
					<div
						v-if="profile?.avatar"
						class="avatar-img"
						:style="{ backgroundImage: `url(${profile.avatar})` }"></div>
					<div v-else class="avatar-fallback">
						<span>{{ initials }}</span>
					</div>
				</div>

				<!-- Primary info -->
				<div class="flex-1">
					<div class="flex items-start justify-between gap-6">
						<div>
							<h1 class="text-2xl md:text-3xl font-extrabold text-gray-900">
								{{ profile?.name || "—" }}
							</h1>
							<div class="text-sm text-gray-500 mt-1">
								{{ profile?.email || "—" }}
							</div>
							<div class="text-xs text-gray-400 mt-1">
								Role:
								<span class="font-medium text-gray-700">{{
									profile?.role || "customer"
								}}</span>
							</div>
						</div>

						<!-- Edit toggle -->
						<div class="ml-auto">
							<button
								class="edit-btn"
								@click="toggleEdit"
								:aria-pressed="editing.toString()">
								<template v-if="!editing">Edit profile</template>
								<template v-else>Close editor</template>
							</button>
						</div>
					</div>

					<!-- small meta row -->
					<div class="meta-row mt-4 flex gap-6 flex-wrap text-sm text-gray-600">
						<div class="meta-item">
							<div class="muted">Phone</div>
							<div class="value">{{ profile?.phone || "—" }}</div>
						</div>

						<div class="meta-item">
							<div class="muted">Address</div>
							<div class="value line-clamp-1">
								{{ profile?.address || "—" }}
							</div>
						</div>

						<div class="meta-item">
							<div class="muted">Country</div>
							<div class="value">
								{{ profile?.country || profile?.country_name || "—" }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit form (collapsible) -->
		<transition name="slide-fade">
			<div
				v-if="editing"
				class="edit-panel mt-6 bg-white rounded-2xl shadow p-6 md:p-8">
				<form @submit.prevent="saveProfile" novalidate>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="label">Name</label>
							<input
								v-model="form.name"
								type="text"
								class="input"
								:class="{ 'input-error': formErrors.name }" />
							<div v-if="formErrors.name" class="field-error">
								{{ formErrors.name }}
							</div>
						</div>

						<div>
							<label class="label">Email (read-only)</label>
							<input
								v-model="form.email"
								type="email"
								readonly
								class="input input-readonly" />
						</div>

						<div>
							<label class="label">Phone</label>
							<input
								v-model="form.phone"
								type="text"
								class="input"
								:class="{ 'input-error': formErrors.phone }" />
							<div v-if="formErrors.phone" class="field-error">
								{{ formErrors.phone }}
							</div>
						</div>

						<div>
							<label class="label">Country</label>
							<input
								v-model="form.country"
								type="text"
								class="input"
								:class="{ 'input-error': formErrors.country }" />
							<div v-if="formErrors.country" class="field-error">
								{{ formErrors.country }}
							</div>
						</div>

						<div class="md:col-span-2">
							<label class="label">Address</label>
							<input
								v-model="form.address"
								type="text"
								class="input"
								:class="{ 'input-error': formErrors.address }" />
							<div v-if="formErrors.address" class="field-error">
								{{ formErrors.address }}
							</div>
						</div>

						<div>
							<label class="label">City</label>
							<input
								v-model="form.city"
								type="text"
								class="input"
								:class="{ 'input-error': formErrors.city }" />
							<div v-if="formErrors.city" class="field-error">
								{{ formErrors.city }}
							</div>
						</div>

						<div>
							<label class="label">Postal code</label>
							<input
								v-model="form.postal_code"
								type="text"
								class="input"
								:class="{ 'input-error': formErrors.postal_code }" />
							<div v-if="formErrors.postal_code" class="field-error">
								{{ formErrors.postal_code }}
							</div>
						</div>
					</div>

					<div class="mt-6 flex items-center gap-3">
						<button :disabled="saving" class="btn-save">
							<span v-if="saving">Saving…</span>
							<span v-else>Save changes</span>
						</button>

						<button
							type="button"
							class="btn-cancel"
							@click="cancelEdit"
							:disabled="saving">
							Cancel
						</button>

						<div v-if="successMessage" class="success-msg">
							{{ successMessage }}
						</div>
					</div>

					<div v-if="serverMessage" class="mt-4 text-sm text-red-600">
						{{ serverMessage }}
					</div>
				</form>
			</div>
		</transition>

		<!-- raw data & debug -->
		<div v-if="profile" class="mt-6">
			<details class="bg-white rounded p-4 text-xs text-gray-600">
				<summary class="cursor-pointer text-sm text-gray-700">
					Raw data (debug)
				</summary>
				<pre class="mt-2 text-xs">{{ profile }}</pre>
			</details>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, computed, onMounted } from "vue";
	import axios from "@/api/axios";
	import { useQuasar } from "quasar";

	const $q = useQuasar();

	const profile = ref(null);
	const profileSource = ref(null); // will be 'customer' or 'seller'
	const editing = ref(false);
	const loading = ref(false);
	const saving = ref(false);
	const serverMessage = ref(null);
	const successMessage = ref(null);

	const form = reactive({
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		postal_code: "",
		country: "",
	});

	const formErrors = reactive({
		name: null,
		phone: null,
		address: null,
		city: null,
		postal_code: null,
		country: null,
	});

	function clearErrors() {
		for (const k in formErrors) formErrors[k] = null;
		serverMessage.value = null;
		successMessage.value = null;
	}

	function mapServerErrors(err) {
		clearErrors();
		const data = err?.response?.data;
		if (data?.errors && typeof data.errors === "object") {
			// Laravel-like errors
			for (const key in data.errors) {
				if (key in formErrors) formErrors[key] = data.errors[key].join(" ");
				else {
					serverMessage.value = data.errors[key].join(" ");
				}
			}
		} else {
			serverMessage.value = data?.message || err.message || "Update failed";
		}
	}

	async function fetchProfile() {
		loading.value = true;
		serverMessage.value = null;

		function getStoredUser() {
			try {
				return JSON.parse(localStorage.getItem("user") || "null");
			} catch {
				return null;
			}
		}
		const stored = getStoredUser();
		const role = stored?.role?.toString?.().toLowerCase?.() || null;

		const customerEndpoints = ["/customer/profile", "/customer/me"];
		const sellerEndpoints = ["/seller/profile", "/seller/me", "/seller"];
		const tryList =
			role === "seller"
				? [...sellerEndpoints, ...customerEndpoints]
				: [...customerEndpoints, ...sellerEndpoints];

		let lastErr = null;
		for (const ep of tryList) {
			try {
				const res = await axios.get(ep);
				const payload = res?.data?.data ?? res?.data ?? res;
				profile.value = payload;
				profileSource.value = ep.startsWith("/seller") ? "seller" : "customer";
				// populate form
				form.name = payload.name ?? payload.full_name ?? "";
				form.email = payload.email ?? "";
				form.phone = payload.phone ?? "";
				form.address = payload.address ?? "";
				form.city = payload.city ?? "";
				form.postal_code = payload.postal_code ?? payload.zip ?? "";
				form.country = payload.country ?? payload.country_name ?? "";
				lastErr = null;
				break;
			} catch (err) {
				lastErr = err;
				// try next endpoint
			}
		}

		if (lastErr && !profile.value) {
			serverMessage.value =
				lastErr?.response?.data?.message ??
				lastErr.message ??
				"Failed to load profile";
			console.error("fetch profile error", lastErr);
		}

		loading.value = false;
	}

	function toggleEdit() {
		editing.value = !editing.value;
		clearErrors();
		successMessage.value = null;
		// if opening editor, ensure form is in sync
		if (editing.value && profile.value) {
			form.name = profile.value.name ?? profile.value.full_name ?? "";
			form.email = profile.value.email ?? "";
			form.phone = profile.value.phone ?? "";
			form.address = profile.value.address ?? "";
			form.city = profile.value.city ?? "";
			form.postal_code = profile.value.postal_code ?? profile.value.zip ?? "";
			form.country = profile.value.country ?? profile.value.country_name ?? "";
			// focus management could be added here
		}
	}

	function cancelEdit() {
		editing.value = false;
		clearErrors();
		// reset form from profile
		if (profile.value) {
			form.name = profile.value.name ?? profile.value.full_name ?? "";
			form.email = profile.value.email ?? "";
			form.phone = profile.value.phone ?? "";
			form.address = profile.value.address ?? "";
			form.city = profile.value.city ?? "";
			form.postal_code = profile.value.postal_code ?? profile.value.zip ?? "";
			form.country = profile.value.country ?? profile.value.country_name ?? "";
		}
	}

	async function saveProfile() {
		clearErrors();
		saving.value = true;
		successMessage.value = null;

		try {
			const payload = {
				name: form.name ?? "",
				phone: form.phone ?? "",
				address: form.address ?? "",
				city: form.city ?? "",
				postal_code: form.postal_code ?? "",
				country: form.country ?? "",
			};

			// choose endpoint based on which one returned profile previously
			const patchTarget =
				profileSource.value === "seller"
					? "/seller/profile"
					: "/customer/profile";

			const res = await axios.patch(patchTarget, payload);
			const updated = res?.data?.data ?? res?.data ?? res;
			profile.value = updated;

			// update localStorage user entry
			try {
				const stored = JSON.parse(localStorage.getItem("user") || "null") || {};
				const merged = { ...stored, ...updated };
				localStorage.setItem("user", JSON.stringify(merged));
				// notify navbar and others
				window.dispatchEvent(new Event("auth-changed"));
			} catch (e) {}

			successMessage.value = "Saved";
			$q.notify && $q.notify({ type: "positive", message: "Profile updated" });
			setTimeout(() => {
				editing.value = false;
				successMessage.value = null;
			}, 900);
		} catch (err) {
			console.error("save profile error", err);
			mapServerErrors(err);
			$q.notify &&
				$q.notify({ type: "negative", message: "Failed to save profile" });
		} finally {
			saving.value = false;
		}
	}

	const initials = computed(() => {
		const n =
			profile.value?.name ?? form.name ?? profile.value?.full_name ?? "";
		if (!n) return "U";
		return n
			.split(" ")
			.map((s) => s[0]?.toUpperCase())
			.slice(0, 2)
			.join("");
	});

	onMounted(fetchProfile);
</script>

<style scoped>
	.profile-page {
		font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
			"Helvetica Neue", Arial;
	}

	/* Header card */
	.header-card {
		position: relative;
		overflow: visible;
	}
	.header-bg {
		height: 110px;
		background: linear-gradient(
			90deg,
			rgba(99, 102, 241, 0.12),
			rgba(14, 165, 233, 0.06)
		);
	}
	.header-content {
		margin-top: -30px;
	}

	/* Avatar */
	.avatar-wrap {
		width: 84px;
		height: 84px;
		flex: 0 0 84px;
	}
	.avatar-img {
		width: 84px;
		height: 84px;
		border-radius: 20px;
		background-size: cover;
		background-position: center;
		border: 4px solid #fff;
		box-shadow: 0 8px 26px rgba(6, 22, 45, 0.06);
	}
	.avatar-fallback {
		width: 84px;
		height: 84px;
		border-radius: 20px;
		display: grid;
		place-items: center;
		color: #fff;
		font-weight: 700;
		font-size: 18px;
		background: linear-gradient(135deg, #7c3aed, #06b6d4);
		border: 4px solid #fff;
		box-shadow: 0 8px 26px rgba(6, 22, 45, 0.06);
	}

	/* Text */
	.label {
		display: block;
		font-size: 13px;
		color: #6b7280;
		margin-bottom: 6px;
	}
	.input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid #e6e9ef;
		border-radius: 10px;
		background: #fff;
		box-shadow: none;
		outline: none;
	}
	.input:focus {
		border-color: #7c3aed;
		box-shadow: 0 6px 18px rgba(124, 58, 237, 0.08);
	}
	.input-readonly {
		background: #fafafa;
		color: #6b7280;
		cursor: default;
	}

	/* Errors and small helpers */
	.input-error {
		border-color: #ef4444 !important;
	}
	.field-error {
		margin-top: 6px;
		color: #ef4444;
		font-size: 12px;
	}

	/* Buttons */
	.edit-btn {
		background: linear-gradient(90deg, #fff, #f8fafc);
		border: 1px solid rgba(15, 23, 42, 0.06);
		padding: 10px 14px;
		border-radius: 10px;
		font-weight: 600;
		color: #0f172a;
		cursor: pointer;
		box-shadow: 0 8px 26px rgba(15, 23, 42, 0.04);
	}
	.edit-btn[aria-pressed="true"] {
		background: linear-gradient(90deg, #f3f4f6, #ffffff);
	}

	/* Save / Cancel */
	.btn-save {
		background: linear-gradient(90deg, #4f46e5, #06b6d4);
		color: #fff;
		padding: 10px 14px;
		border-radius: 10px;
		font-weight: 600;
		border: none;
		cursor: pointer;
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.btn-cancel {
		background: #f3f4f6;
		color: #111827;
		padding: 10px 12px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
	}

	/* success message */
	.success-msg {
		color: #059669;
		font-weight: 600;
		margin-left: 12px;
	}

	/* transitions */
	.slide-fade-enter-active {
		transition: all 0.22s cubic-bezier(0.2, 0.9, 0.2, 1);
	}
	.slide-fade-leave-active {
		transition: all 0.18s ease;
	}
	.slide-fade-enter-from {
		opacity: 0;
		transform: translateY(-6px);
	}
	.slide-fade-enter-to {
		opacity: 1;
		transform: translateY(0);
	}

	/* small utilities */
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* raw data pre */
	pre {
		white-space: pre-wrap;
		word-break: break-word;
		background: #f8fafc;
		padding: 12px;
		border-radius: 8px;
	}

	/* Meta row: responsive 3-column layout with clear label/value */
	.meta-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
		align-items: start;
		margin-top: 12px;
	}

	/* Each meta item */
	.meta-item {
		min-width: 0;
		padding-right: 4px;
	}

	/* Label (muted) */
	.meta-item .muted {
		display: block;
		font-size: 13px;
		color: #6b7280; /* gray-500 */
		margin-bottom: 6px;
		line-height: 1;
	}

	/* Value (stronger) */
	.meta-item .value {
		display: block;
		font-size: 15px;
		font-weight: 600;
		color: #0f172a; /* primary text */
		line-height: 1.2;
		word-break: break-word;
	}

	/* Make address wrap nicely and allow multi-line values */
	.meta-item .value.line-clamp-1 {
		-webkit-line-clamp: unset;
		display: block;
		white-space: normal;
	}

	/* Responsive: on small screens stack in 1 column, medium screens 2 columns */
	@media (max-width: 900px) {
		.meta-row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}
	}

	@media (max-width: 480px) {
		.meta-row {
			grid-template-columns: 1fr;
		}
		.avatar-wrap {
			margin-bottom: 8px;
		} /* keep avatar spacing ok on very small screens */
	}
</style>
