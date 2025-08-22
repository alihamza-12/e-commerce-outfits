<template>
	<div>
		<div class="text-2xl font-bold mb-2 text-gray-800">Seller Performance</div>
		<div class="text-gray-500 mb-6">
			Your sales, returns, and revenue overview
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<q-card
				class="shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500"
				style="background: linear-gradient(135deg, #e0f7fa 0%, #fff 100%)">
				<q-card-section class="flex flex-col items-center">
					<q-icon
						name="trending_up"
						color="green"
						size="40px"
						class="mb-2 animate-bounce" />
					<div class="text-lg font-semibold text-green-700 mb-1">
						Total Sales
					</div>
					<div class="text-3xl font-bold text-green-600">120</div>
					<div class="text-xs text-gray-500 mt-1">This month</div>
				</q-card-section>
			</q-card>
			<q-card
				class="shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-red-500"
				style="background: linear-gradient(135deg, #ffebee 0%, #fff 100%)">
				<q-card-section class="flex flex-col items-center">
					<q-icon
						name="undo"
						color="red"
						size="40px"
						class="mb-2 animate-spin-slow" />
					<div class="text-lg font-semibold text-red-700 mb-1">Returns</div>
					<div class="text-3xl font-bold text-red-600">5</div>
					<div class="text-xs text-gray-500 mt-1">This month</div>
				</q-card-section>
			</q-card>
			<q-card
				class="shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500"
				style="background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%)">
				<q-card-section class="flex flex-col items-center">
					<q-icon
						name="attach_money"
						color="blue"
						size="40px"
						class="mb-2 animate-pulse" />
					<div class="text-lg font-semibold text-blue-700 mb-1">Revenue</div>
					<div class="text-3xl font-bold text-blue-600">PKR 250,000</div>
					<div class="text-xs text-gray-500 mt-1">This month</div>
				</q-card-section>
			</q-card>
		</div>
		<q-card class="shadow-lg transition-all duration-300">
			<q-card-section>
				<div class="text-lg font-semibold mb-2 text-gray-700">
					Monthly Sales Chart
				</div>
				<div
					class="bg-gradient-to-r from-blue-100 to-blue-50 rounded h-40 flex items-center justify-center text-blue-400 font-bold text-xl animate-fade-in">
					[Chart Placeholder]
				</div>
			</q-card-section>
		</q-card>
	</div>
</template>

<style scoped>
	@keyframes spin-slow {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.animate-spin-slow {
		animation: spin-slow 2s linear infinite;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.animate-fade-in {
		animation: fade-in 1s ease;
	}
</style>
