<template>
    <div class="order-mgmt-root">
        <!-- Header -->
        <div class="order-mgmt-header pro">
            <div>
                <div class="order-mgmt-title">Order Management</div>
                <div class="order-mgmt-subtitle">Manage, ship, cancel and track orders</div>
                <div class="order-mgmt-stats">
                    <span class="stat-item">Total: <strong>{{ totalOrders }}</strong></span>
                    <span class="stat-item" v-for="s in statusCounts" :key="s.status">
                        <q-chip :color="statusColor(s.status)" dense outline class="mr-2">{{ s.statusLabel }} <small class="ml-1">({{ s.count }})</small></q-chip>
                    </span>
                </div>
            </div>

            <div class="order-mgmt-actions">
                <q-input dense outlined debounce="300" v-model="search" placeholder="Search order / customer / number" class="order-mgmt-search" clearable @update:model-value="onSearch" />
                <q-btn dense flat round icon="refresh" @click="fetchOrders()" title="Refresh" class="ml-2" />
                <q-btn dense flat round icon="download" @click="exportCSV" title="Export CSV" class="ml-2" />
            </div>
        </div>

        <!-- Filters row -->
        <div class="order-mgmt-filters q-mb-md pro-filters">
            <q-select v-model="statusFilter" :options="['All', ...statusOptions]" label="Status" dense outlined clearable class="order-mgmt-filter" @update:model-value="onFilter" />
            <q-select v-model="sortBy" :options="sortOptions" label="Sort By" dense outlined class="order-mgmt-filter" @update:model-value="onSort" />
        </div>

        <!-- Table card -->
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

                <template v-slot:body-cell-id="props">
                    <q-td :props="props">
                        <div class="order-id">{{ props.row.order_number || ('#' + props.row.id) }}</div>
                    </q-td>
                </template>

                <template v-slot:body-cell-customer="props">
                    <q-td :props="props">
                        <div class="customer-cell">
                            <q-avatar size="36" text-color="white" :style="{ backgroundColor: avatarColor(props.row.customer) }">{{ initials(props.row.customer) }}</q-avatar>
                            <div class="customer-meta">
                                <div class="customer-name">{{ props.row.customer }}</div>
                                <div class="customer-sub">{{ props.row.raw?.user?.email }}</div>
                            </div>
                        </div>
                    </q-td>
                </template>

                <template v-slot:body-cell-amount="props">
                    <q-td :props="props">
                        <div class="amount-cell">${{ formatPrice(props.row.amount) }}</div>
                    </q-td>
                </template>

                <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                        <q-badge :color="getStatusColor(props.row.status)" class="text-xs px-2 py-1 rounded" :label="props.row.status.toUpperCase()" />
                    </q-td>
                </template>

                <template v-slot:body-cell-placed="props">
                    <q-td :props="props">
                        <div class="placed">{{ props.row.placed }}</div>
                    </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                    <q-td :props="props" align="center">
                        <q-btn dense flat round color="info" icon="visibility" @click.stop="openOrder(props.row)" title="View" />
                        <q-menu auto-close cover :offset="[0, 8]">
                            <template v-slot:anchor>
                                <q-btn dense flat round icon="more_vert" class="ml-2" />
                            </template>
                            <q-list padding>
                                <q-item clickable v-if="props.row.status === 'processing'" @click="confirmShip(props.row)"><q-item-section>Mark as Shipped</q-item-section></q-item>
                                <q-item clickable v-if="['processing','shipped'].includes(props.row.status)" @click="confirmCancel(props.row)"><q-item-section>Cancel Order</q-item-section></q-item>
                                <q-item clickable v-if="props.row.status === 'delivered'" @click="confirmReturn(props.row)"><q-item-section>Mark as Returned</q-item-section></q-item>
                                <q-separator />
                                <q-item clickable @click="copyOrderNumber(props.row)"><q-item-section>Copy Order #</q-item-section></q-item>
                            </q-list>
                        </q-menu>
                    </q-td>
                </template>
            </q-table>
        </q-card>

        <!-- Pagination -->
        <div class="flex justify-end q-mt-md">
            <q-pagination v-model="pagination.page" :max="maxPage" color="primary" input max-pages="8" boundary-numbers size="md" />
        </div>

        <!-- Details drawer with actions -->
        <q-drawer v-model="drawer" side="right" overlay width="480" class="order-details-drawer" :breakpoint="640" :content-class="'bg-white'">
            <q-scroll-area style="height: 100%">
                <div v-if="selectedOrder" class="q-pa-md">
                    <div class="flex items-center justify-between">
                        <div class="order-details-title flex items-center">
                            <q-icon name="receipt_long" class="q-mr-sm" />
                            <div>
                                <div class="text-h6">Order {{ selectedOrder.order_number || '#' + selectedOrder.id }}</div>
                                <div class="text-caption">Placed: {{ selectedOrder.placed }}</div>
                            </div>
                        </div>
                        <div>
                            <q-btn round dense flat icon="refresh" @click="fetchOrderDetails(selectedOrder.id)" title="Reload" />
                            <q-btn round dense flat icon="close" @click="drawer = false" />
                        </div>
                    </div>

                    <q-separator spaced />

                    <div class="order-panel q-mb-md">
                        <div class="row items-center justify-between">
                            <div>
                                <div class="label">Customer</div>
                                <div class="value">{{ selectedOrder.customer }} <div class="muted">{{ selectedOrder.raw?.user?.email }}</div></div>
                            </div>
                            <div class="text-right">
                                <div class="label">Total</div>
                                <div class="value">${{ formatPrice(selectedOrder.amount) }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="order-panel q-mb-md">
                        <div class="label">Shipping Address</div>
                        <div class="value">{{ fullAddress(selectedOrder.raw?.shipping_address) }}</div>
                    </div>

                    <div class="order-panel q-mb-md">
                        <div class="label">Items</div>
                        <q-list dense bordered>
                            <q-item v-for="(it, idx) in selectedOrder.items" :key="idx">
                                <q-item-section avatar>
                                    <q-avatar size="48">
                                        <img :src="resolveImageUrl(it.image)" alt="product" />
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="font-medium">{{ it.product_name || it.name }}</q-item-label>
                                    <q-item-label caption>${{ it.price }} × {{ it.quantity }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <div class="font-medium">${{ formatPrice(Number(it.total || (it.price * it.quantity))) }}</div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>

                    <div class="order-panel q-mb-md">
                        <div class="label">Timeline</div>
                        <q-timeline dense>
                            <q-timeline-entry v-for="(ev, i) in selectedOrder.timeline" :key="i" :title="ev.title.toUpperCase()" :subtitle="ev.time" :icon="ev.icon" :color="ev.color">
                                <div class="text-caption">{{ ev.desc }}</div>
                            </q-timeline-entry>
                        </q-timeline>
                    </div>

                    <div class="q-mt-md actions-row">
                        <q-btn v-if="selectedOrder.status === 'processing'" unelevated color="primary" label="Mark Shipped" @click="confirmShip(selectedOrder)" />
                        <q-btn v-if="['processing','shipped'].includes(selectedOrder.status)" flat color="negative" label="Cancel Order" class="q-ml-sm" @click="confirmCancel(selectedOrder)" />
                        <q-btn v-if="selectedOrder.status === 'delivered'" flat color="accent" label="Return" class="q-ml-sm" @click="confirmReturn(selectedOrder)" />
                    </div>
                </div>
                <div v-else class="q-pa-md">
                    <q-skeleton type="QITEM" width="100%" />
                </div>
            </q-scroll-area>
        </q-drawer>

        <!-- Confirm Dialog -->
        <q-dialog v-model="confirmDialog.show">
            <q-card class="rounded-xl">
                <q-card-section>
                    <div class="text-h6">{{ confirmDialog.title }}</div>
                    <div class="text-caption q-mt-sm">{{ confirmDialog.message }}</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="grey" v-close-popup />
                    <q-btn flat :label="confirmDialog.actionLabel" :color="confirmDialog.actionColor" @click="confirmDialog.action && confirmDialog.action()" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "@/api/axios";

// state
const $q = useQuasar();
const loading = ref(false);
const orders = ref([]);
const search = ref("");
const statusFilter = ref(null);
const sortBy = ref("Newest");
const selected = ref([]);
const drawer = ref(false);
const selectedOrder = ref(null);

const pagination = ref({ page: 1, rowsPerPage: 5 });

const columns = [
    { name: "id", label: "Order", field: "order_number", sortable: true },
    { name: "customer", label: "Customer", field: "customer", sortable: true },
    { name: "amount", label: "Amount", field: "amount", sortable: true, align: "right" },
    { name: "status", label: "Status", field: "status", sortable: true },
    { name: "placed", label: "Placed", field: "placed", sortable: true },
    { name: "actions", label: "Actions", field: "actions" }
];

const statusOptions = ["pending","processing","shipped","delivered","cancelled","returned","disputed"];
const sortOptions = ["Newest","Oldest","Amount (High-Low)","Amount (Low-High)"];

const noDataLabel = "No orders yet.";
const noResultsLabel = "No orders match your search/filter.";

const placeholderImage = "https://cdn.quasar.dev/img/boy-avatar.png"; // use CDN placeholder

// image helpers (robust)
function resolveImageUrl(u) {
    if (!u) {
        console.log('No image URL provided, using placeholder');
        return placeholderImage;
    }
    if (typeof u !== "string") {
        console.log('Image URL is not a string, using placeholder');
        return placeholderImage;
    }
    
    const s = u.trim();
    if (!s) {
        console.log('Empty image URL, using placeholder');
        return placeholderImage;
    }
    
    // If already a full URL, return as is
    if (/^https?:\/\//i.test(s)) {
        console.log('Full image URL:', s);
        return s;
    }

    // Explicit base URL for images
    const baseUrl = 'http://13.60.188.147/';

    // Remove leading slashes and handle various path formats
    const cleanPath = s.replace(/^\/+/, "");
    
    // Check if the path already includes storage or similar directories
    if (/^(storage|uploads|public|images?)\//i.test(cleanPath)) {
        const resolvedUrl = baseUrl + cleanPath;
        console.log('Resolved storage image URL:', resolvedUrl);
        return resolvedUrl;
    }
    
    // Default to storage directory
    const resolvedUrl = baseUrl + 'storage/' + cleanPath;
    console.log('Resolved default image URL:', resolvedUrl);
    return resolvedUrl;
}

// helper: normalize order shape for table/UI
function mapOrderForTable(o) {
		return {
			id: o.id,
			order_number: o.order_number,
			customer: o.user?.name || o.user?.email || "N/A",
			amount: Number(o.total || o.subtotal || 0),
			status: o.status,
			placed: o.created_at
				? new Date(o.created_at).toLocaleString()
				: o.created_at || "",
			address: o.shipping_address
				? `${o.shipping_address.line1 || ""}${
						o.shipping_address.city ? ", " + o.shipping_address.city : ""
				  }`
				: "",
			items: o.items || [],
			timeline: (o.meta?.admin_updates || []).map((ev) => ({
				title: ev.status,
				time: ev.changed_at,
				desc: "",
				icon: "history",
				color: getStatusColor(ev.status),
			})),
			raw: o, // keep original if needed
		};
	}

	// Fetch orders from backend (handles both simple array and paginated response)
	async function fetchOrders(page = 1) {
		loading.value = true;
		try {
			const res = await axios.get(`/seller/orders?page=${page}`);
			if (res?.data?.success && res.data.data) {
				const payload = res.data.data;
				// payload may be paginated object with `data` array, or directly an array
				const list = Array.isArray(payload) ? payload : payload.data || [];
				orders.value = list.map(mapOrderForTable);

				// update pagination values when paginated response present
				if (!Array.isArray(payload)) {
					pagination.value.page = payload.current_page || page;
					pagination.value.rowsPerPage =
						payload.per_page || pagination.value.rowsPerPage;
					// optional: if you want to compute maxPage from server last_page
					// you can use payload.last_page (the maxPage computed currently uses client-side filtered length)
				}
			} else {
				orders.value = [];
				$q.notify({
					type: "negative",
					message: res?.data?.message || "Failed to load orders",
				});
			}
		} catch (error) {
			$q.notify({
				type: "negative",
				message:
					error?.response?.data?.message ||
					"Network error while fetching orders",
			});
		} finally {
			loading.value = false;
		}
	}

	// Fetch single order details (normalize to same shape)
	async function fetchOrderDetails(id) {
		loading.value = true;
		try {
			const res = await axios.get(`/seller/orders/${id}`);
			if (res?.data?.success && res.data.data) {
				// server may return order object directly under data
				const o = res.data.data;
				selectedOrder.value = mapOrderForTable(o);
				// keep original raw object under selectedOrder.raw if needed
				drawer.value = true;
			} else {
				$q.notify({
					type: "negative",
					message: res?.data?.message || "Failed to load order details",
				});
			}
		} catch (error) {
			$q.notify({
				type: "negative",
				message:
					error?.response?.data?.message ||
					"Network error while fetching order",
			});
		} finally {
			loading.value = false;
		}
	}

	// Update order status (ship/cancel)
	async function updateOrderStatus(orderId, status) {
		loading.value = true;
		try {
			const res = await axios.patch(`/seller/orders/${orderId}/status`, {
				status,
			});
			if (res?.data?.success && res.data.data) {
				// update local list and selectedOrder if open
				const updated = res.data.data;
				const idx = orders.value.findIndex((o) => o.id === updated.id);
				if (idx !== -1)
					orders.value[idx] = { ...orders.value[idx], ...updated };
				if (selectedOrder.value && selectedOrder.value.id === updated.id) {
					selectedOrder.value = { ...selectedOrder.value, ...updated };
				}
				$q.notify({
					type: "positive",
					message: `Order ${orderId} updated to ${status}`,
				});
			} else {
				$q.notify({
					type: "negative",
					message: res?.data?.message || "Failed to update status",
				});
			}
		} catch (error) {
			$q.notify({
				type: "negative",
				message:
					error?.response?.data?.message ||
					"Network error while updating status",
			});
		} finally {
			loading.value = false;
		}
	}

	// Return order endpoint
	async function returnOrderApi(orderId) {
		loading.value = true;
		try {
			const res = await axios.patch(`/seller/orders/${orderId}/return`);
			if (res?.data?.success && res.data.data) {
				const updated = res.data.data;
				const idx = orders.value.findIndex((o) => o.id === updated.id);
				if (idx !== -1)
					orders.value[idx] = { ...orders.value[idx], ...updated };
				if (selectedOrder.value && selectedOrder.value.id === updated.id) {
					selectedOrder.value = { ...selectedOrder.value, ...updated };
				}
				$q.notify({
					type: "positive",
					message: `Order ${orderId} marked as returned`,
				});
			} else {
				$q.notify({
					type: "negative",
					message: res?.data?.message || "Failed to mark returned",
				});
			}
		} catch (error) {
			$q.notify({
				type: "negative",
				message:
					error?.response?.data?.message ||
					"Network error while returning order",
			});
		} finally {
			loading.value = false;
		}
	}

	// Helpers (keep the same UI functions)
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
		// if full details required, fetch from backend
		if (order?.id) fetchOrderDetails(order.id);
		else drawer.value = false;
	}

	// UI handlers (confirm dialogs)
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
			action: async () => {
				await updateOrderStatus(order.id, "shipped");
			},
		};
	}
	function confirmCancel(order) {
		confirmDialog.value = {
			show: true,
			title: "Cancel Order",
			message: `Are you sure you want to cancel order #${order.id}?`,
			actionLabel: "Cancel",
			actionColor: "negative",
			action: async () => {
				await updateOrderStatus(order.id, "cancelled");
			},
		};
	}
	function confirmReturn(order) {
		confirmDialog.value = {
			show: true,
			title: "Return Order",
			message: `Are you sure you want to mark order #${order.id} as returned?`,
			actionLabel: "Return",
			actionColor: "accent",
			action: async () => {
				await returnOrderApi(order.id);
			},
		};
	}

	// Filters / computed
	const filteredOrders = computed(() => {
		let arr = orders.value || [];
		if (search.value) {
			const s = search.value.toLowerCase();
			arr = arr.filter(
				(o) =>
					(o.id || "").toLowerCase().includes(s) ||
					(o.customer || "").toLowerCase().includes(s)
			);
		}
		if (statusFilter.value && statusFilter.value !== "All") {
			arr = arr.filter((o) => o.status === statusFilter.value);
		}
		// Sorting
		if (sortBy.value === "Newest") {
			arr = arr
				.slice()
				.sort((a, b) => (b.placed || "").localeCompare(a.placed || ""));
		} else if (sortBy.value === "Oldest") {
			arr = arr
				.slice()
				.sort((a, b) => (a.placed || "").localeCompare(b.placed || ""));
		} else if (sortBy.value === "Amount (High-Low)") {
			arr = arr.slice().sort((a, b) => (b.amount || 0) - (a.amount || 0));
		} else if (sortBy.value === "Amount (Low-High)") {
			arr = arr.slice().sort((a, b) => (a.amount || 0) - (b.amount || 0));
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

	function onSearch() {
		pagination.value.page = 1;
	}
	function onFilter() {
		pagination.value.page = 1;
	}
	function onSort() {
		pagination.value.page = 1;
	}

	// small UI helpers & computed
	const totalOrders = computed(() => orders.value.length);
	const statusCounts = computed(() => {
    const map = {};
    orders.value.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.keys(map).sort().map(s => ({ status: s, count: map[s], statusLabel: s.charAt(0).toUpperCase() + s.slice(1) }));
});

	function formatPrice(v) {
    return Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function avatarColor(name) {
    if (!name) return '#6b7280';
    const colors = ['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6','#8b5cf6'];
    return colors[name.charCodeAt(0) % colors.length];
}
function initials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
}
function fullAddress(a) {
    if (!a) return 'N/A';
    return [a.line1, a.city, a.postal_code, a.country].filter(Boolean).join(', ');
}
function copyOrderNumber(row) {
    navigator.clipboard?.writeText(row.order_number || row.id);
    $q.notify({ type: 'positive', message: 'Order number copied' });
}
function statusColor(s) {
    return getStatusColor(s);
}

// small export CSV
function exportCSV() {
    const rows = orders.value.map(o => ({
        id: o.id,
        order_number: o.order_number,
        customer: o.customer,
        amount: o.amount,
        status: o.status,
        placed: o.placed
    }));
    const csv = [
        Object.keys(rows[0] || {}).join(','),
        ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `orders_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
}

// wire pagination -> server fetch (existing watch is kept)
watch(() => pagination.value.page, (p) => { fetchOrders(p); });

// initial load
onMounted(() => { fetchOrders(); });
</script>

<style scoped>
.order-mgmt-root { padding: 28px; background: linear-gradient(120deg,#f8fafc,#f1f5f9); min-height:100vh; }
.order-mgmt-header.pro { display:flex; gap:16px; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; }
.order-mgmt-title { font-size:1.9rem; font-weight:800; color:#0f172a; }
.order-mgmt-subtitle { color:#475569; margin-top:6px; }
.order-mgmt-stats { margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.stat-item { color:#334155; margin-right:6px; font-size:0.95rem; }

.order-mgmt-actions { display:flex; align-items:center; gap:6px; }
.order-mgmt-search { min-width:260px; }

.order-mgmt-filters.pro-filters { display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-top:12px; }

.order-mgmt-table { border-radius:16px; overflow:hidden; }
.customer-cell { display:flex; gap:10px; align-items:center; }
.customer-meta .customer-name { font-weight:600; }
.customer-meta .customer-sub { font-size:12px; color:#64748b; }

.order-id { font-weight:700; color:#0f172a; }
.amount-cell { font-weight:700; color:#0b5cff; }

.order-details-drawer { border-top-left-radius:12px; border-bottom-left-radius:12px; }
.order-details-title .text-h6 { margin-bottom:4px; }
.order-panel { background:#fafafa; padding:10px; border-radius:8px; }

.label { font-weight:600; color:#334155; }
.value { margin-top:6px; font-weight:600; color:#0b5cff; }
.muted { color:#64748b; font-size:12px; margin-top:4px; }

.actions-row { display:flex; gap:10px; }

.q-table .q-tr--selected { background: rgba(59,130,246,0.04) !important; }

@media (max-width:640px) {
    .order-mgmt-actions { width:100%; justify-content:flex-start; }
    .order-mgmt-search { flex:1; min-width:unset; }
    .order-details-drawer { width:100% !important; }
}
</style>
