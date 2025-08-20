<template>
	<footer
		class="w-full bg-gradient-to-br from-[#23272b] to-[#2d3136] text-white font-inter shadow-[0_-2px_24px_0_rgba(0,0,0,0.25)] animate-fadeInFooter">
		<div class="max-w-7xl mx-auto px-4 py-10">
			<div
				class="flex flex-wrap gap-y-10 md:gap-y-0 md:flex-nowrap md:space-x-10">
				<!-- Brand & Description -->
				<div class="w-full md:w-1/4">
					<div
						class="text-3xl font-bold mb-2 tracking-tight animate-fadeInLeft">
						StyleHub
					</div>
					<div
						class="text-base text-gray-300 leading-relaxed animate-fadeInLeft delay-100">
						Your destination for fashion. Discover the latest trends and styles
						for everyone.
					</div>
				</div>
				<!-- Quick Links -->
				<div class="w-full md:w-1/4">
					<div
						class="text-lg font-semibold mb-3 text-yellow-400 animate-fadeInUp">
						Quick Links
					</div>
					<ul class="space-y-2">
						<li>
							<router-link
								to="/about"
								aria-label="About Us"
								class="footer-link-tw group"
								>About Us</router-link
							>
						</li>
						<li>
							<router-link
								to="/contact"
								aria-label="Contact"
								class="footer-link-tw group"
								>Contact</router-link
							>
						</li>
						<li>
							<router-link to="/faq" aria-label="FAQ" class="footer-link-tw group"
								>FAQ</router-link
							>
						</li>
						<li>
							<router-link
								to="/shipping-returns"
								aria-label="Shipping and Returns"
								class="footer-link-tw group"
								>Shipping & Returns</router-link
							>
						</li>
					</ul>
				</div>
				<!-- Categories -->
				<div class="w-full md:w-1/4">
					<div
						class="text-lg font-semibold mb-3 text-yellow-400 animate-fadeInUp">
						Categories
					</div>
					<ul class="space-y-2">
						<li>
							<router-link
								to="/category/women"
								aria-label="Women's Fashion"
								class="footer-link-tw group"
								>Women's Fashion</router-link
							>
						</li>
						<li>
							<router-link
								to="/category/men"
								aria-label="Men's Fashion"
								class="footer-link-tw group"
								>Men's Fashion</router-link
							>
						</li>
						<li>
							<router-link
								to="/category/kids"
								aria-label="Kids' Fashion"
								class="footer-link-tw group"
								>Kids' Fashion</router-link
							>
						</li>
						<li>
							<router-link
								to="/category/accessories"
								aria-label="Accessories"
								class="footer-link-tw group"
								>Accessories</router-link
							>
						</li>
					</ul>
				</div>
				<!-- Social & Newsletter -->
				<div class="w-full md:w-1/4">
					<div
						class="text-lg font-semibold mb-3 text-yellow-400 animate-fadeInUp">
						Follow Us
					</div>
					<div class="flex space-x-3 mb-4">
						<a
							href="https://facebook.com"
							target="_blank"
							aria-label="Facebook"
							class="footer-social-tw bg-[#1877f2] hover:bg-[#145db2] group">
							<i class="mdi mdi-facebook text-xl group-hover:scale-110 transition-transform"></i>
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							aria-label="Instagram"
							class="footer-social-tw bg-gradient-to-tr from-yellow-300 via-pink-500 to-indigo-600 hover:brightness-110 group">
							<i class="mdi mdi-instagram text-xl group-hover:scale-110 transition-transform"></i>
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							aria-label="Twitter"
							class="footer-social-tw bg-[#1da1f2] hover:bg-[#0d8ddb] group">
							<i class="mdi mdi-twitter text-xl group-hover:scale-110 transition-transform"></i>
						</a>
						<a
							href="https://youtube.com"
							target="_blank"
							aria-label="YouTube"
							class="footer-social-tw bg-[#ff0000] hover:bg-[#b80000] group">
							<i class="mdi mdi-youtube text-xl group-hover:scale-110 transition-transform"></i>
						</a>
					</div>
					<div class="text-gray-400 text-sm mb-2">
						Subscribe to our newsletter for updates
					</div>
					<form
						@submit.prevent="subscribe"
						class="flex items-center space-x-2 animate-fadeInUp delay-200">
						<input
							v-model="email"
							type="email"
							aria-label="Newsletter Email"
							placeholder="Enter your email"
							class="flex-1 px-3 py-2 rounded-l bg-[#292d32] text-white placeholder-gray-400 border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition-all duration-300 outline-none hover:border-gray-500"
							required />
						<button
							type="submit"
							:disabled="!email || !/.+@.+\..+/.test(email)"
							aria-label="Subscribe"
							class="footer-newsletter-btn-tw group">
							<i class="mdi mdi-send group-hover:translate-x-0.5 transition-transform"></i>
						</button>
					</form>
				</div>
			</div>
			<div
				class="border-t border-gray-700 my-8 opacity-30 animate-fadeIn"></div>
			<div
				class="text-center text-gray-400 text-sm tracking-wide animate-fadeInUp delay-300">
				&copy; {{ new Date().getFullYear() }} StyleHub. All rights reserved.
			</div>
		</div>
	</footer>
</template>

<script>
	export default {
		name: "Footer",
		data() {
			return {
				email: "",
			};
		},
		methods: {
			subscribe() {
				if (this.email && /.+@.+\..+/.test(this.email)) {
					this.$q.notify({
						message: "Thank you for subscribing!",
						color: "positive",
						icon: "check_circle",
					});
					this.email = "";
				} else {
					this.$q.notify({
						message: "Please enter a valid email address.",
						color: "negative",
						icon: "error",
					});
				}
			},
		},
	};
</script>

<!-- Tailwind + Animations + Custom Classes -->
<style scoped>
@import url("https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css");

.font-inter {
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

/* Footer container animation */
.animate-fadeInFooter {
  animation: fadeInFooter 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeInFooter {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}

/* Section titles */
.text-lg, .text-3xl {
  letter-spacing: -0.5px;
}
.text-yellow-400 {
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Footer links */
.footer-link-tw {
  @apply text-gray-200 transition-all duration-300 rounded px-2 py-1 relative;
  font-size: 1rem;
  font-weight: 500;
  display: inline-block;
  animation: fadeInUp 1.2s;
}
.footer-link-tw::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffd600, transparent);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}
.footer-link-tw:hover, .footer-link-tw:focus {
  @apply text-yellow-300;
  transform: translateY(-2px);
}
.footer-link-tw:hover::before, .footer-link-tw:focus::before {
  width: 100%;
}

/* Social icons */
.footer-social-tw {
  @apply flex items-center justify-center w-10 h-10 rounded-full text-white shadow-lg transition-all duration-300;
  font-size: 1.5rem;
  animation: popIn 1.2s;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}
.footer-social-tw::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}
.footer-social-tw:hover {
  @apply scale-110 shadow-xl;
  border-color: #ffd600;
  box-shadow: 0 4px 16px rgba(255, 214, 0, 0.3);
}
.footer-social-tw:hover::before {
  left: 100%;
}
/* Instagram gradient fix */
.footer-social-tw.bg-gradient-to-tr {
  background: radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
}

/* Newsletter input and button */
.footer-newsletter-btn-tw {
  @apply bg-yellow-400 text-[#23272b] px-4 py-2 rounded-r font-bold transition-all duration-300;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
}
.footer-newsletter-btn-tw::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: all 0.6s ease;
}
.footer-newsletter-btn-tw:hover:not(:disabled) {
  @apply bg-yellow-300;
  box-shadow: 0 4px 16px rgba(255, 214, 0, 0.4);
  transform: translateY(-2px);
}
.footer-newsletter-btn-tw:hover:not(:disabled)::before {
  left: 100%;
}
.footer-newsletter-btn-tw:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Newsletter input focus */
input[type="email"].flex-1:focus {
  border-color: #ffd600 !important;
  box-shadow: 0 0 0 2px rgba(255, 214, 0, 0.3);
  background: #23272b;
  color: #fff;
}

/* Animations */
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-30px);}
  to { opacity: 1; transform: translateX(0);}
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.7);}
  to { opacity: 1; transform: scale(1);}
}
.animate-fadeInLeft { animation: fadeInLeft 1s;}
.animate-fadeInUp { animation: fadeInUp 1.2s;}
.animate-popIn { animation: popIn 1.2s;}

/* Divider animation */
.border-t.animate-fadeIn {
  animation: fadeIn 1.5s;
}
@keyframes fadeIn {
  from { opacity: 0;}
  to { opacity: 0.3;}
}

/* Copyright text */
.text-center.text-gray-400 {
  color: #bdbdbd;
  letter-spacing: 0.5px;
  font-size: 0.97rem;
  animation: fadeInUp 1.6s;
}

/* Responsive improvements */
@media (max-width: 1023px) {
  .flex-nowrap { flex-wrap: wrap !important; }
  .md\:space-x-10 > :not([hidden]) ~ :not([hidden]) { margin-left: 0 !important; }
  .footer-newsletter-btn-tw { border-radius: 0 0.5rem 0.5rem 0; }
}
@media (max-width: 599px) {
  .text-3xl { font-size: 1.4rem; }
  .text-lg { font-size: 1rem; }
  .text-base { font-size: 0.95rem; }
  .footer-link-tw { font-size: 0.95rem; }
  .footer-social-tw { width: 2.25rem; height: 2.25rem; font-size: 1.1rem; }
}
</style>