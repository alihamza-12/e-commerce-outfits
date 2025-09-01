<template>
	<q-page class="bg-gradient-to-br from-gray-50 to-white min-h-screen flex flex-col">
		<section class="max-w-5xl mx-auto w-full px-4 py-16">
			<div class="text-center mb-14">
				<h1
					class="text-4xl md:text-5xl font-serif font-extrabold tracking-tight mb-4 text-gray-900 drop-shadow-lg">
					Get in Touch
				</h1>
				<p class="max-w-2xl mx-auto text-lg text-gray-600">
					Our team is here to help you. Reach out for support, partnership, or
					just to say hello!
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
				<!-- Contact Info -->
				<q-card class="rounded-3xl shadow-xl p-10 bg-white flex flex-col justify-between">
					<div class="space-y-7">
						<div class="flex items-center gap-4">
							<q-icon name="mdi-map-marker" color="primary" size="36px" />
							<div>
								<div class="font-semibold text-lg text-gray-900">Address</div>
								<div class="text-gray-600 text-sm">
									123 Premium Avenue, Suite 456<br />Karachi, Pakistan 74000
								</div>
							</div>
						</div>
						<div class="flex items-center gap-4">
							<q-icon name="mdi-email" color="primary" size="36px" />
							<div>
								<div class="font-semibold text-lg text-gray-900">Email</div>
								<a href="mailto:info@ecommerceoutfits.com"
									class="text-primary hover:underline text-sm">info@ecommerceoutfits.com</a>
							</div>
						</div>
						<div class="flex items-center gap-4">
							<q-icon name="mdi-phone" color="primary" size="36px" />
							<div>
								<div class="font-semibold text-lg text-gray-900">Phone</div>
								<div class="text-gray-600 text-sm">+92 300 1234567</div>
							</div>
						</div>
					</div>
					<div class="flex gap-5 mt-10">
						<q-btn flat round size="lg" icon="mdi-facebook" color="primary"
							@click="openSocial('facebook')" />
						<q-btn flat round size="lg" icon="mdi-instagram" color="primary"
							@click="openSocial('instagram')" />
						<q-btn flat round size="lg" icon="mdi-twitter" color="primary" @click="openSocial('twitter')" />
						<q-btn flat round size="lg" icon="mdi-linkedin" color="primary"
							@click="openSocial('linkedin')" />
					</div>
					<q-separator class="my-8" />
					<q-card class="rounded-2xl overflow-hidden bg-gray-100 shadow-none">
						<iframe class="w-full h-48" frameborder="0" style="border: 0" allowfullscreen
							src="https://www.openstreetmap.org/export/embed.html?bbox=67.0011%2C24.8607%2C67.1011%2C24.9607&amp;layer=mapnik"
							title="Our Location"></iframe>
					</q-card>
				</q-card>
				<!-- Contact Form -->
				<q-card class="rounded-3xl shadow-xl p-10 bg-white">
					<q-form @submit.prevent="submitForm" class="space-y-7">
						<q-input filled v-model="form.name" label="Your Name"
							:rules="[(val) => !!val || 'Name is required']" dense class="mb-2" prefix=" ">
							<template #prepend>
								<q-icon name="mdi-account" color="primary" />
							</template>
						</q-input>
						<q-input filled v-model="form.email" label="Email Address" type="email" :rules="[
							(val) => !!val || 'Email is required',
							(val) => /.+@.+\..+/.test(val) || 'Enter a valid email',
						]" dense class="mb-2" prefix=" ">
							<template #prepend>
								<q-icon name="mdi-email" color="primary" />
							</template>
						</q-input>
						<q-input filled v-model="form.subject" label="Subject" dense class="mb-2" prefix=" ">
							<template #prepend>
								<q-icon name="mdi-tag" color="primary" />
							</template>
						</q-input>
						<q-input filled v-model="form.message" label="Message" type="textarea" autogrow
							:rules="[(val) => !!val || 'Message is required']" dense class="mb-2" prefix=" ">
							<template #prepend>
								<q-icon name="mdi-message-text" color="primary" />
							</template>
						</q-input>
						<q-btn unelevated color="primary"
							class="w-full py-3 rounded-full font-semibold tracking-wide shadow hover:scale-105 transition"
							label="Send Message" type="submit" :loading="loading" />
						<div v-if="success" class="text-green-600 text-center mt-2">
							Thank you! We'll get back to you soon.
						</div>
					</q-form>
				</q-card>
			</div>
		</section>
	</q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const form = ref({
	name: "",
	email: "",
	subject: "",
	message: "",
});
const loading = ref(false);
const success = ref(false);

function submitForm() {
	loading.value = true;
	success.value = false;
	setTimeout(() => {
		loading.value = false;
		success.value = true;
		form.value = { name: "", email: "", subject: "", message: "" };
	}, 1500);
}

function openSocial(platform) {
	let url = "#";
	if (platform === "facebook") url = "https://facebook.com";
	if (platform === "instagram") url = "https://instagram.com";
	if (platform === "twitter") url = "https://twitter.com";
	if (platform === "linkedin") url = "https://linkedin.com";
	window.open(url, "_blank");
}
</script>

<style scoped>
/* You can add more custom styles if needed */
</style>
