<template>
	<div class="q-pa-md">
		<div class="row items-center justify-between q-mb-lg">
			<div class="col-auto">
				<h2 class="text-h4 text-weight-bold q-ma-none">Your Orders</h2>
				<p class="text-body2 text-grey-7 q-mt-xs q-mb-none">
					Track and manage your order history
				</p>
			</div>
			<div class="col-auto">
				<q-chip
					v-if="!loading && orders.length > 0"
					color="primary"
					text-color="white"
					icon="shopping_bag">
					{{ pagination.total }} total orders
				</q-chip>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="row justify-center q-py-xl">
			<div class="col-auto text-center">
				<q-spinner-dots size="50px" color="primary" />
				<div class="text-body1 q-mt-md text-grey-7">Loading your orders...</div>
			</div>
		</div>

		<!-- Empty State -->
		<div v-else-if="orders.length === 0" class="row justify-center q-py-xl">
			<div class="col-auto text-center">
				<q-icon name="shopping_cart" size="80px" color="grey-4" />
				<div class="text-h6 q-mt-md text-grey-7">No orders yet</div>
				<div class="text-body2 text-grey-6 q-mt-sm">
					Your order history will appear here once you make your first purchase
				</div>
			</div>
		</div>

		<!-- Orders List -->
		<div v-else class="q-gutter-md">
			<q-card
				v-for="(order, idx) in orders"
				:key="order.order_number + idx"
				flat
				bordered
				class="order-card">
				<q-card-section class="q-pa-md">
					<div class="row items-center justify-between">
						<!-- Order Info -->
						<div class="col-auto">
							<div class="row items-center q-gutter-sm q-mb-xs">
								<q-icon name="receipt_long" color="primary" size="20px" />
								<span class="text-subtitle1 text-weight-bold">
									{{ order.order_number }}
								</span>
							</div>

							<div class="row items-center q-gutter-sm q-mb-xs">
								<q-icon name="schedule" color="grey-6" size="16px" />
								<span class="text-body2 text-grey-7">
									{{ formatDate(order.created_at) }}
								</span>
							</div>

							<div class="row items-center q-gutter-sm">
								<q-icon name="location_on" color="grey-6" size="16px" />
								<span class="text-body2 text-grey-7">
									{{ formatShippingAddress(order.shipping_address) }}
								</span>
							</div>
						</div>

						<!-- Order Summary -->
						<div class="col-auto text-right">
							<div class="text-h6 text-weight-bold q-mb-xs">
								Rs {{ formatPrice(order.total) }}
							</div>

							<q-chip
								:color="getStatusColor(order.status)"
								:text-color="getStatusTextColor(order.status)"
								:icon="getStatusIcon(order.status)"
								size="sm"
								class="q-mb-sm">
								{{ getStatusLabel(order.status) }}
							</q-chip>

							<div>
								<q-btn
									color="primary"
									outline
									no-caps
									size="sm"
									icon="visibility"
									label="View Details"
									@click="viewOrder(order)" />
							</div>
						</div>
					</div>
				</q-card-section>
			</q-card>

			<!-- Pagination -->
			<div
				v-if="pagination.total > pagination.per_page"
				class="row justify-center q-mt-lg">
				<q-pagination
					v-model="pagination.current_page"
					:max="pagination.last_page"
					:max-pages="6"
					boundary-links
					@update:model-value="changePage"
					color="primary"
					size="md" />
			</div>
		</div>

		<!-- Order Detail Dialog -->
		<q-dialog v-model="showDetail" persistent>
			<q-card
				style="min-width: 400px; max-width: 800px"
				class="order-detail-card">
				<!-- Header -->
				<q-card-section class="bg-primary text-white">
					<div class="row items-center justify-between">
						<div class="col">
							<div class="text-h6 text-weight-bold">
								Order {{ detail.order_number }}
							</div>
							<div class="text-body2 opacity-80">
								Placed on {{ formatDate(detail.created_at) }}
							</div>
						</div>
						<div class="col-auto">
							<q-chip
								:color="getStatusColor(detail.status, true)"
								:text-color="getStatusTextColor(detail.status, true)"
								:icon="getStatusIcon(detail.status)"
								size="md">
								{{ getStatusLabel(detail.status) }}
							</q-chip>
						</div>
					</div>
				</q-card-section>

				<q-separator />

				<!-- Scrollable Body -->
				<div class="order-detail-body">
					<!-- Order Items -->
					<q-card-section class="q-pa-none">
						<div class="text-subtitle1 text-weight-medium q-pa-md q-pb-sm">
							<q-icon name="shopping_cart" class="q-mr-sm" />
							Order Items
						</div>

						<div v-if="getOrderItems(detail).length > 0" class="q-px-md">
							<q-list separator>
								<q-item
									v-for="item in getOrderItems(detail)"
									:key="item.product_id || item.id"
									class="q-px-none">
									<q-item-section>
										<q-item-label class="text-weight-medium">
											{{ item.name || item.product_name }}
										</q-item-label>
										<q-item-label caption>
											Quantity: {{ item.quantity }} × Rs
											{{ formatPrice(item.price) }}
										</q-item-label>
									</q-item-section>
									<q-item-section side>
										<q-item-label class="text-weight-bold">
											Rs {{ formatPrice(item.total) }}
										</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</div>

						<div v-else class="q-pa-md text-center text-grey-6">
							<q-icon name="inbox" size="40px" color="grey-4" />
							<div class="text-body2 q-mt-sm">
								No items available for this order
							</div>
						</div>
					</q-card-section>

					<q-separator />

					<!-- Order Summary -->
					<q-card-section>
						<div class="text-subtitle1 text-weight-medium q-mb-md">
							<q-icon name="receipt" class="q-mr-sm" />
							Order Summary
						</div>

						<div class="order-summary">
							<div class="row justify-between q-mb-sm">
								<span class="text-body2">Subtotal</span>
								<span class="text-body2"
									>Rs
									{{ formatPrice(detail.subtotal ?? detail.total ?? 0) }}</span
								>
							</div>
							<div class="row justify-between q-mb-sm">
								<span class="text-body2">Shipping</span>
								<span class="text-body2"
									>Rs {{ formatPrice(detail.shipping ?? 0) }}</span
								>
							</div>
							<div class="row justify-between q-mb-md">
								<span class="text-body2">Tax</span>
								<span class="text-body2"
									>Rs {{ formatPrice(detail.tax ?? 0) }}</span
								>
							</div>
							<q-separator class="q-mb-md" />
							<div class="row justify-between">
								<span class="text-h6 text-weight-bold">Total</span>
								<span class="text-h6 text-weight-bold text-primary">
									Rs {{ formatPrice(detail.total ?? 0) }}
								</span>
							</div>
						</div>
					</q-card-section>

					<!-- Shipping Address -->
					<q-card-section v-if="detail.shipping_address" class="q-pt-none">
						<div class="text-subtitle1 text-weight-medium q-mb-sm">
							<q-icon name="local_shipping" class="q-mr-sm" />
							Shipping Address
						</div>
						<q-card flat bordered class="bg-grey-1">
							<q-card-section class="q-pa-md">
								<div class="text-body2">
									{{ formatShippingAddress(detail.shipping_address) }}
								</div>
							</q-card-section>
						</q-card>
					</q-card-section>
				</div>

				<!-- Actions fixed at bottom -->
				<q-card-actions align="right" class="q-pa-md order-detail-actions">
					<q-btn
						flat
						label="Close"
						color="grey-7"
						@click="closeDetail"
						no-caps />
					<q-btn
						color="primary"
						label="Track Order"
						no-caps
						icon="track_changes"
						v-if="
							detail.status !== 'delivered' &&
							detail.status !== 'cancelled' &&
							detail.status !== 'refunded'
						" />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import ordersService from "@/services/orders";

	const orders = ref([]);
	const loading = ref(true);
	const showDetail = ref(false);
	const detail = ref({});
	const pagination = ref({
		current_page: 1,
		last_page: 1,
		per_page: 10,
		total: 0,
		next_page_url: null,
	});

	const fetchOrders = async (page = 1) => {
		loading.value = true;
		try {
			const res = await ordersService.getOrders(page);
			if (res && res.success) {
				const payload = res.data || {};
				if (Array.isArray(payload.data)) {
					orders.value = payload.data;
					pagination.value.current_page = payload.current_page || page;
					pagination.value.last_page = payload.last_page || 1;
					pagination.value.per_page = payload.per_page || 10;
					pagination.value.total = payload.total || 0;
					pagination.value.next_page_url = payload.next_page_url || null;
				} else if (Array.isArray(res.data)) {
					orders.value = res.data;
				}
			}
		} catch (err) {
			console.error("fetchOrders error", err);
		} finally {
			loading.value = false;
		}
	};

	const viewOrder = async (order) => {
		if (order.items || order.order_items) {
			detail.value = {
				...order,
				items:
					order.items ||
					(order.order_items
						? order.order_items.map((item) => ({
								product_id: item.product_id,
								name: item.product_name || item.name,
								quantity: item.quantity,
								price: item.price,
								total: item.total,
						  }))
						: undefined),
				order_items: order.order_items || undefined,
			};
			showDetail.value = true;
			return;
		}

		try {
			const res = await ordersService.getOrder(order.id || order.order_number);
			if (res && res.success) {
				detail.value = res.data || {};
				showDetail.value = true;
			}
		} catch (err) {
			console.error("viewOrder error", err);
		}
	};

	const closeDetail = () => {
		showDetail.value = false;
		detail.value = {};
	};

	const changePage = (page) => {
		if (!page || page < 1) return;
		fetchOrders(page);
	};

	// Utility Functions
	const formatDate = (iso) => {
		if (!iso) return "—";
		try {
			return new Date(iso).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch (e) {
			return iso;
		}
	};

	const formatPrice = (value) => {
		if (value == null) return "0";
		return Number(value).toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const formatShippingAddress = (address) => {
		if (!address) return "—";
		if (Array.isArray(address)) {
			return address.filter(Boolean).join(", ");
		}
		if (typeof address === "object") {
			return [address.line1, address.city, address.postal_code, address.country]
				.filter(Boolean)
				.join(", ");
		}
		return String(address);
	};

	const getOrderItems = (orderDetail) => {
		return orderDetail.items && orderDetail.items.length
			? orderDetail.items
			: orderDetail.order_items || [];
	};

	// Status styling functions
	const getStatusColor = (status, isChip = false) => {
		const statusMap = {
			processing: "orange",
			shipped: "blue",
			delivered: "green",
			cancelled: "red",
			refunded: "purple",
			disputed: "deep-orange",
		};
		return statusMap[status] || "grey";
	};

	const getStatusTextColor = (status, isChip = false) => {
		return "white";
	};

	const getStatusIcon = (status) => {
		const iconMap = {
			processing: "hourglass_empty",
			shipped: "local_shipping",
			delivered: "check_circle",
			cancelled: "cancel",
			refunded: "undo",
			disputed: "report_problem",
		};
		return iconMap[status] || "help";
	};

	const getStatusLabel = (status) => {
		const labelMap = {
			processing: "Processing",
			shipped: "Shipped",
			delivered: "Delivered",
			cancelled: "Cancelled",
			refunded: "Refunded",
			disputed: "Disputed",
		};
		return labelMap[status] || status;
	};

	onMounted(fetchOrders);
</script>

<style scoped>
	.order-card {
		transition: all 0.3s ease;
		border-radius: 12px;
	}

	.order-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.order-detail-card {
		border-radius: 16px;
		overflow: hidden;
		max-height: 90vh; /* ensures dialog fits viewport */
		display: flex;
		flex-direction: column;
	}

	.order-summary {
		background: rgba(0, 0, 0, 0.02);
		border-radius: 8px;
		padding: 16px;
	}

	.order-detail-body {
		overflow-y: auto;
		flex: 1 1 auto;
	}

	.order-detail-actions {
		flex-shrink: 0;
		border-top: 1px solid rgba(0, 0, 0, 0.05);
		background: #fff;
	}

	/* Custom scrollbar for dialog */
	.q-dialog__inner {
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
	}

	.q-dialog__inner::-webkit-scrollbar {
		width: 6px;
	}

	.q-dialog__inner::-webkit-scrollbar-track {
		background: transparent;
	}

	.q-dialog__inner::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}
</style>
