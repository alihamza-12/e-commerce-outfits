<template>
	<q-card class="product-form-card">
		<q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
			<div class="form-title">
				<q-icon :name="isEdit ? 'edit' : 'add_box'" size="md" class="q-mr-sm" />
				{{ isEdit ? "Edit Product" : "Add New Product" }}
			</div>
			<q-separator spaced />

			<!-- Product Info -->
			<div class="q-gutter-md row q-col-gutter-md">
				<q-input
					v-model="form.title"
					label="Product Name"
					:rules="[(v) => !!v || 'Product name is required']"
					dense
					outlined
					class="col-12 col-md-6"
					required />
				<q-input
					v-model="form.sku"
					label="SKU"
					:rules="[(v) => !!v || 'SKU is required']"
					dense
					outlined
					class="col-12 col-md-6"
					required />
			</div>

			<q-input
				v-model="form.description"
				label="Description"
				type="textarea"
				autogrow
				outlined
				:rules="[(v) => !!v || 'Description is required']"
				required />

			<!-- Category & Brand -->
			<div class="q-gutter-md row q-col-gutter-md">
				<q-select
					v-model="form.category"
					:options="categories"
					label="Category"
					outlined
					:rules="[(v) => !!v || 'Category is required']"
					class="col-12 col-md-6"
					required />
				<q-input
					v-model="form.brand"
					label="Brand"
					outlined
					:rules="[(v) => !!v || 'Brand is required']"
					class="col-12 col-md-6"
					required />
			</div>

			<!-- Images Upload -->
			<div>
				<div class="q-mb-xs text-weight-medium">Product Images</div>
				<q-uploader
					url=""
					:auto-upload="false"
					accept="image/*"
					multiple
					ref="uploader"
					@added="onImagesAdded"
					:max-files="6"
					:hide-upload-btn="true"
					:hide-upload-progress="true"
					:hide-upload="true"
					style="max-width: 100%">
					<template v-slot:list>
						<div class="row q-col-gutter-sm q-mb-sm">
							<div
								v-for="(img, idx) in imagesPreview"
								:key="idx"
								class="relative"
								style="width: 90px">
								<img
									:src="img"
									class="img-thumb"
									:alt="'Product image ' + (idx + 1)" />
								<q-btn
									size="xs"
									round
									color="negative"
									icon="close"
									class="img-remove-btn"
									@click="removeImage(idx)" />
							</div>
							<q-btn
								flat
								round
								icon="add_photo_alternate"
								color="primary"
								@click="$refs.uploader.pickFiles()"
								class="img-thumb img-add-btn" />
						</div>
					</template>
				</q-uploader>
				<div v-if="imageError" class="text-negative text-caption q-mt-xs">
					{{ imageError }}
				</div>
			</div>

			<!-- Variants Section -->
			<div>
				<div class="flex items-center justify-between q-mb-xs">
					<div class="text-weight-medium">Variants</div>
					<q-btn
						color="primary"
						icon="add"
						label="Add Variant"
						size="sm"
						unelevated
						@click="addVariant" />
				</div>
				<div
					v-if="form.variants.length === 0"
					class="text-grey text-caption q-mb-sm">
					No variants added yet.
				</div>
				<div
					v-for="(variant, idx) in form.variants"
					:key="idx"
					class="q-pa-sm q-mb-sm bg-grey-2 rounded-borders row q-col-gutter-sm items-end">
					<q-input
						v-model="variant.name"
						label="Variant Name"
						dense
						outlined
						:rules="[(v) => !!v || 'Required']"
						class="col-12 col-md-3"
						required />
					<q-input
						v-model="variant.color"
						label="Color"
						dense
						outlined
						class="col-12 col-md-3" />
					<q-input
						v-model.number="variant.price"
						label="Price"
						type="number"
						dense
						outlined
						:rules="[(v) => v >= 0 || 'Invalid']"
						prefix="Rs "
						class="col-12 col-md-2"
						required />
					<q-input
						v-model.number="variant.stock"
						label="Stock"
						type="number"
						dense
						outlined
						:rules="[(v) => v >= 0 || 'Invalid']"
						class="col-12 col-md-2"
						required />
					<q-btn
						color="negative"
						icon="delete"
						size="sm"
						round
						flat
						@click="removeVariant(idx)"
						class="col-12 col-md-2" />
				</div>
			</div>

			<!-- Pricing & Inventory -->
			<div class="q-gutter-md row q-col-gutter-md">
				<q-input
					v-model.number="form.price"
					label="Default Price"
					type="number"
					prefix="Rs "
					outlined
					:rules="[(v) => v >= 0 || 'Must be positive']"
					class="col-12 col-md-6"
					required />
				<q-input
					v-model.number="form.stock"
					label="Default Stock"
					type="number"
					outlined
					:rules="[(v) => v >= 0 || 'Must be positive']"
					class="col-12 col-md-6"
					required />
			</div>

			<!-- Status -->
			<q-select
				v-model="form.status"
				:options="statusOptions"
				label="Status"
				outlined
				required />

			<!-- Buttons -->
			<div class="row q-col-gutter-md q-mt-md">
				<q-btn
					type="submit"
					color="primary"
					label="Save"
					icon="save"
					:loading="saving"
					unelevated
					class="col" />
				<q-btn type="reset" color="grey-6" label="Reset" flat class="col" />
				<q-btn
					color="negative"
					label="Cancel"
					flat
					@click="onCancel"
					class="col" />
			</div>
		</q-form>
	</q-card>
</template>

<script setup>
	import { ref, reactive, computed } from "vue";
	import { useQuasar } from "quasar";

	// Props for edit mode
	const props = defineProps({
		product: Object, // if editing, pass product object
	});
	const emit = defineEmits(["save", "cancel"]);

	const $q = useQuasar();

	const isEdit = computed(() => !!props.product);

	const categories = [
		"Clothing",
		"Electronics",
		"Footwear",
		"Accessories",
		"Home",
		"Beauty",
		"Other",
	];

	const statusOptions = [
		{ label: "Active", value: "active" },
		{ label: "Inactive", value: "inactive" },
		{ label: "Draft", value: "draft" },
	];

	// Form state
	const form = reactive({
		title: "",
		sku: "",
		description: "",
		category: "",
		brand: "",
		images: [],
		variants: [],
		price: 0,
		stock: 0,
		status: "active",
	});

	// For image preview
	const imagesPreview = ref([]);
	const imageError = ref("");

	// For saving state
	const saving = ref(false);

	// Load product if editing
	if (props.product) {
		form.title = props.product.title || "";
		form.sku = props.product.sku || "";
		form.description = props.product.description || "";
		form.category = props.product.category || "";
		form.brand = props.product.brand || "";
		form.price = props.product.price || 0;
		form.stock = props.product.stock || 0;
		form.status = props.product.status || "active";
		form.variants = (props.product.variants || []).map((v) => ({ ...v }));
		imagesPreview.value = props.product.images || [];
	}

	// Image handling
	function onImagesAdded({ files }) {
		imageError.value = "";
		if (files.length + imagesPreview.value.length > 6) {
			imageError.value = "Maximum 6 images allowed";
			return;
		}
		for (const file of files) {
			form.images.push(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				imagesPreview.value.push(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	}
	function removeImage(idx) {
		imagesPreview.value.splice(idx, 1);
		form.images.splice(idx, 1);
	}

	// Variants
	function addVariant() {
		form.variants.push({
			name: "",
			color: "",
			price: 0,
			stock: 0,
		});
	}
	function removeVariant(idx) {
		form.variants.splice(idx, 1);
	}

	// Reset form
	function onReset() {
		if (isEdit.value && props.product) {
			form.title = props.product.title || "";
			form.sku = props.product.sku || "";
			form.description = props.product.description || "";
			form.category = props.product.category || "";
			form.brand = props.product.brand || "";
			form.price = props.product.price || 0;
			form.stock = props.product.stock || 0;
			form.status = props.product.status || "active";
			form.variants = (props.product.variants || []).map((v) => ({ ...v }));
			imagesPreview.value = props.product.images || [];
			form.images = [];
		} else {
			form.title = "";
			form.sku = "";
			form.description = "";
			form.category = "";
			form.brand = "";
			form.price = 0;
			form.stock = 0;
			form.status = "active";
			form.variants = [];
			imagesPreview.value = [];
			form.images = [];
		}
		imageError.value = "";
	}

	// Submit handler
	async function onSubmit() {
		imageError.value = "";
		if (imagesPreview.value.length === 0) {
			imageError.value = "At least one image is required";
			return;
		}
		saving.value = true;
		setTimeout(() => {
			const productData = {
				...form,
				images: imagesPreview.value,
				variants: form.variants.map((v) => ({ ...v })),
			};
			emit("save", productData);
			$q.notify({
				type: "positive",
				message: isEdit.value ? "Product updated!" : "Product created!",
			});
			saving.value = false;
		}, 1200);
	}

	function onCancel() {
		emit("cancel");
	}
</script>

<style scoped>
	.product-form-card {
		max-width: 700px;
		margin: 32px auto;
		padding: 32px 24px 24px 24px;
		border-radius: 18px;
		background: #fff;
		box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.07);
	}
	.form-title {
		font-size: 1.6rem;
		font-weight: 700;
		color: #1e293b;
		display: flex;
		align-items: center;
		margin-bottom: 8px;
		letter-spacing: -1px;
	}
	.img-thumb {
		width: 90px;
		height: 90px;
		object-fit: cover;
		border-radius: 10px;
		border: 1.5px solid #e5e7eb;
		box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.08);
		background: #f8fafc;
		margin-bottom: 2px;
	}
	.img-remove-btn {
		position: absolute;
		top: 2px;
		right: 2px;
		z-index: 2;
		opacity: 0.85;
	}
	.img-add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f1f5f9;
		border: 1.5px dashed #cbd5e1;
		color: #2563eb;
		transition: background 0.15s;
	}
	.img-add-btn:hover {
		background: #e0e7ff;
	}
	@media (max-width: 600px) {
		.product-form-card {
			max-width: 100% !important;
			padding: 0.5rem !important;
		}
	}
</style>
