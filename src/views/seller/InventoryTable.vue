<template>
	<q-page class="q-pa-md bg-gray-50 min-h-screen">
		<!-- Header -->
		<div
			class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
			<div>
				<h2 class="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
					Inventory Management
				</h2>
				<p class="text-gray-500 text-sm">
					Manage your products, stock & variants
				</p>
			</div>
			<q-btn
				color="primary"
				label="Add Product"
				icon="add"
				class="shadow-md mt-4 md:mt-0 rounded-lg px-4 py-2 font-medium"
				@click="openProductDialog()"
				unelevated />
		</div>

		<!-- Search -->
		<div class="mb-6">
			<q-input
				filled
				v-model="search"
				label="Search products"
				debounce="300"
				clearable
				dense
				prefix-icon="search"
				input-class="text-base"
				class="w-full rounded-lg" />
		</div>

		<!-- Table -->
		<div class="bg-white rounded-2xl shadow-lg overflow-hidden">
			<q-table
				:rows="filteredProducts"
				:columns="columns"
				row-key="id"
				flat
				bordered
				:pagination.sync="pagination"
				:rows-per-page-options="[5, 10, 20, 50]"
				:filter="search"
				class="min-w-full"
				table-class="text-gray-700"
				hide-bottom>
				<!-- Image -->
				<template v-slot:body-cell-image="props">
					<td class="py-4 px-4 text-center align-middle">
						<q-avatar size="56px" class="shadow border border-gray-200">
							<img
								:src="props.row.image || defaultImage"
								class="object-cover" />
						</q-avatar>
					</td>
				</template>

				<!-- Product Name + SKU -->
				<template v-slot:body-cell-name="props">
					<td class="py-4 px-4 align-middle">
						<div class="font-semibold text-gray-800 text-base">
							{{ props.row.name }}
						</div>
						<div class="text-xs text-gray-500">{{ props.row.sku }}</div>
					</td>
				</template>

				<!-- Price -->
				<template v-slot:body-cell-price="props">
					<td class="py-4 px-4 text-right align-middle">
						<span class="font-bold text-green-600">
							PKR {{ props.row.price }}
						</span>
					</td>
				</template>

				<!-- Stock -->
				<template v-slot:body-cell-stock="props">
					<td class="py-4 px-4 text-center align-middle">
						<span
							:class="props.row.stock > 0 ? 'text-blue-600' : 'text-red-500'"
							class="font-medium">
							{{ props.row.stock }}
						</span>
					</td>
				</template>

				<!-- Variants -->
				<template v-slot:body-cell-variants="props">
					<td class="py-4 px-4 align-middle">
						<div class="flex flex-wrap gap-2">
							<q-chip
								v-for="variant in props.row.variants"
								:key="variant.id"
								color="secondary"
								text-color="white"
								dense
								class="text-xs font-medium px-3 py-1 rounded-full">
								{{ variant.name }}: {{ variant.value }}
							</q-chip>
						</div>
					</td>
				</template>

				<!-- Actions -->
				<template v-slot:body-cell-actions="props">
					<td class="py-4 px-4 text-center align-middle">
						<div class="flex justify-center gap-3">
							<q-btn
								dense
								flat
								icon="edit"
								color="primary"
								@click="openProductDialog(props.row)"
								class="hover:bg-blue-100 rounded-full" />
							<q-btn
								dense
								flat
								icon="delete"
								color="negative"
								@click="deleteProduct(props.row)"
								class="hover:bg-red-100 rounded-full" />
						</div>
					</td>
				</template>
			</q-table>

			<!-- Footer Pagination -->
			<div
				class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
				<div class="text-sm text-gray-500 flex items-center gap-2">
					Records per page:
					<q-select
						v-model="pagination.rowsPerPage"
						:options="[5, 10, 20, 50]"
						dense
						borderless
						class="w-20 inline-block" />
				</div>
				<div class="text-sm text-gray-500">
					{{ pagination.page }} -
					{{
						Math.min(
							pagination.page * pagination.rowsPerPage,
							filteredProducts.length
						)
					}}
					of {{ filteredProducts.length }}
				</div>
			</div>
		</div>
	</q-page>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { v4 as uuidv4 } from "uuid";
	import { useRouter } from "vue-router"; // Add this line

	const router = useRouter(); // Add this line

	const defaultImage = "https://cdn.quasar.dev/img/avatar.png";

	const columns = [
		{ name: "image", label: "Image", field: "image", align: "center" },
		{ name: "name", label: "Product", field: "name", align: "left" },
		{ name: "price", label: "Price", field: "price", align: "right" },
		{ name: "stock", label: "Stock", field: "stock", align: "center" },
		{ name: "variants", label: "Variants", field: "variants", align: "left" },
		{ name: "actions", label: "Actions", field: "actions", align: "center" },
	];

	const products = ref([
		{
			id: uuidv4(),
			name: "Classic T-Shirt",
			sku: "TSHIRT-001",
			price: 1200,
			stock: 50,
			description: "A comfortable cotton t-shirt.",
			image: "",
			variants: [
				{ id: uuidv4(), name: "Size", value: "M" },
				{ id: uuidv4(), name: "Color", value: "Blue" },
			],
		},
		{
			id: uuidv4(),
			name: "Denim Jeans",
			sku: "JEANS-002",
			price: 2500,
			stock: 30,
			description: "Stylish blue denim jeans.",
			image: "",
			variants: [
				{ id: uuidv4(), name: "Size", value: "32" },
				{ id: uuidv4(), name: "Color", value: "Dark Blue" },
			],
		},
	]);

	const search = ref("");
	const pagination = ref({ page: 1, rowsPerPage: 5 });

	const filteredProducts = computed(() => {
		if (!search.value) return products.value;
		const s = search.value.toLowerCase();
		return products.value.filter(
			(p) =>
				p.name.toLowerCase().includes(s) ||
				p.sku.toLowerCase().includes(s) ||
				p.description.toLowerCase().includes(s)
		);
	});

	function openProductDialog(product) {
		if (!product) {
			// Add Product: navigate to add product page
			router.push("/seller/products");
		} else {
			// Edit Product: navigate to edit page with product id
			router.push(`/seller/products/${product.id}`);
		}
	}

	function deleteProduct(product) {
		products.value = products.value.filter((p) => p.id !== product.id);
	}
</script>

<style scoped>
	.q-table th {
		background: #f8fafc;
		font-weight: 600;
		font-size: 14px;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		text-align: center;
	}
	.q-table td {
		font-size: 14px;
		vertical-align: middle !important;
	}
	.q-btn {
		transition: all 0.2s;
	}
	.q-btn:hover {
		transform: scale(1.05);
	}
</style>
