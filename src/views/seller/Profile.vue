<template>
	<q-page class="q-pa-md bg-gray-50 min-h-screen">
		<!-- Profile Card -->
		<div
			class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
			<div class="flex items-center mb-8">
				<q-avatar size="72px" color="primary" text-color="white" class="shadow-md">
					<q-icon name="business" size="42px" />
				</q-avatar>
				<div class="ml-5">
					<div class="text-3xl font-extrabold text-gray-900">
						{{ profile.company_name }}
					</div>
					<div class="text-gray-500 mt-1">
						{{ profile.address }}, {{ profile.city }}, {{ profile.state }}
					</div>
				</div>
			</div>

			<q-separator />

			<!-- Details Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
				<div v-for="(val, key) in details" :key="key">
					<div class="font-semibold text-gray-600 mb-1">{{ val.label }}</div>
					<div v-if="val.type === 'chip'">
						<q-chip
							:color="profile[key] ? val.colorTrue : val.colorFalse"
							text-color="white"
							class="px-3 py-1 font-medium shadow-sm">
							{{ profile[key] ? val.trueText : val.falseText }}
						</q-chip>
					</div>
					<div v-else class="text-gray-900">{{ profile[key] }}</div>
				</div>
			</div>

			<q-separator class="my-8" />

			<!-- Edit Button -->
			<div class="flex justify-end">
				<q-btn
					color="primary"
					icon="edit"
					label="Edit Profile"
					@click="openEdit"
					class="shadow-md px-5 py-2 rounded-lg font-semibold"
					unelevated />
			</div>
		</div>

		<!-- Edit Profile Modal -->
		<q-dialog
			v-model="showEdit"
			persistent
			transition-show="scale"
			transition-hide="scale">
			<q-card class="rounded-2xl shadow-2xl border border-gray-200" style="max-width: 600px; width: 100%">
				<!-- Header -->
				<q-card-section class="bg-primary text-white rounded-t-2xl">
					<div class="text-xl font-bold flex items-center">
						<q-icon name="edit" class="mr-2" />
						Edit Profile
					</div>
					<div class="text-sm text-white/80 mt-1">
						Update your company details below
					</div>
				</q-card-section>

				<!-- Form Fields -->
				<q-card-section class="q-gutter-md p-6 bg-gray-50">
					<q-input v-model="edit.company_name" label="Company Name" filled dense standout="bg-white" />
					<q-input v-model="edit.phone" label="Phone" filled dense standout="bg-white" />
					<q-input v-model="edit.address" label="Address" filled dense standout="bg-white" />
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<q-input v-model="edit.city" label="City" filled dense standout="bg-white" />
						<q-input v-model="edit.state" label="State" filled dense standout="bg-white" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<q-input v-model="edit.postal_code" label="Postal Code" filled dense standout="bg-white" />
						<q-input v-model="edit.country" label="Country" filled dense standout="bg-white" />
					</div>
					<q-input v-model="edit.email" label="Email" filled dense standout="bg-white" />
				</q-card-section>

				<!-- Actions -->
				<q-card-actions align="right" class="bg-white rounded-b-2xl p-4">
					<q-btn
						flat
						label="Cancel"
						color="negative"
						v-close-popup
						class="px-4 py-2 rounded-lg font-medium hover:bg-red-50" />
					<q-btn
						unelevated
						label="Save Changes"
						color="primary"
						@click="saveProfile"
						class="px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition" />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const profile = ref({
	company_name: "Tech Supplies Ltd",
	phone: "9876543210",
	address: "456 Tech Street",
	city: "Karachi",
	state: "Sindh",
	postal_code: "75000",
	country: "Pakistan",
	email: "nadeemakbar781781@gmail.com",
	is_approved: 1,
	is_blocked: 1,
	created_at: "2025-08-21 11:15:56",
	updated_at: "2025-08-21 19:17:29",
});

const details = {
	phone: { label: "Phone" },
	email: { label: "Email" },
	postal_code: { label: "Postal Code" },
	country: { label: "Country" },
	is_approved: {
		label: "Approved",
		type: "chip",
		colorTrue: "green",
		colorFalse: "orange",
		trueText: "Yes",
		falseText: "No",
	},
	is_blocked: {
		label: "Blocked",
		type: "chip",
		colorTrue: "red",
		colorFalse: "green",
		trueText: "Yes",
		falseText: "No",
	},
	created_at: { label: "Created At" },
	updated_at: { label: "Updated At" },
};

const showEdit = ref(false);
const edit = ref({ ...profile.value });

function openEdit() {
	edit.value = { ...profile.value };
	showEdit.value = true;
}

function saveProfile() {
	profile.value = { ...edit.value };
	showEdit.value = false;
}
</script>

<style scoped>
.bg-gray-50 {
	background: #f9fafb;
}
.q-card {
	transition: box-shadow 0.3s ease, transform 0.2s ease;
}
.q-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.q-input {
	border-radius: 10px;
}
.q-btn {
	transition: all 0.2s ease;
}
.q-btn:hover {
	transform: translateY(-1px);
}
</style>
