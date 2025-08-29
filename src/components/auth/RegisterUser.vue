<template>
	<div class="register-outer">
		<div class="register-container">
			<!-- Left Side -->
			<div class="register-left">
				<div class="register-logo-wrap">
					<img
						src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
						alt="Logo"
						class="register-logo" />
					<h2 class="register-brand">StyleHub</h2>
				</div>
				<p class="register-desc">
					Create your account and join the StyleHub community.<br />
					Discover, shop, and manage your style with ease.
				</p>
				<div class="left-actions">
					<button class="btn-get-started" @click="scrollToForm">
						GET STARTED
					</button>
					<button class="btn-home" @click="goHome">Back to Home</button>
				</div>
			</div>

			<!-- Right Side (Forms) -->
			<div class="register-right">
				<div ref="formRef" class="register-form">
					<!-- Header -->
					<div class="form-header">
						<h3 class="register-title">Create Account</h3>
						<p class="register-subtitle">Choose your role to continue</p>
					</div>

					<!-- Role switcher -->
					<div class="role-tabs" role="tablist">
						<button
							:class="['role-tab', role === 'buyer' ? 'active' : '']"
							role="tab"
							aria-selected="role === 'buyer'"
							@click="switchRole('buyer')">
							Buyer
						</button>
						<button
							:class="['role-tab', role === 'seller' ? 'active' : '']"
							role="tab"
							aria-selected="role === 'seller'"
							@click="switchRole('seller')">
							Seller
						</button>
					</div>

					<!-- Buyer OTP Register -->
					<section v-if="role === 'buyer'" class="panel" key="buyer">
						<div class="panel-header">
							<h4>Buyer Registration (OTP)</h4>
							<small class="muted"
								>We’ll verify your phone/email with a one-time code.</small
							>
						</div>

						<!-- Step indicator -->
						<div class="steps">
							<div :class="['step', buyer.step >= 1 ? 'done' : '']">
								<span>1</span>
								<label>Details</label>
							</div>
							<div :class="['step', buyer.step >= 2 ? 'done' : '']">
								<span>2</span>
								<label>Verify OTP</label>
							</div>
						</div>

						<!-- Step 1: Details -->
						<form v-if="buyer.step === 1" @submit.prevent="requestBuyerOtp">
							<div class="grid-2">
								<div class="form-group">
									<label for="bName">Full Name</label>
									<input
										id="bName"
										type="text"
										v-model.trim="buyer.name"
										class="form-control"
										placeholder="Enter your full name" />
								</div>
								<div class="form-group">
									<label for="bEmail">Email Address</label>
									<input
										id="bEmail"
										type="email"
										v-model.trim="buyer.email"
										class="form-control"
										placeholder="you@example.com" />
								</div>
							</div>
							<div class="grid-2">
								<div class="form-group">
									<label for="bPhone">Phone Number</label>
									<input
										id="bPhone"
										type="text"
										v-model.trim="buyer.phone"
										class="form-control"
										placeholder="03xx-xxxxxxx" />
								</div>
								<div class="form-group">
									<label for="bPassword">Password</label>
									<input
										id="bPassword"
										type="password"
										v-model="buyer.password"
										class="form-control"
										placeholder="Minimum 8 characters"
										minlength="8" />
								</div>
							</div>
							<div class="grid-2">
								<div class="form-group">
									<label for="bCPassword">Confirm Password</label>
									<input
										id="bCPassword"
										type="password"
										v-model="buyer.confirm"
										class="form-control"
										placeholder="Re-enter password" />
								</div>
								<div class="form-group">
									<label for="bAddress">Address</label>
									<input
										id="bAddress"
										type="text"
										v-model.trim="buyer.address"
										class="form-control"
										placeholder="Address" />
								</div>
							</div>
							<div class="grid-2">
								<div class="form-group">
									<label for="bCity">City</label>
									<input
										id="bCity"
										type="text"
										v-model.trim="buyer.city"
										class="form-control"
										placeholder="City" />
								</div>
								<div class="form-group">
									<label for="bState">State</label>
									<input
										id="bState"
										type="text"
										v-model.trim="buyer.state"
										class="form-control"
										placeholder="State" />
								</div>
							</div>
							<div class="grid-2">
								<div class="form-group">
									<label for="bPostal">Postal Code</label>
									<input
										id="bPostal"
										type="text"
										v-model.trim="buyer.postalCode"
										class="form-control"
										placeholder="e.g. 54000" />
								</div>
								<div class="form-group">
									<label for="bCountry">Country</label>
									<input
										id="bCountry"
										type="text"
										v-model.trim="buyer.country"
										class="form-control"
										placeholder="Pakistan" />
								</div>
							</div>
							<div class="form-group checkbox-row">
								<input
									type="checkbox"
									id="bTerms"
									v-model="buyer.acceptTerms" />
								<label for="bTerms" class="mb-0 small text-muted"
									>I accept the Terms of Use and Privacy Policy</label
								>
							</div>
							<button
								type="submit"
								class="btn-signup"
								:disabled="buyer.loading">
								Request OTP
							</button>
						</form>

						<!-- Step 2: OTP Verification -->
						<form v-if="buyer.step === 2" @submit.prevent="verifyBuyerOtp">
							<div class="form-group">
								<label for="bOtp">OTP Code</label>
								<input
									id="bOtp"
									type="text"
									v-model="buyer.otpCode"
									class="form-control"
									maxlength="6"
									placeholder="Enter OTP" />
							</div>
							<button
								type="submit"
								class="btn-signup"
								:disabled="buyer.loading">
								Verify OTP
							</button>
							<button
								type="button"
								class="btn-ghost"
								:disabled="buyer.loading || buyer.resendCooldown > 0"
								@click="resendBuyerOtp">
								Resend OTP
								<span v-if="buyer.resendCooldown > 0"
									>({{ buyer.resendCooldown }}s)</span
								>
							</button>
							<button type="button" class="btn-ghost" @click="buyer.step = 1">
								Edit Details
							</button>
						</form>
					</section>

					<!-- Seller Register (existing flow) -->
					<section v-else class="panel" key="seller">
						<div class="panel-header">
							<h4>Seller Registration</h4>
							<small class="muted"
								>Create a seller account to list and manage your
								products.</small
							>
						</div>
						<form @submit.prevent="handleSellerRegister">
							<div class="form-group">
								<label for="sName">Full Name</label>
								<input
									id="sName"
									type="text"
									v-model.trim="seller.name"
									class="form-control"
									placeholder="Enter your full name"
									:class="{ 'is-invalid': seller.submitted && !seller.name }" />
								<div
									class="invalid-feedback"
									v-if="seller.submitted && !seller.name">
									Please provide your full name.
								</div>
							</div>

							<div class="grid-2">
								<div class="form-group">
									<label for="sEmail">Email Address</label>
									<input
										id="sEmail"
										type="email"
										v-model.trim="seller.email"
										class="form-control"
										placeholder="Enter your email"
										:class="{
											'is-invalid': seller.submitted && !validSellerEmail,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !validSellerEmail">
										Please provide a valid email.
									</div>
								</div>
								<div class="form-group">
									<label for="sPhone">Phone Number</label>
									<input
										id="sPhone"
										type="text"
										v-model.trim="seller.phone"
										class="form-control"
										placeholder="Enter your phone"
										:class="{
											'is-invalid': seller.submitted && !seller.phone,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !seller.phone">
										Please provide your phone.
									</div>
								</div>
							</div>

							<div class="form-group">
								<label for="sCompany">Company Name</label>
								<input
									id="sCompany"
									type="text"
									v-model.trim="seller.companyName"
									class="form-control"
									placeholder="Your company (optional)" />
							</div>

							<div class="grid-2">
								<div class="form-group">
									<label for="sPassword">Password</label>
									<input
										id="sPassword"
										type="password"
										v-model="seller.password"
										class="form-control"
										placeholder="Enter password"
										:class="{
											'is-invalid':
												seller.submitted && seller.password.length < 8,
										}"
										minlength="8" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && seller.password.length < 8">
										Password must be at least 8 characters.
									</div>
								</div>
								<div class="form-group">
									<label for="sCPassword">Confirm Password</label>
									<input
										id="sCPassword"
										type="password"
										v-model="seller.confirm"
										class="form-control"
										placeholder="Re-enter password"
										:class="{
											'is-invalid': seller.submitted && !sellerPasswordsMatch,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !sellerPasswordsMatch">
										Passwords do not match.
									</div>
								</div>
							</div>

							<div class="grid-2">
								<div class="form-group">
									<label for="sAddress">Address</label>
									<input
										id="sAddress"
										type="text"
										v-model.trim="seller.address"
										class="form-control"
										placeholder="Address"
										:class="{
											'is-invalid': seller.submitted && !seller.address,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !seller.address">
										Address is required.
									</div>
								</div>
								<div class="form-group">
									<label for="sCity">City</label>
									<input
										id="sCity"
										type="text"
										v-model.trim="seller.city"
										class="form-control"
										placeholder="City"
										:class="{
											'is-invalid': seller.submitted && !seller.city,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !seller.city">
										City is required.
									</div>
								</div>
							</div>

							<div class="grid-2">
								<div class="form-group">
									<label for="sPostal">Postal Code</label>
									<input
										id="sPostal"
										type="text"
										v-model.trim="seller.postalCode"
										class="form-control"
										placeholder="e.g. 54000"
										:class="{
											'is-invalid': seller.submitted && !seller.postalCode,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !seller.postalCode">
										Postal code is required.
									</div>
								</div>
								<div class="form-group">
									<label for="sCountry">Country</label>
									<input
										id="sCountry"
										type="text"
										v-model.trim="seller.country"
										class="form-control"
										placeholder="Pakistan"
										:class="{
											'is-invalid': seller.submitted && !seller.country,
										}" />
									<div
										class="invalid-feedback"
										v-if="seller.submitted && !seller.country">
										Country is required.
									</div>
								</div>
							</div>

							<div class="form-group checkbox-row">
								<input
									type="checkbox"
									id="sTerms"
									v-model="seller.acceptTerms" />
								<label for="sTerms" class="mb-0 small text-muted"
									>I accept the Terms of Use and Privacy Policy</label
								>
							</div>

							<button
								type="submit"
								class="btn-signup"
								:disabled="seller.loading">
								<span
									v-if="seller.loading"
									class="spinner-border spinner-border-sm me-2"></span>
								Sign Up (Seller)
							</button>

							<p class="register-bottom">
								Already a member?
								<router-link to="/loginuser" class="register-link"
									>Login</router-link
								>
							</p>
						</form>
					</section>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, nextTick } from "vue";
	import { useRouter } from "vue-router";
	import axios from "@/api/axios";

	const router = useRouter();
	const formRef = ref(null);

	// role tabs
	const role = ref("buyer");
	function switchRole(r) {
		role.value = r;
		// reset minimal state when switching
		if (r === "buyer") resetSeller();
		else resetBuyer();
		nextTick(() => scrollToForm());
	}

	function goHome() {
		// Explicit redirect as requested
		window.location.href = "http://localhost:5173/";
	}

	function scrollToForm() {
		if (formRef.value) formRef.value.scrollIntoView({ behavior: "smooth" });
	}

	// ******************************
	// Buyer (Customer) – OTP Flow
	// ******************************
	const buyer = ref({
		step: 1,
		submitted: false,
		loading: false,
		name: "",
		email: "",
		phone: "",
		password: "",
		confirm: "",
		address: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
		acceptTerms: false,
		resendCooldown: 0,
		// will store the payload we sent on request-otp (if backend expects the same on verify we still have it)
		lastPayload: null,
		otp: ["", "", "", "", "", ""],
		otpCode: "",
	});

	const validBuyerEmail = computed(() =>
		/\S+@\S+\.\S+/.test(buyer.value.email)
	);
	const buyerPasswordsMatch = computed(
		() => buyer.value.password === buyer.value.confirm
	);

	function validateBuyerDetails() {
		buyer.value.submitted = true;
		const b = buyer.value;
		if (
			!b.name ||
			!validBuyerEmail.value ||
			!b.phone ||
			b.password.length < 8 ||
			!buyerPasswordsMatch.value ||
			!b.address ||
			!b.city ||
			!b.state ||
			!b.postalCode ||
			!b.country ||
			!b.acceptTerms
		) {
			return false;
		}
		return true;
	}

	async function requestBuyerOtp() {
		if (!validateBuyerDetails()) return;
		buyer.value.loading = true;
		try {
			// Prepare payload (adjust keys to your backend contract if needed)
			const payload = {
				name: buyer.value.name,
				email: buyer.value.email,
				phone: buyer.value.phone,
				password: buyer.value.password,
				password_confirmation: buyer.value.confirm,
				address: buyer.value.address,
				city: buyer.value.city,
				state: buyer.value.state,
				postal_code: buyer.value.postalCode,
				country: buyer.value.country,
			};

			buyer.value.lastPayload = payload;

			// Hit: POST /api/customers/register/request-otp
			await axios.post("/customers/register/request-otp", payload);

			// Move to OTP screen
			buyer.value.step = 2;
			startBuyerResendTimer();
			// focus first OTP box
			await nextTick();
			focusOtpBox("buyer", 0);
		} catch (error) {
			alert(error?.response?.data?.message || "Failed to request OTP.");
		} finally {
			buyer.value.loading = false;
		}
	}

	async function verifyBuyerOtp() {
		const code = buyer.value.otpCode;
		const email = buyer.value.email; // Registration form ka email
		if (!code || code.length !== 6) {
			alert("Please enter the 6-digit OTP.");
			return;
		}
		if (!email) {
			alert("Email is required for OTP verification.");
			return;
		}
		buyer.value.loading = true;
		try {
			// Hit: POST /api/customers/register/verify
			const res = await axios.post("/customers/register/verify", {
				email: email,
				otp: code,
			});
			if (res?.data?.success) {
				alert("OTP verified! Redirecting to login...");
				router.push("/loginuser");
			} else {
				alert(res?.data?.message || "OTP incorrect. Please try again.");
			}
		} catch (error) {
			alert(error?.response?.data?.message || "OTP verification failed.");
		} finally {
			buyer.value.loading = false;
		}
	}

	async function resendBuyerOtp() {
		if (buyer.value.resendCooldown > 0) return;
		buyer.value.loading = true;
		try {
			// Hit: POST /api/customers/register/resend-otp
			await axios.post("/customers/register/resend-otp", {
				email: buyer.value.email, // sirf email bhejein
			});
			startBuyerResendTimer();
		} catch (error) {
			alert(error?.response?.data?.message || "Failed to resend OTP.");
		} finally {
			buyer.value.loading = false;
		}
	}

	function startBuyerResendTimer() {
		buyer.value.resendCooldown = 60;
		const iv = setInterval(() => {
			buyer.value.resendCooldown--;
			if (buyer.value.resendCooldown <= 0) clearInterval(iv);
		}, 1000);
	}

	// OTP helpers
	const buyerOtpRefs = ref([]);
	function focusOtpBox(target, index) {
		if (target === "buyer") buyerOtpRefs.value?.[index]?.focus();
	}

	function onOtpInput(e, index, target) {
		const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
		e.target.value = val;
		if (target === "buyer") buyer.value.otp[index] = val;
		if (val && index < 5) focusOtpBox(target, index + 1);
	}

	function onOtpBackspace(e, index, target) {
		const input = e.target;
		if (input.value) {
			input.value = "";
			if (target === "buyer") buyer.value.otp[index] = "";
			return;
		}
		if (index > 0) focusOtpBox(target, index - 1);
	}

	function onOtpPaste(evt, target) {
		const pasted = (evt.clipboardData || window.clipboardData).getData("text");
		const digits = (pasted || "").replace(/\D/g, "").slice(0, 6).split("");
		if (!digits.length) return;
		if (target === "buyer") {
			for (let i = 0; i < 6; i++) {
				buyer.value.otp[i] = digits[i] || "";
				const ref = buyerOtpRefs.value?.[i];
				if (ref) ref.value = buyer.value.otp[i];
			}
			focusOtpBox(target, Math.min(digits.length, 5));
		}
	}

	function resetBuyer() {
		buyer.value = {
			step: 1,
			submitted: false,
			loading: false,
			name: "",
			email: "",
			phone: "",
			password: "",
			confirm: "",
			address: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
			acceptTerms: false,
			resendCooldown: 0,
			lastPayload: null,
			otp: ["", "", "", "", "", ""],
			otpCode: "",
		};
	}

	// ******************************
	// Seller – Existing simple register (no OTP)
	// ******************************
	const seller = ref({
		submitted: false,
		loading: false,
		name: "",
		email: "",
		phone: "",
		companyName: "",
		password: "",
		confirm: "",
		address: "",
		city: "",
		postalCode: "",
		country: "",
		acceptTerms: false,
	});

	const validSellerEmail = computed(() =>
		/\S+@\S+\.\S+/.test(seller.value.email)
	);
	const sellerPasswordsMatch = computed(
		() => seller.value.password === seller.value.confirm
	);

	function validateSeller() {
		seller.value.submitted = true;
		const s = seller.value;
		if (
			!s.name ||
			!validSellerEmail.value ||
			!s.phone ||
			s.password.length < 8 ||
			!sellerPasswordsMatch.value ||
			!s.address ||
			!s.city ||
			!s.postalCode ||
			!s.country ||
			!s.acceptTerms
		) {
			return false;
		}
		return true;
	}

	async function handleSellerRegister() {
		if (!validateSeller()) return;
		seller.value.loading = true;
		try {
			const payload = {
				name: seller.value.name,
				email: seller.value.email,
				phone: seller.value.phone,
				password: seller.value.password,
				password_confirmation: seller.value.confirm,
				role: "seller",
				company_name: seller.value.companyName,
				address: seller.value.address,
				city: seller.value.city,
				postal_code: seller.value.postalCode,
				country: seller.value.country,
			};

			const response = await axios.post("/sellers/register", payload);
			if (response?.data?.success) {
				alert(response.data.message || "Registration successful!");
				router.push("/loginuser");
			} else {
				alert(
					response?.data?.message || "Registration failed. Please try again."
				);
			}
		} catch (error) {
			console.log(error?.response?.data);
			alert(
				error?.response?.data?.message ||
					"Registration failed. Please try again."
			);
		} finally {
			seller.value.loading = false;
		}
	}

	function resetSeller() {
		seller.value = {
			submitted: false,
			loading: false,
			name: "",
			email: "",
			phone: "",
			companyName: "",
			password: "",
			confirm: "",
			address: "",
			city: "",
			postalCode: "",
			country: "",
			acceptTerms: false,
		};
	}
</script>

<style scoped>
	@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

	.register-outer {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: "Inter", sans-serif;
		/* Animated gradient background */
		background: linear-gradient(-45deg, #7f9cf5, #a7bfe8, #6a82fb, #fc5c7d);
		background-size: 400% 400%;
		animation: gradientMove 12s ease infinite;
	}
	@keyframes gradientMove {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.register-container {
		display: flex;
		width: 1000px;
		max-width: 98vw;
		min-height: 650px;
		background: transparent;
		border-radius: 28px;
		box-shadow: 0 8px 40px 0 rgba(31, 38, 135, 0.13);
		overflow: visible;
	}

	.register-left {
		flex: 1.1;
		background: linear-gradient(135deg, #6b6bd0 0%, #fc5c7d 100%);
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem 3rem 2.5rem;
		position: relative;
	}

	.left-actions {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.btn-home {
		background: #ffffff22;
		color: #fff;
		border: 1px solid #ffffff55;
		border-radius: 30px;
		padding: 0.85rem 1.4rem;
		font-size: 1rem;
		font-weight: 600;
		backdrop-filter: blur(4px);
	}

	.register-logo-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2.2rem;
	}

	.register-logo {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
		object-fit: cover;
		margin-bottom: 0.7rem;
	}

	.register-brand {
		font-size: 2.1rem;
		font-weight: 700;
		letter-spacing: 1px;
		margin-bottom: 0;
	}
	.register-desc {
		font-size: 1.13rem;
		margin-bottom: 2.5rem;
		text-align: center;
		opacity: 0.93;
		line-height: 1.6;
	}

	.btn-get-started {
		background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
		color: #22223b;
		border: none;
		border-radius: 30px;
		padding: 0.85rem 1.4rem;
		font-size: 1rem;
		font-weight: 600;
		box-shadow: 0 2px 12px rgba(67, 233, 123, 0.13);
		transition: background 0.2s, color 0.2s, box-shadow 0.2s;
	}

	.btn-get-started:hover {
		background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
		color: #22223b;
		box-shadow: 0 4px 18px rgba(67, 233, 123, 0.18);
	}

	.register-right {
		flex: 1.3;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem;
		border-radius: 0 28px 28px 0;
		min-width: 340px;
		overflow: visible;
	}
	.register-form {
		width: 100%;
		max-width: 430px;
		margin: 0 auto;
		background: transparent;
	}

	.form-header {
		margin-bottom: 0.8rem;
	}
	.register-title {
		font-size: 2rem;
		font-weight: 700;
		color: #6a82fb;
		margin-bottom: 0.2rem;
		text-align: left;
	}
	.register-subtitle {
		font-size: 1.04rem;
		color: #888;
		margin-bottom: 1rem;
		text-align: left;
	}

	.role-tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.role-tab {
		border-radius: 14px;
		padding: 0.7rem 1rem;
		border: 1.5px solid #e5e7eb;
		background: #f8fafc;
		font-weight: 600;
	}
	.role-tab.active {
		border-color: #6a82fb;
		background: #fff;
		box-shadow: 0 0 0 2px #6a82fb22;
	}

	.panel {
		margin-top: 0.2rem;
	}
	.panel-header {
		margin-bottom: 0.8rem;
	}
	.panel-header h4 {
		margin: 0;
		color: #222;
	}
	.muted {
		color: #6b7280;
	}

	.steps {
		display: flex;
		gap: 1rem;
		margin: 0.8rem 0 1.2rem;
	}
	.step {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		opacity: 0.6;
	}
	.step.done {
		opacity: 1;
	}
	.step span {
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		background: #f3f4f6;
		border-radius: 50%;
		font-weight: 700;
	}
	.step.done span {
		background: #6a82fb;
		color: #fff;
	}

	.grid-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.8rem;
	}

	.form-group {
		margin-bottom: 1rem;
		position: relative;
	}
	.form-group label {
		display: block;
		font-weight: 600;
		color: #333;
	}
	.form-control {
		width: 100%;
		border-radius: 14px;
		border: 1.5px solid #e5e7eb;
		font-size: 1rem;
		padding: 0.85rem 1.1rem;
		background: #f8fafc;
		transition: border-color 0.2s;
		outline: none;
		box-shadow: none;
	}
	.form-control:focus {
		border-color: #6a82fb;
		background: #fff;
		box-shadow: 0 0 0 2px #6a82fb22;
	}
	.form-control.is-invalid {
		border-color: #fc5c7d;
		background: #fff0f3;
	}
	.invalid-feedback {
		font-size: 0.93rem;
		color: #fc5c7d;
		margin-top: 0.2rem;
	}

	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-signup {
		width: 100%;
		background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
		color: #fff;
		border: none;
		border-radius: 14px;
		padding: 0.85rem 0;
		font-size: 1.05rem;
		font-weight: 700;
		margin-top: 0.4rem;
		transition: background 0.2s, box-shadow 0.2s;
		box-shadow: 0 2px 12px rgba(252, 92, 125, 0.11);
	}
	.btn-signup:hover,
	.btn-signup:focus {
		background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
	}

	.btn-ghost {
		width: 100%;
		background: #f3f4f6;
		border: 1px solid #e5e7eb;
		color: #111827;
		border-radius: 14px;
		padding: 0.85rem 0;
		font-size: 1.02rem;
		font-weight: 700;
		margin-top: 0.6rem;
	}

	.register-bottom {
		text-align: center;
		margin-top: 1.1rem;
		font-size: 1rem;
		color: #888;
	}
	.register-link {
		color: #6a82fb;
		font-weight: 600;
		margin-left: 0.3rem;
		text-decoration: none;
	}
	.register-link:hover {
		color: #fc5c7d;
		text-decoration: underline;
	}

	/* OTP */
	.otp-stage {
		text-align: center;
	}
	.otp-inputs {
		display: flex;
		justify-content: center;
		gap: 0.6rem;
		margin: 1rem 0;
	}
	.otp-box {
		width: 44px;
		height: 54px;
		text-align: center;
		font-size: 1.3rem;
		border: 1.5px solid #e5e7eb;
		border-radius: 12px;
	}
	.otp-actions {
		display: grid;
		gap: 0.6rem;
		margin-top: 0.6rem;
	}
	.success-stage {
		text-align: center;
		padding: 1rem 0;
	}
	.success-badge {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: #e8f7ee;
		color: #10b981;
		font-weight: 900;
		font-size: 1.3rem;
		margin: 0 auto 0.6rem;
	}

	@media (max-width: 900px) {
		.register-container {
			flex-direction: column;
			min-height: unset;
			width: 98vw;
			border-radius: 18px;
		}
		.register-left,
		.register-right {
			border-radius: 0;
			min-width: 100%;
			padding: 2.2rem 1.2rem;
		}
		.register-right {
			border-radius: 0 0 18px 18px;
		}
	}

	@media (max-width: 600px) {
		.register-container {
			flex-direction: column;
			min-height: unset;
			width: 100vw;
			border-radius: 0;
			box-shadow: none;
		}
		.register-left,
		.register-right {
			border-radius: 0;
			min-width: 100%;
			padding: 1.2rem 0.8rem;
		}
		.register-form {
			max-width: 100vw;
			padding: 0 0.2rem;
		}
		.grid-2 {
			grid-template-columns: 1fr;
		}
	}
</style>
