<template>
	<div class="order-mgmt-root">
		<!-- Header -->
		<div class="order-mgmt-header">
			<div>
				<div class="order-mgmt-title">Order Management</div>
				<div class="order-mgmt-subtitle">
					Manage, ship, cancel, and track your orders
				</div>
			</div>
			<q-input
				dense
				outlined
				debounce="300"
				v-model="search"
				placeholder="Search by order/customer"
				class="order-mgmt-search"
				clearable
				:input-style="{ minWidth: '220px' }"
				@update:model-value="onSearch" />
		</div>

		<!-- Filters -->
		<div class="order-mgmt-filters q-mb-md">
			<q-select
				v-model="statusFilter"
				:options="statusOptions"
				label="Status"
				dense
				outlined
				clearable
				class="order-mgmt-filter"
				@update:model-value="onFilter" />
			<q-select
				v-model="sortBy"
				:options="sortOptions"
				label="Sort By"
				dense
				outlined
				class="order-mgmt-filter"
				@update:model-value="onSort" />
		</div>

		<!-- Orders Table -->
		<transition-group name="fade-list" tag="div">
			<q-card class="order-mgmt-table">
				<q-table
					:rows="pagedOrders"
					:columns="columns"
					row-key="id"
					flat
					bordered
					:loading="loading"
					:pagination.sync="pagination"
					:rows-per-page-options="[5, 10, 20]"
					:no-data-label="noDataLabel"
					:no-results-label="noResultsLabel"
					@row-click="openOrder"
					:selected.sync="selected"
					selection="multiple"
					:dense="$q.screen.lt.md">
					<template v-slot:body-cell-status="props">
						<q-td :props="props">
							<q-badge
								:color="getStatusColor(props.row.status)"
								:label="props.row.status"
								class="text-xs px-2 py-1 rounded" />
						</q-td>
					</template>
					<template v-slot:body-cell-actions="props">
						<q-td :props="props">
							<q-btn
								v-if="props.row.status === 'processing'"
								color="primary"
								size="sm"
								icon="local_shipping"
								flat
								round
								@click.stop="confirmShip(props.row)"
								:disable="props.row.status !== 'processing'"
								:title="'Ship Order'" />
							<q-btn
								v-if="['processing', 'shipped'].includes(props.row.status)"
								color="negative"
								size="sm"
								icon="cancel"
								flat
								round
								@click.stop="confirmCancel(props.row)"
								:disable="props.row.status === 'cancelled'"
								:title="'Cancel Order'" />
							<q-btn
								v-if="props.row.status === 'delivered'"
								color="accent"
								size="sm"
								icon="undo"
								flat
								round
								@click.stop="confirmReturn(props.row)"
								:title="'Return Order'" />
							<q-btn
								color="info"
								size="sm"
								icon="visibility"
								flat
								round
								@click.stop="openOrder(props.row)"
								:title="'View Details'" />
						</q-td>
					</template>
				</q-table>
			</q-card>
		</transition-group>

		<!-- Pagination -->
		<div class="flex justify-end q-mt-md">
			<q-pagination
				v-model="pagination.page"
				:max="maxPage"
				color="primary"
				input
				max-pages="8"
				boundary-numbers
				size="md" />
		</div>

		<!-- Order Details Drawer -->
		<q-drawer
			v-model="drawer"
			side="right"
			overlay
			width="420"
			class="order-details-drawer"
			:breakpoint="500"
			:content-class="'bg-white'">
			<q-scroll-area style="height: 100%">
				<div v-if="selectedOrder" class="q-pa-md">
					<div class="flex items-center justify-between mb-2">
						<div class="order-details-title flex items-center">
							<q-icon name="receipt_long" class="q-mr-sm" />
							<span>Order #{{ selectedOrder.id }}</span>
						</div>
						<q-btn
							icon="close"
							flat
							round
							color="grey-7"
							@click="drawer = false"
							size="md"
							class="ml-auto" />
					</div>
					<q-separator class="my-2" />
					<div class="order-details-section">
						<div class="order-details-label">Customer:</div>
						<div class="order-details-value">{{ selectedOrder.customer }}</div>
					</div>
					<div class="order-details-section">
						<div class="order-details-label">Amount:</div>
						<div class="order-details-value">${{ selectedOrder.amount }}</div>
					</div>
					<div class="order-details-section">
						<div class="order-details-label">Status:</div>
						<q-badge
							:color="getStatusColor(selectedOrder.status)"
							:label="selectedOrder.status"
							class="text-xs px-2 py-1 rounded" />
					</div>
					<div class="order-details-section">
						<div class="order-details-label">Placed:</div>
						<div class="order-details-value">{{ selectedOrder.placed }}</div>
					</div>
					<div class="order-details-section">
						<div class="order-details-label">Shipping Address:</div>
						<div class="order-details-value">{{ selectedOrder.address }}</div>
					</div>
					<div class="order-details-section">
						<div class="order-details-label">Products:</div>
						<q-list dense>
							<q-item v-for="(item, idx) in selectedOrder.items" :key="idx">
								<q-item-section avatar>
									<q-avatar>
										<img :src="item.image" :alt="item.name" />
									</q-avatar>
								</q-item-section>
								<q-item-section>
									<q-item-label>{{ item.name }}</q-item-label>
									<q-item-label caption>{{ item.variant }}</q-item-label>
								</q-item-section>
								<q-item-section side>
									<q-item-label
										>${{ item.price }} x {{ item.qty }}</q-item-label
									>
								</q-item-section>
							</q-item>
						</q-list>
					</div>
					<div class="order-details-section">
						<div class="order-details-label">Order Timeline:</div>
						<q-timeline color="primary" layout="dense">
							<q-timeline-entry
								v-for="(event, idx) in selectedOrder.timeline"
								:key="idx"
								:title="event.title"
								:subtitle="event.time"
								:icon="event.icon"
								:color="event.color">
								<div>{{ event.desc }}</div>
							</q-timeline-entry>
						</q-timeline>
					</div>
				</div>
			</q-scroll-area>
		</q-drawer>

		<!-- Confirm Dialogs -->
		<q-dialog v-model="confirmDialog.show">
			<q-card class="rounded-xl shadow-lg">
				<q-card-section>
					<div class="text-h6">{{ confirmDialog.title }}</div>
					<div>{{ confirmDialog.message }}</div>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn flat label="Cancel" color="grey" v-close-popup />
					<q-btn
						flat
						:label="confirmDialog.actionLabel"
						:color="confirmDialog.actionColor"
						@click="confirmDialog.action"
						v-close-popup />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script setup>
	import { ref, computed, watch } from "vue";
	import { useQuasar } from "quasar";

	// Demo data
	const orders = ref([
		{
			id: "ORD-001",
			customer: "Alice Johnson",
			amount: 299.99,
			status: "processing",
			placed: "2025-08-18 14:22",
			address: "123 Main St, New York, NY",
			items: [
				{
					name: "Wireless Headphones",
					variant: "Black",
					price: 99.99,
					qty: 2,
					image:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
				},
				{
					name: "Smart Watch",
					variant: "Silver",
					price: 99.99,
					qty: 1,
					image:
						"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
				},
			],
			timeline: [
				{
					title: "Order Placed",
					time: "2025-08-18 14:22",
					icon: "shopping_cart",
					color: "primary",
					desc: "Order received.",
				},
				{
					title: "Processing",
					time: "2025-08-18 15:00",
					icon: "hourglass_empty",
					color: "blue",
					desc: "Preparing your order.",
				},
			],
		},
		{
			id: "ORD-002",
			customer: "Bob Smith",
			amount: 199.5,
			status: "shipped",
			placed: "2025-08-17 10:12",
			address: "456 Elm St, Los Angeles, CA",
			items: [
				{
					name: "Laptop Stand",
					variant: "Aluminum",
					price: 49.75,
					qty: 4,
					image:
						"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=80&q=80",
				},
			],
			timeline: [
				{
					title: "Order Placed",
					time: "2025-08-17 10:12",
					icon: "shopping_cart",
					color: "primary",
					desc: "Order received.",
				},
				{
					title: "Processing",
					time: "2025-08-17 11:00",
					icon: "hourglass_empty",
					color: "blue",
					desc: "Preparing your order.",
				},
				{
					title: "Shipped",
					time: "2025-08-17 16:00",
					icon: "local_shipping",
					color: "green",
					desc: "Order shipped.",
				},
			],
		},
		{
			id: "ORD-003",
			customer: "Carol White",
			amount: 450.0,
			status: "delivered",
			placed: "2025-08-15 09:30",
			address: "789 Oak St, Chicago, IL",
			items: [
				{
					name: "Bluetooth Speaker",
					variant: "Blue",
					price: 150.0,
					qty: 3,
					image:
						"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
				},
			],
			timeline: [
				{
					title: "Order Placed",
					time: "2025-08-15 09:30",
					icon: "shopping_cart",
					color: "primary",
					desc: "Order received.",
				},
				{
					title: "Processing",
					time: "2025-08-15 10:00",
					icon: "hourglass_empty",
					color: "blue",
					desc: "Preparing your order.",
				},
				{
					title: "Shipped",
					time: "2025-08-15 13:00",
					icon: "local_shipping",
					color: "green",
					desc: "Order shipped.",
				},
				{
					title: "Delivered",
					time: "2025-08-16 11:00",
					icon: "check_circle",
					color: "positive",
					desc: "Order delivered.",
				},
			],
		},
		{
			id: "ORD-004",
			customer: "David Brown",
			amount: 89.99,
			status: "pending",
			placed: "2025-08-20 12:45",
			address: "321 Pine St, Houston, TX",
			items: [
				{
					name: "USB-C Hub",
					variant: "6-in-1",
					price: 89.99,
					qty: 1,
					image:
						"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=80&q=80",
				},
			],
			timeline: [
				{
					title: "Order Placed",
					time: "2025-08-20 12:45",
					icon: "shopping_cart",
					color: "primary",
					desc: "Order received.",
				},
			],
		},
	]);

	const $q = useQuasar();
	const loading = ref(false);
	const search = ref("");
	const statusFilter = ref(null);
	const sortBy = ref("Newest");
	const selected = ref([]);
	const drawer = ref(false);
	const selectedOrder = ref(null);

	const pagination = ref({
		page: 1,
		rowsPerPage: 5,
	});
	const columns = [
		{
			name: "id",
			label: "Order ID",
			field: "id",
			align: "left",
			sortable: true,
		},
		{
			name: "customer",
			label: "Customer",
			field: "customer",
			align: "left",
			sortable: true,
		},
		{
			name: "amount",
			label: "Amount",
			field: "amount",
			align: "right",
			sortable: true,
			format: (val) => `$${val}`,
		},
		{
			name: "status",
			label: "Status",
			field: "status",
			align: "left",
			sortable: true,
		},
		{
			name: "placed",
			label: "Placed",
			field: "placed",
			align: "left",
			sortable: true,
		},
		{ name: "actions", label: "Actions", field: "actions", align: "center" },
	];

	const statusOptions = [
		"All",
		"pending",
		"processing",
		"shipped",
		"delivered",
		"cancelled",
		"returned",
	];
	const sortOptions = [
		"Newest",
		"Oldest",
		"Amount (High-Low)",
		"Amount (Low-High)",
	];

	const noDataLabel = "No orders yet.";
	const noResultsLabel = "No orders match your search/filter.";

	const filteredOrders = computed(() => {
		let arr = orders.value;
		if (search.value) {
			const s = search.value.toLowerCase();
			arr = arr.filter(
				(o) =>
					o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s)
			);
		}
		if (statusFilter.value && statusFilter.value !== "All") {
			arr = arr.filter((o) => o.status === statusFilter.value);
		}
		// Sorting
		if (sortBy.value === "Newest") {
			arr = arr.slice().sort((a, b) => b.placed.localeCompare(a.placed));
		} else if (sortBy.value === "Oldest") {
			arr = arr.slice().sort((a, b) => a.placed.localeCompare(b.placed));
		} else if (sortBy.value === "Amount (High-Low)") {
			arr = arr.slice().sort((a, b) => b.amount - a.amount);
		} else if (sortBy.value === "Amount (Low-High)") {
			arr = arr.slice().sort((a, b) => a.amount - b.amount);
		}
		return arr;
	});

	const pagedOrders = computed(() => {
		const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
		return filteredOrders.value.slice(
			start,
			start + pagination.value.rowsPerPage
		);
	});
	const maxPage = computed(() =>
		Math.ceil(filteredOrders.value.length / pagination.value.rowsPerPage)
	);

	function getStatusColor(status) {
		switch (status) {
			case "pending":
				return "orange";
			case "processing":
				return "blue";
			case "shipped":
				return "purple";
			case "delivered":
				return "positive";
			case "cancelled":
				return "negative";
			case "returned":
				return "accent";
			default:
				return "grey";
		}
	}

	function openOrder(order) {
		selectedOrder.value = order;
		drawer.value = true;
	}

	function onSearch() {
		pagination.value.page = 1;
	}
	function onFilter() {
		pagination.value.page = 1;
	}
	function onSort() {
		pagination.value.page = 1;
	}

	// Confirm dialogs
	const confirmDialog = ref({
		show: false,
		title: "",
		message: "",
		actionLabel: "",
		actionColor: "",
		action: null,
	});

	function confirmShip(order) {
		confirmDialog.value = {
			show: true,
			title: "Ship Order",
			message: `Are you sure you want to mark order #${order.id} as shipped?`,
			actionLabel: "Ship",
			actionColor: "primary",
			action: () => shipOrder(order),
		};
	}
	function confirmCancel(order) {
		confirmDialog.value = {
			show: true,
			title: "Cancel Order",
			message: `Are you sure you want to cancel order #${order.id}?`,
			actionLabel: "Cancel",
			actionColor: "negative",
			action: () => cancelOrder(order),
		};
	}
	function confirmReturn(order) {
		confirmDialog.value = {
			show: true,
			title: "Return Order",
			message: `Are you sure you want to mark order #${order.id} as returned?`,
			actionLabel: "Return",
			actionColor: "accent",
			action: () => returnOrder(order),
		};
	}

	// Actions
	function shipOrder(order) {
		loading.value = true;
		setTimeout(() => {
			order.status = "shipped";
			order.timeline.push({
				title: "Shipped",
				time: new Date().toLocaleString(),
				icon: "local_shipping",
				color: "green",
				desc: "Order shipped.",
			});
			$q.notify({
				type: "positive",
				message: `Order #${order.id} marked as shipped.`,
			});
			loading.value = false;
		}, 900);
	}
	function cancelOrder(order) {
		loading.value = true;
		setTimeout(() => {
			order.status = "cancelled";
			order.timeline.push({
				title: "Cancelled",
				time: new Date().toLocaleString(),
				icon: "cancel",
				color: "negative",
				desc: "Order cancelled.",
			});
			$q.notify({ type: "negative", message: `Order #${order.id} cancelled.` });
			loading.value = false;
		}, 900);
	}
	function returnOrder(order) {
		loading.value = true;
		setTimeout(() => {
			order.status = "returned";
			order.timeline.push({
				title: "Returned",
				time: new Date().toLocaleString(),
				icon: "undo",
				color: "accent",
				desc: "Order returned.",
			});
			$q.notify({
				type: "accent",
				message: `Order #${order.id} marked as returned.`,
			});
			loading.value = false;
		}, 900);
	}
</script>

<style scoped>
	.order-mgmt-root {
		padding: 32px 18px 18px 18px;
		background: linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%);
		min-height: 100vh;
	}
	.order-mgmt-header {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-start;
		margin-bottom: 18px;
	}
	@media (min-width: 600px) {
		.order-mgmt-header {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}
	.order-mgmt-title {
		font-size: 2.1rem;
		font-weight: 800;
		color: #1e293b;
		letter-spacing: -1px;
		font-family: "Inter", "Segoe UI", Arial, sans-serif;
	}
	.order-mgmt-subtitle {
		font-size: 1.1rem;
		color: #64748b;
	}
	.order-mgmt-search {
		min-width: 220px;
	}
	.order-mgmt-filters {
		display: flex;
		gap: 18px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}
	.order-mgmt-filter {
		min-width: 180px;
	}
	.order-mgmt-table {
		border-radius: 22px;
		background: #fff;
		box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.1);
		margin-bottom: 12px;
		transition: box-shadow 0.2s;
	}
	.order-mgmt-table:hover {
		box-shadow: 0 12px 32px 0 rgba(59, 130, 246, 0.18);
	}
	.order-details-drawer {
		box-shadow: -2px 0 24px 0 rgba(59, 130, 246, 0.13);
		border-top-left-radius: 18px;
		border-bottom-left-radius: 18px;
	}
	.order-details-title {
		font-size: 1.3rem;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
	}
	.order-details-section {
		margin-bottom: 14px;
	}
	.order-details-label {
		font-weight: 600;
		color: #334155;
		font-size: 1.05rem;
	}
	.order-details-value {
		color: #2563eb;
		font-size: 1.05rem;
	}
	.fade-list-enter-active,
	.fade-list-leave-active {
		transition: all 0.4s cubic-bezier(0.4, 2, 0.6, 1);
	}
	.fade-list-enter-from,
	.fade-list-leave-to {
		opacity: 0;
		transform: translateY(16px) scale(0.98);
	}
	.q-card {
		border-radius: 22px;
	}
	.q-card-section {
		padding: 18px 24px;
	}
	.q-card-actions {
		padding: 12px 24px;
	}
	.q-btn {
		transition: box-shadow 0.2s;
	}
	.q-btn:hover {
		box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
	}
</style>
