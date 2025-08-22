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
					Welcome back! Login to manage your style, shop, and more.
				</p>
				<button class="btn-get-started" @click="scrollToForm">
					GET STARTED
				</button>
			</div>
			<!-- Right Side (Form) -->
			<div class="register-right">
				<form
					ref="formRef"
					@submit.prevent="handleLogin"
					class="register-form"
					novalidate>
					<h3 class="register-title">Log In</h3>
					<p class="register-subtitle">
						Please login to your account to continue.
					</p>
					<!-- Email -->
					<div class="form-group">
						<label for="email">Email Address</label>
						<input
							id="email"
							type="email"
							v-model.trim="email"
							class="form-control"
							placeholder="Enter your email"
							:class="{ 'is-invalid': formSubmitted && !validEmail }"
							required
							autocomplete="email" />
						<div class="invalid-feedback" v-if="formSubmitted && !validEmail">
							Please provide a valid email.
						</div>
					</div>
					<!-- Password -->
					<div class="form-group">
						<label for="password">Password</label>
						<input
							id="password"
							type="password"
							v-model="password"
							class="form-control"
							placeholder="Enter your password"
							:class="{ 'is-invalid': formSubmitted && !password }"
							required
							autocomplete="current-password" />
						<div class="invalid-feedback" v-if="formSubmitted && !password">
							Please enter your password.
						</div>
					</div>
					<button type="submit" class="btn-signup" :disabled="loading">
						<span
							v-if="loading"
							class="spinner-border spinner-border-sm me-2"></span>
						LOG IN
					</button>
					<div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
						{{ errorMessage }}
					</div>
					<div class="register-bottom">
						<span>Don't have an account?</span>
						<router-link to="/registeruser" class="register-link"
							>Sign up</router-link
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useRouter } from "vue-router";
	import { useAuthStore } from "@/stores/auth";

	const router = useRouter();
	const authStore = useAuthStore();
	const email = ref("");
	const password = ref("");
	const loading = ref(false);
	const formRef = ref(null);
	const formSubmitted = ref(false);
	const validEmail = computed(() => /\S+@\S+\.\S+/.test(email.value));

	const scrollToForm = () => {
		if (formRef.value) {
			formRef.value.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleLogin = async () => {
		formSubmitted.value = true;
		const form = formRef.value;
		if (!form.checkValidity() || !validEmail.value) {
			form.classList.add("was-validated");
			return;
		}
		loading.value = true;
		try {
			// Use auth store for unified login
			const response = await authStore.login({
				email: email.value,
				password: password.value,
			});

			if (response.success) {
				// Store user details in localStorage
				localStorage.setItem("userName", response.user.name);
				localStorage.setItem("userRole", response.user.role);

				// Redirect based on role from auth store
				const role = authStore.role;
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
			} else {
				alert(response.message || "Invalid credentials. Please try again.");
			}
		} catch (error) {
			alert(error.message || "Login failed. Please try again.");
		} finally {
			loading.value = false;
		}
	};
</script>

<style scoped>
	@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

	.register-outer {
		min-height: 100vh;
		background: linear-gradient(120deg, #7f9cf5 0%, #a7bfe8 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: "Inter", sans-serif;
	}

	.register-container {
		display: flex;
		width: 950px;
		max-width: 98vw;
		min-height: 600px;
		background: transparent;
		border-radius: 28px;
		box-shadow: 0 8px 40px 0 rgba(31, 38, 135, 0.13);
		overflow: hidden;
	}

	.register-left {
		flex: 1.1;
		background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem 3rem 2.5rem;
		position: relative;
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
		padding: 0.85rem 2.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		box-shadow: 0 2px 12px rgba(67, 233, 123, 0.13);
		transition: background 0.2s, color 0.2s, box-shadow 0.2s;
		margin-top: 1.2rem;
		margin-bottom: 1.2rem;
		cursor: pointer;
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
		padding: 2.5rem 2.5rem 2.5rem 2rem;
		border-radius: 0 28px 28px 0;
		min-width: 340px;
	}

	.register-form {
		width: 100%;
		max-width: 370px;
		margin: 0 auto;
		background: transparent;
	}

	.register-title {
		font-size: 2rem;
		font-weight: 700;
		color: #6a82fb;
		margin-bottom: 0.3rem;
		text-align: left;
	}

	.register-subtitle {
		font-size: 1.04rem;
		color: #888;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.form-group {
		margin-bottom: 1.1rem;
		position: relative;
	}

	.form-control {
		width: 100%;
		border-radius: 18px;
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

	.form-control.is-invalid,
	.was-validated .form-control:invalid {
		border-color: #fc5c7d;
		background: #fff0f3;
	}

	.invalid-feedback {
		font-size: 0.93rem;
		color: #fc5c7d;
		margin-top: 0.2rem;
	}

	.btn-signup {
		width: 100%;
		background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
		color: #fff;
		border: none;
		border-radius: 18px;
		padding: 0.85rem 0;
		font-size: 1.13rem;
		font-weight: 600;
		margin-top: 0.7rem;
		margin-bottom: 0.5rem;
		transition: background 0.2s, box-shadow 0.2s;
		box-shadow: 0 2px 12px rgba(252, 92, 125, 0.11);
	}
	.btn-signup:hover,
	.btn-signup:focus {
		background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
		color: #fff;
	}

	.register-bottom {
		text-align: center;
		margin-top: 1.1rem;
	}
	.register-link {
		color: #6a82fb;
		text-decoration: underline;
		padding: 0 0.2rem;
	}

	@media (max-width: 900px) {
		.register-form {
			max-width: 100vw;
			padding: 0 0.2rem;
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
			padding: 1.2rem 0.5rem;
		}
		.register-form {
			max-width: 100vw;
			padding: 0 0.2rem;
		}
	}

	/* Arrow alignment for select */
	.form-control[type="text"],
	.form-control[type="email"],
	.form-control[type="password"],
	.form-control[type="select"],
	.form-control,
	select.form-control {
		background-position: right 2rem center;
	}
	select.form-control {
		background-position: right 1.2rem center;
	}
</style>
