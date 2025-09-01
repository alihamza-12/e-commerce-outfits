<template>
	<footer class="footer-container">
		<!-- Animated accent bar -->
		<div class="accent-bar">
			<div class="flowing-gradient"></div>
		</div>

		<!-- Main footer content -->
		<div class="footer-main">
			<!-- Background effects -->
			<div class="background-effects">
				<div class="floating-orb orb-1"></div>
				<div class="floating-orb orb-2"></div>
				<div class="grid-pattern"></div>
			</div>

			<div class="max-w-6xl mx-auto px-6 py-16 relative z-10">
				<!-- Top section - Brand and Newsletter -->
				<div class="grid lg:grid-cols-2 gap-12 mb-16">
					<!-- Brand section -->
					<div class="brand-section">
						<div class="brand-container">
							<q-icon name="style" class="brand-icon" />
							<div class="brand-content">
								<h1 class="brand-title">
									StyleHub
									<q-badge label="Beta" class="beta-badge" />
								</h1>
								<p class="brand-tagline">Where Style Meets Innovation</p>
							</div>
						</div>

						<p class="brand-description">
							Discover curated fashion collections that blend contemporary
							trends with timeless elegance. Premium quality, fast delivery, and
							easy returns.
						</p>

						<!-- Social links -->
						<div class="social-section">
							<h4 class="section-title">Follow Us</h4>
							<div class="social-grid">
								<div
									v-for="social in socialMedia"
									:key="social.platform"
									class="social-card">
									<q-icon :name="social.icon" class="social-icon" />
									<div class="social-info">
										<span class="social-platform">{{ social.platform }}</span>
										<span class="social-followers">{{ social.followers }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Newsletter section -->
					<div class="newsletter-section">
						<div class="newsletter-content">
							<div class="newsletter-header">
								<q-icon name="mail" class="newsletter-icon" />
								<div>
									<h3 class="newsletter-title">Stay Updated</h3>
									<p class="newsletter-subtitle">
										Get exclusive deals and style tips delivered to your inbox.
									</p>
								</div>
							</div>

							<div class="newsletter-form">
								<div class="input-group">
									<q-input
										v-model="email"
										type="email"
										placeholder="Enter your email"
										class="newsletter-input"
										outlined
										dense
										:error="!!emailError"
										:error-message="emailError">
										<template v-slot:prepend>
											<q-icon name="email" />
										</template>
									</q-input>
									<q-btn
										@click="handleSubscribe"
										:loading="isSubmitting"
										:disable="!isValidEmail"
										class="subscribe-btn"
										round
										icon="send"
										color="primary" />
								</div>

								<div v-if="successMessage" class="success-message">
									<q-icon name="check_circle" />
									{{ successMessage }}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Links section -->
				<div class="links-section">
					<div class="links-grid">
						<!-- Shop Categories -->
						<div class="link-column">
							<h4 class="column-title">
								<q-icon name="shopping_bag" />
								Shop
							</h4>
							<ul class="links-list">
								<li v-for="item in categories" :key="item.label">
									<router-link :to="item.href" class="footer-link">
										{{ item.label }}
										<q-badge
											v-if="item.badge"
											:label="item.badge"
											class="link-badge" />
									</router-link>
								</li>
							</ul>
						</div>

						<!-- Support -->
						<div class="link-column">
							<h4 class="column-title">
								<q-icon name="support_agent" />
								Support
							</h4>
							<ul class="links-list">
								<li v-for="item in support" :key="item.label">
									<router-link :to="item.href" class="footer-link">
										{{ item.label }}
									</router-link>
								</li>
							</ul>
						</div>

						<!-- Quick Links -->
						<div class="link-column">
							<h4 class="column-title">
								<q-icon name="link" />
								Quick Links
							</h4>
							<ul class="links-list">
								<li v-for="item in quickLinks" :key="item.label">
									<router-link :to="item.href" class="footer-link">
										{{ item.label }}
									</router-link>
								</li>
							</ul>
						</div>

						<!-- Contact Info -->
						<div class="link-column">
							<h4 class="column-title">
								<q-icon name="contact_phone" />
								Contact
							</h4>
							<div class="contact-info">
								<div class="contact-item">
									<q-icon name="location_on" class="contact-icon" />
									<span>Karachi, Pakistan</span>
								</div>
								<div class="contact-item">
									<q-icon name="phone" class="contact-icon" />
									<span>+92 (021) 555-STYLE</span>
								</div>
								<div class="contact-item">
									<q-icon name="email" class="contact-icon" />
									<span>hello@stylehub.com</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom bar -->
				<div class="divider"></div>

				<div class="bottom-bar">
					<div class="copyright">
						<span>© {{ currentYear }} StyleHub. All rights reserved.</span>
						<div class="legal-links">
							<router-link to="" class="legal-link"
								>Privacy</router-link
							>
							<router-link to="" class="legal-link">Terms</router-link>
							<router-link to="" class="legal-link"
								>Cookies</router-link
							>
						</div>
					</div>

					<div class="status-info">
						<div class="status-item">
							<div class="status-dot"></div>
							<span>All Systems Operational</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Floating scroll to top button -->
			<q-btn
				v-if="showScrollTop"
				@click="scrollToTop"
				round
				icon="keyboard_arrow_up"
				color="primary"
				class="scroll-top-btn"
				size="md" />
		</div>
	</footer>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";

	// Reactive data
	const email = ref("");
	const isSubmitting = ref(false);
	const emailError = ref("");
	const successMessage = ref("");
	const showScrollTop = ref(false);
	const currentYear = new Date().getFullYear();

	// Essential data - compact version
	const quickLinks = [
		{ label: "Shop", href: "" },
		{ label: "About", href: "" },
		{ label: "Contact", href: "" },
		{ label: "Support", href: "" },
	];

	const categories = [
		{ label: "Men's Fashion", href: "" },
		{ label: "Women's Collection", href: "" },
		{ label: "Kids & Teens", href: "" },
		{ label: "Sale Items", href: "", badge: "" },
	];

	const support = [
		{ label: "Help Center", href: "" },
		{ label: "Shipping Info", href: "" },
		{ label: "Returns", href: "" },
		{ label: "Size Guide", href: "" },
	];

	const socialMedia = [
		{ platform: "Instagram", icon: "camera_alt", followers: "2.5M" },
		{ platform: "Twitter", icon: "alternate_email", followers: "950K" },
		{ platform: "Facebook", icon: "facebook", followers: "1.2M" },
	];

	// Computed properties
	const isValidEmail = computed(() => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.value);
	});

	// Methods
	async function handleSubscribe() {
		emailError.value = "";
		successMessage.value = "";

		if (!isValidEmail.value) {
			emailError.value = "Please enter a valid email address";
			return;
		}

		isSubmitting.value = true;

		// Simulate API call
		setTimeout(() => {
			isSubmitting.value = false;
			successMessage.value = "Welcome to StyleHub! Check your inbox.";
			email.value = "";

			setTimeout(() => {
				successMessage.value = "";
			}, 4000);
		}, 1000);
	}

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	function handleScroll() {
		showScrollTop.value = window.scrollY > 300;
	}

	// Lifecycle
	onMounted(() => {
		window.addEventListener("scroll", handleScroll);
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", handleScroll);
	});
</script>

<style scoped>
	/* Import fonts */
	@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

	/* Root container */
	.footer-container {
		position: relative;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
		color: #e2e8f0;
		font-family: "Inter", sans-serif;
		overflow: hidden;
	}

	/* Animated accent bar */
	.accent-bar {
		height: 4px;
		position: relative;
		overflow: hidden;
	}

	.flowing-gradient {
		position: absolute;
		top: 0;
		left: -100%;
		width: 200%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			#3b82f6,
			#8b5cf6,
			#ec4899,
			transparent
		);
		animation: flow 3s linear infinite;
	}

	@keyframes flow {
		0% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(50%);
		}
	}

	/* Main footer */
	.footer-main {
		position: relative;
	}

	.background-effects {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.floating-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.2;
		animation: float 20s ease-in-out infinite;
	}

	.orb-1 {
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, #3b82f6, transparent);
		top: -150px;
		left: -150px;
	}

	.orb-2 {
		width: 250px;
		height: 250px;
		background: radial-gradient(circle, #ec4899, transparent);
		bottom: -125px;
		right: -125px;
		animation-delay: -10s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(20px, -20px);
		}
	}

	.grid-pattern {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(
				rgba(255, 255, 255, 0.02) 1px,
				transparent 1px
			),
			linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
		background-size: 40px 40px;
		animation: gridMove 30s linear infinite;
	}

	@keyframes gridMove {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(40px, 40px);
		}
	}

	/* Brand Section */
	.brand-section {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.brand-container {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.brand-icon {
		font-size: 42px;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.brand-content {
		flex: 1;
	}

	.brand-title {
		font-size: 2rem;
		font-weight: 800;
		background: linear-gradient(135deg, #ffffff, #60a5fa, #ec4899);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		line-height: 1.2;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.beta-badge {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
		color: white !important;
		font-size: 10px !important;
		font-weight: 700 !important;
		text-transform: uppercase !important;
		letter-spacing: 1px !important;
	}

	.brand-tagline {
		font-size: 14px;
		color: #94a3b8;
		font-weight: 500;
		margin-top: 4px;
	}

	.brand-description {
		font-size: 15px;
		line-height: 1.6;
		color: #64748b;
		max-width: 400px;
	}

	/* Social Section */
	.social-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: #f1f5f9;
	}

	.social-grid {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.social-card {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.social-card:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.social-icon {
		font-size: 18px;
		color: #60a5fa;
	}

	.social-info {
		display: flex;
		flex-direction: column;
	}

	.social-platform {
		font-size: 12px;
		font-weight: 600;
		color: #e2e8f0;
	}

	.social-followers {
		font-size: 10px;
		color: #94a3b8;
	}

	/* Newsletter Section */
	.newsletter-section {
		position: relative;
	}

	.newsletter-content {
		background: linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0.02)
		);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		padding: 32px;
		backdrop-filter: blur(10px);
	}

	.newsletter-header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	.newsletter-icon {
		font-size: 48px;
		color: #60a5fa;
		padding: 16px;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		border-radius: 16px;
		box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
	}

	.newsletter-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #f1f5f9;
		margin-bottom: 4px;
	}

	.newsletter-subtitle {
		font-size: 14px;
		color: #94a3b8;
		line-height: 1.5;
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.input-group {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	.newsletter-input {
		flex: 1;
	}

	.newsletter-input :deep(.q-field__control) {
		background: rgba(15, 23, 42, 0.8) !important;
		border-color: rgba(255, 255, 255, 0.1) !important;
		border-radius: 12px !important;
		color: #f1f5f9 !important;
	}

	.newsletter-input :deep(.q-field__control):hover {
		border-color: rgba(255, 255, 255, 0.2) !important;
	}

	.newsletter-input :deep(.q-field__control):focus-within {
		border-color: #3b82f6 !important;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
	}

	.newsletter-input :deep(input) {
		color: #f1f5f9 !important;
	}

	.newsletter-input :deep(input::placeholder) {
		color: #64748b !important;
	}

	.newsletter-input :deep(.q-icon) {
		color: #64748b !important;
	}

	.subscribe-btn {
		width: 48px !important;
		height: 48px !important;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
		box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
	}

	.subscribe-btn:hover {
		transform: translateY(-2px) !important;
		box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
	}

	.success-message {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #6ee7b7;
		font-size: 13px;
		font-weight: 500;
		padding: 8px 12px;
		background: rgba(16, 185, 129, 0.1);
		border-radius: 8px;
		border: 1px solid rgba(16, 185, 129, 0.2);
	}

	/* Links Section */
	.links-section {
		margin-bottom: 32px;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 32px;
	}

	.link-column {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.column-title {
		font-size: 16px;
		font-weight: 700;
		color: #f1f5f9;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.column-title .q-icon {
		font-size: 18px;
		color: #60a5fa;
	}

	.links-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.footer-link {
		color: #cbd5e1;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		padding: 6px 0;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
	}

	.footer-link::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, #3b82f6, #ec4899);
		transition: width 0.3s ease;
		transform: translateY(-50%);
	}

	.footer-link:hover {
		color: #ffffff;
		padding-left: 12px;
	}

	.footer-link:hover::before {
		width: 6px;
	}

	.link-badge {
		background: linear-gradient(135deg, #ef4444, #dc2626) !important;
		color: white !important;
		font-size: 9px !important;
		font-weight: 700 !important;
		text-transform: uppercase !important;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #cbd5e1;
	}

	.contact-icon {
		font-size: 16px;
		color: #60a5fa;
	}

	/* Bottom Bar */
	.divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.2),
			transparent
		);
		margin: 32px 0 24px;
	}

	.bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
		font-size: 13px;
	}

	.copyright {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		color: #94a3b8;
	}

	.legal-links {
		display: flex;
		gap: 12px;
	}

	.legal-link {
		color: #cbd5e1;
		text-decoration: none;
		padding: 4px 8px;
		border-radius: 6px;
		transition: all 0.3s ease;
	}

	.legal-link:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.05);
	}

	.status-info {
		display: flex;
		gap: 12px;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16px;
		font-size: 11px;
		font-weight: 600;
		color: #cbd5e1;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		background: #10b981;
		border-radius: 50%;
		animation: pulse-dot 2s ease-in-out infinite;
	}

	@keyframes pulse-dot {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Scroll to top button */
	.scroll-top-btn {
		position: fixed !important;
		bottom: 30px !important;
		right: 30px !important;
		z-index: 1000 !important;
		box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
		transition: all 0.3s ease !important;
	}

	.scroll-top-btn:hover {
		transform: translateY(-3px) !important;
		box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5) !important;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.footer-main .max-w-6xl {
			padding: 24px 16px;
		}

		.grid.lg\\:grid-cols-2 {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.links-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}

		.newsletter-content {
			padding: 24px 20px;
		}

		.newsletter-header {
			flex-direction: column;
			text-align: center;
			gap: 12px;
		}

		.input-group {
			flex-direction: column;
		}

		.brand-container {
			flex-direction: column;
			text-align: center;
			gap: 12px;
		}

		.brand-title {
			font-size: 1.5rem;
		}

		.social-grid {
			justify-content: center;
		}

		.bottom-bar {
			flex-direction: column;
			text-align: center;
			gap: 12px;
		}

		.scroll-top-btn {
			bottom: 20px !important;
			right: 20px !important;
		}
	}

	@media (max-width: 480px) {
		.links-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.newsletter-icon {
			font-size: 36px;
			padding: 12px;
		}

		.newsletter-title {
			font-size: 1.25rem;
		}

		.legal-links {
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	/* Smooth animations */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}

	/* Enhanced focus states */
	.footer-link:focus,
	.legal-link:focus,
	.subscribe-btn:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
		border-radius: 4px;
	}
</style>
