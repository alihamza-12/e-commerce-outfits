<template>
	<div class="dashboard-root">
		<!-- Header -->
		<div class="dashboard-header">
			<div>
				<div class="dashboard-title">Seller Dashboard</div>
				<div class="dashboard-welcome">
					Welcome back, <span class="dashboard-name">{{ sellerName }}</span>
				</div>
			</div>
			<div class="dashboard-header-actions">
				<q-btn
					flat
					round
					icon="refresh"
					@click="refreshData"
					:loading="loading"
					class="dashboard-refresh-btn" />
				<div class="dashboard-updated">Last updated: {{ lastUpdated }}</div>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="dashboard-stats">
			<q-card
				v-for="stat in statsArr"
				:key="stat.title"
				class="dashboard-stat-card">
				<q-card-section class="dashboard-stat-section">
					<div class="dashboard-stat-icon" :style="{ background: stat.bg }">
						<q-icon :name="stat.icon" :color="stat.color" size="32px" />
					</div>
					<div>
						<div class="dashboard-stat-title">{{ stat.title }}</div>
						<div class="dashboard-stat-value" :class="stat.textColor">
							{{ stat.value }}
						</div>
						<div class="dashboard-stat-caption">{{ stat.caption }}</div>
					</div>
				</q-card-section>
			</q-card>
		</div>

		<!-- Charts Section -->
		<div class="dashboard-charts">
			<q-card class="dashboard-chart-card dashboard-chart-main">
				<q-card-section>
					<div class="dashboard-chart-header">
						<span>Revenue Overview</span>
						<q-btn
							flat
							dense
							icon="refresh"
							color="primary"
							@click="refreshChart"
							class="dashboard-refresh-btn" />
					</div>
					<div class="dashboard-chart-canvas">
						<canvas ref="revenueChart"></canvas>
					</div>
				</q-card-section>
			</q-card>
			<q-card class="dashboard-chart-card">
				<q-card-section>
					<div class="dashboard-chart-header">Sales Performance</div>
					<div class="dashboard-chart-canvas">
						<canvas ref="salesChart"></canvas>
					</div>
				</q-card-section>
			</q-card>
		</div>

		<!-- Recent Activity & Quick Actions -->
		<div class="dashboard-bottom">
			<!-- Recent Orders -->
			<q-card class="dashboard-bottom-card">
				<q-card-section>
					<div class="dashboard-bottom-title">Recent Orders</div>
					<q-list separator>
						<q-item
							v-for="order in recentOrders"
							:key="order.id"
							class="dashboard-list-item">
							<q-item-section>
								<q-item-label class="dashboard-list-label"
									>#{{ order.id }}</q-item-label
								>
								<q-item-label caption class="dashboard-list-caption">
									{{ order.customer }}
								</q-item-label>
							</q-item-section>
							<q-item-section side>
								<q-item-label class="dashboard-list-amount"
									>${{ order.amount }}</q-item-label
								>
								<q-badge
									:color="getStatusColor(order.status)"
									:label="order.status"
									class="q-ml-sm" />
							</q-item-section>
						</q-item>
					</q-list>
				</q-card-section>
			</q-card>

			<!-- Top Products -->
			<q-card class="dashboard-bottom-card">
				<q-card-section>
					<div class="dashboard-bottom-title">Top Products</div>
					<q-list separator>
						<q-item
							v-for="product in topProducts"
							:key="product.id"
							class="dashboard-list-item">
							<q-item-section avatar>
								<q-avatar>
									<img :src="product.image" :alt="product.name" />
								</q-avatar>
							</q-item-section>
							<q-item-section>
								<q-item-label class="dashboard-list-label">{{
									product.name
								}}</q-item-label>
								<q-item-label caption class="dashboard-list-caption">
									{{ product.sales }} sales
								</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-card-section>
			</q-card>

			<!-- Quick Actions -->
			<q-card class="dashboard-bottom-card">
				<q-card-section>
					<div class="dashboard-bottom-title">Quick Actions</div>
					<div class="dashboard-actions">
						<q-btn
							label="Add New Product"
							color="primary"
							class="dashboard-action-btn"
							to="/seller/products/add"
							icon="add_box"
							unelevated />
						<q-btn
							label="Manage Inventory"
							color="secondary"
							class="dashboard-action-btn"
							to="/seller/inventory"
							icon="inventory"
							unelevated />
						<q-btn
							label="View All Orders"
							color="accent"
							class="dashboard-action-btn"
							to="/seller/orders"
							icon="assignment"
							unelevated />
						<q-btn
							label="Account Settings"
							color="grey"
							class="dashboard-action-btn"
							to="/seller/settings"
							icon="settings"
							unelevated />
					</div>
				</q-card-section>
			</q-card>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, watch } from "vue";
	import { useRoute } from "vue-router";
	import { Chart, registerables } from "chart.js";

	Chart.register(...registerables);

	const sellerName = ref("Seller");
	const route = useRoute();

	function updateSellerName() {
		const name = localStorage.getItem("userName");
		if (name) {
			sellerName.value = name;
		} else {
			sellerName.value = "Seller";
		}
	}

	onMounted(() => {
		updateSellerName();
	});

	// Watch for route changes (when coming back to dashboard)
	watch(
		() => route.fullPath,
		() => {
			updateSellerName();
		}
	);

	const lastUpdated = ref(new Date().toLocaleString());
	const loading = ref(false);

	const statsArr = [
		{
			title: "Total Revenue",
			value: "$12,530.50",
			caption: "+15% from last month",
			icon: "payments",
			color: "blue-7",
			bg: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
			textColor: "text-blue-7",
		},
		{
			title: "Total Orders",
			value: "245",
			caption: "+8% from last month",
			icon: "shopping_cart",
			color: "green-6",
			bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
			textColor: "text-green-7",
		},
		{
			title: "Products",
			value: "42",
			caption: "3 new this week",
			icon: "inventory_2",
			color: "purple-6",
			bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
			textColor: "text-purple-7",
		},
		{
			title: "Pending Orders",
			value: "18",
			caption: "2 urgent",
			icon: "pending_actions",
			color: "orange-6",
			bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
			textColor: "text-orange-7",
		},
	];

	const recentOrders = ref([
		{
			id: "ORD-001",
			customer: "Alice Johnson",
			amount: 299.99,
			status: "processing",
		},
		{ id: "ORD-002", customer: "Bob Smith", amount: 199.5, status: "shipped" },
		{
			id: "ORD-003",
			customer: "Carol White",
			amount: 450.0,
			status: "delivered",
		},
		{
			id: "ORD-004",
			customer: "David Brown",
			amount: 89.99,
			status: "pending",
		},
	]);

	const topProducts = ref([
		{
			id: 1,
			name: "Wireless Headphones",
			image:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
			sales: 156,
		},
		{
			id: 2,
			name: "Smart Watch",
			image:
				"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
			sales: 89,
		},
		{
			id: 3,
			name: "Laptop Stand",
			image:
				"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=80&q=80",
			sales: 67,
		},
	]);

	const getStatusColor = (status) => {
		const colors = {
			pending: "orange",
			processing: "blue",
			shipped: "purple",
			delivered: "green",
		};
		return colors[status] || "grey";
	};

	const refreshData = () => {
		loading.value = true;
		setTimeout(() => {
			lastUpdated.value = new Date().toLocaleString();
			loading.value = false;
		}, 1000);
	};

	const revenueChart = ref(null);
	const salesChart = ref(null);
	let revenueChartInstance = null;
	let salesChartInstance = null;

	function refreshChart() {
		if (revenueChartInstance) {
			revenueChartInstance.data.datasets[0].data =
				revenueChartInstance.data.datasets[0].data.map(
					() => Math.floor(Math.random() * 5000) + 1000
				);
			revenueChartInstance.update();
		}
		if (salesChartInstance) {
			salesChartInstance.data.datasets[0].data =
				salesChartInstance.data.datasets[0].data.map(
					() => Math.floor(Math.random() * 100) + 20
				);
			salesChartInstance.update();
		}
	}

	onMounted(() => {
		if (revenueChart.value) {
			revenueChartInstance = new Chart(revenueChart.value, {
				type: "line",
				data: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
					datasets: [
						{
							label: "Revenue",
							data: [2000, 3500, 2800, 4200, 3800, 5100],
							borderColor: "#3b82f6",
							backgroundColor: "rgba(59, 130, 246, 0.12)",
							tension: 0.4,
							pointBackgroundColor: "#fff",
							pointBorderColor: "#3b82f6",
							pointRadius: 5,
							pointHoverRadius: 7,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						x: {
							grid: { color: "#e5e7eb" },
							ticks: { color: "#374151", font: { weight: "bold" } },
						},
						y: {
							grid: { color: "#e5e7eb" },
							ticks: { color: "#374151", font: { weight: "bold" } },
						},
					},
					animation: { duration: 900, easing: "easeOutQuart" },
				},
			});
		}
		if (salesChart.value) {
			salesChartInstance = new Chart(salesChart.value, {
				type: "bar",
				data: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
					datasets: [
						{
							label: "Sales",
							data: [40, 55, 48, 62, 53, 71],
							backgroundColor: "rgba(16, 185, 129, 0.18)",
							borderColor: "#10b981",
							borderWidth: 2,
							borderRadius: 8,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						x: {
							grid: { color: "#e5e7eb" },
							ticks: { color: "#374151", font: { weight: "bold" } },
						},
						y: {
							grid: { color: "#e5e7eb" },
							ticks: { color: "#374151", font: { weight: "bold" } },
						},
					},
					animation: { duration: 900, easing: "easeOutQuart" },
				},
			});
		}
	});
</script>

<style scoped>
	.dashboard-root {
		padding: 32px 24px 24px 24px;
		background: linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%);
		min-height: 100vh;
	}
	.dashboard-header {
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%);
		border-radius: 18px;
		box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.07);
		padding: 32px 28px 24px 28px;
		margin-bottom: 32px;
		align-items: flex-start;
	}
	@media (min-width: 768px) {
		.dashboard-header {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}
	.dashboard-title {
		font-size: 2.5rem;
		font-weight: 800;
		color: #1e293b;
		letter-spacing: -1px;
		margin-bottom: 2px;
		font-family: "Inter", "Segoe UI", Arial, sans-serif;
	}
	.dashboard-welcome {
		font-size: 1.1rem;
		color: #64748b;
	}
	.dashboard-name {
		color: #2563eb;
		font-weight: 600;
	}
	.dashboard-header-actions {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.dashboard-refresh-btn {
		background: #f1f5f9;
		border-radius: 50%;
		box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.08);
	}
	.dashboard-updated {
		font-size: 0.95rem;
		color: #64748b;
	}
	.dashboard-stats {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 18px;
		margin-bottom: 36px;
	}
	@media (min-width: 600px) {
		.dashboard-stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1024px) {
		.dashboard-stats {
			grid-template-columns: repeat(4, 1fr);
		}
	}
	.dashboard-stat-card {
		border-radius: 18px;
		box-shadow: 0 2px 12px 0 rgba(59, 130, 246, 0.06);
		transition: transform 0.2s, box-shadow 0.2s;
		cursor: pointer;
		background: #fff;
	}
	.dashboard-stat-card:hover {
		transform: translateY(-4px) scale(1.03);
		box-shadow: 0 8px 24px 0 rgba(59, 130, 246, 0.12);
	}
	.dashboard-stat-section {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 18px 16px;
	}
	.dashboard-stat-icon {
		width: 54px;
		height: 54px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 6px;
		box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.09);
	}
	.dashboard-stat-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: #334155;
		margin-bottom: 2px;
	}
	.dashboard-stat-value {
		font-size: 2.1rem;
		font-weight: 800;
		margin-bottom: 2px;
	}
	.dashboard-stat-caption {
		font-size: 0.95rem;
		color: #64748b;
	}
	.dashboard-charts {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		margin-bottom: 36px;
	}
	@media (min-width: 1024px) {
		.dashboard-charts {
			grid-template-columns: 2fr 1fr;
		}
	}
	.dashboard-chart-card {
		border-radius: 18px;
		background: #fff;
		box-shadow: 0 2px 12px 0 rgba(59, 130, 246, 0.06);
		min-height: 340px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.dashboard-chart-main {
		min-height: 340px;
	}
	.dashboard-chart-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 1.15rem;
		font-weight: 600;
		color: #334155;
		margin-bottom: 10px;
	}
	.dashboard-chart-canvas {
		height: 220px;
		width: 100%;
	}
	.dashboard-bottom {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		margin-bottom: 24px;
	}
	@media (min-width: 900px) {
		.dashboard-bottom {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.dashboard-bottom-card {
		border-radius: 18px;
		background: #fff;
		box-shadow: 0 2px 12px 0 rgba(59, 130, 246, 0.06);
		min-height: 260px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	.dashboard-bottom-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: #334155;
		margin-bottom: 12px;
	}
	.dashboard-list-item {
		border-radius: 10px;
		transition: background 0.15s;
	}
	.dashboard-list-item:hover {
		background: #f1f5f9;
	}
	.dashboard-list-label {
		font-weight: 600;
		color: #334155;
	}
	.dashboard-list-caption {
		font-size: 0.95rem;
		color: #64748b;
	}
	.dashboard-list-amount {
		font-weight: 700;
		color: #2563eb;
	}
	.dashboard-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 8px;
	}
	.dashboard-action-btn {
		border-radius: 10px;
		font-weight: 600;
		font-size: 1.05rem;
		box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.07);
		transition: transform 0.15s;
	}
	.dashboard-action-btn:hover {
		transform: scale(1.04);
	}
</style>
