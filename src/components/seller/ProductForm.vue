<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Product' : 'Add New Product' }}</div>
          <div class="text-subtitle2 text-grey-7">
            {{ isEdit ? 'Update your existing product details' : 'Create a new product for your store' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <!-- Basic Information -->
            <div class="text-subtitle1 q-mb-md">Basic Information</div>
            
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-8">
                <q-input
                  v-model="product.name"
                  label="Product Name *"
                  :rules="[val => !!val || 'Product name is required']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="product.sku"
                  label="SKU *"
                  :rules="[val => !!val || 'SKU is required']"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-input
              v-model="product.description"
              type="textarea"
              label="Description *"
              :rules="[val => !!val || 'Description is required']"
              outlined
              rows="4"
            />

            <!-- Pricing Section -->
            <div class="text-subtitle1 q-mb-md">Pricing</div>
            
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="product.price"
                  type="number"
                  label="Price *"
                  prefix="$"
                  :rules="[val => val > 0 || 'Price must be greater than 0']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="product.comparePrice"
                  type="number"
                  label="Compare Price"
                  prefix="$"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="product.cost"
                  type="number"
                  label="Cost"
                  prefix="$"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- Inventory Section -->
            <div class="text-subtitle1 q-mb-md">Inventory</div>
            
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="product.quantity"
                  type="number"
                  label="Quantity *"
                  :rules="[val => val >= 0 || 'Quantity must be 0 or greater']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="product.barcode"
                  label="Barcode"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- Categories & Organization -->
            <div class="text-subtitle1 q-mb-md">Categories & Organization</div>
            
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="product.category"
                  :options="categories"
                  label="Category *"
                  :rules="[val => !!val || 'Category is required']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="product.brand"
                  :options="brands"
                  label="Brand"
                  outlined
                  dense
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="product.status"
                  :options="statusOptions"
                  label="Status *"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="product.visibility"
                  :options="visibilityOptions"
                  label="Visibility *"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- Product Variants -->
            <div class="text-subtitle1 q-mb-md">Product Variants</div>
            
            <div class="q-mb-md">
              <q-btn
                color="primary"
                icon="add"
                label="Add Variant"
                @click="addVariant"
                class="q-mb-md"
              />
              
              <div v-for="(variant, index) in product.variants" :key="index" class="q-mb-md">
                <q-card>
                  <q-card-section>
                    <div class="row q-col-gutter-md items-center">
                      <div class="col-12 col-md-3">
                        <q-input
                          v-model="variant.name"
                          label="Variant Name *"
                          :rules="[val => !!val || 'Variant name is required']"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12 col-md-3">
                        <q-input
                          v-model="variant.value"
                          label="Variant Value *"
                          :rules="[val => !!val || 'Variant value is required']"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12 col-md-2">
                        <q-input
                          v-model.number="variant.price"
                          type="number"
                          label="Price"
                          prefix="$"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12 col-md-2">
                        <q-input
                          v-model.number="variant.quantity"
                          type="number"
                          label="Quantity"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12 col-md-2">
                        <q-btn
                          icon="delete"
                          color="negative"
                          @click="removeVariant(index)"
                          flat
                          round
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Product Images -->
            <div class="text-subtitle1 q-mb-md">Product Images</div>
            
            <div class="q-mb-md">
              <q-file
                v-model="newImages"
                label="Select Images"
                multiple
                accept="image/*"
                outlined
                @update:model-value="onImagesSelected"
              >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              
              <div class="row q-col-gutter-md q-mt-md" v-if="product.images.length > 0">
                <div v-for="(image, index) in product.images" :key="index" class="col-6 col-md-3">
                  <q-img
                    :src="image"
                    :ratio="1"
                    class="rounded-borders"
                  >
                    <q-btn
                      icon="close"
                      color="negative"
                      @click="removeImage(index)"
                      class="absolute-top-right"
                      round
                      dense
                    />
                  </q-img>
                </div>
              </div>
            </div>

            <!-- SEO & Marketing -->
            <div class="text-subtitle1 q-mb-md">SEO & Marketing</div>
            
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="product.seoTitle"
                  label="SEO Title"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="product.seoDescription"
                  label="SEO Description"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-input
              v-model="product.tags"
              label="Tags (comma separated)"
              outlined
              dense
            />

            <!-- Submit Buttons -->
            <div class="row justify-end q-mt-lg">
              <q-btn
                :label="isEdit ? 'Update Product' : 'Add Product'"
                type="submit"
                color="primary"
                :loading="loading"
                class="q-mr-sm"
              />
              <q-btn
                label="Cancel"
                color="grey"
                flat
                @click="$router.push('/seller/products')"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ProductForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEdit = ref(false)
    const loading = ref(false)
    
    const product = reactive({
      name: '',
      sku: '',
      description: '',
      price: 0,
      comparePrice: 0,
      cost: 0,
      quantity: 0,
      barcode: '',
      category: '',
      brand: '',
      status: 'active',
      visibility: 'visible',
      images: [],
      variants: [],
      seoTitle: '',
      seoDescription: '',
      tags: ''
    })

    const newImages = ref([])
    
    const categories = [
      'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 
      'Beauty', 'Toys', 'Automotive', 'Health', 'Food & Beverages'
    ]
    
    const brands = [
      'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Generic', 
      'Dell', 'HP', 'Lenovo', 'Microsoft', 'Google'
    ]
    
    const statusOptions = ['active', 'inactive', 'draft']
    const visibilityOptions = ['visible', 'hidden']
    
    const addVariant = () => {
      product.variants.push({
        name: '',
        value: '',
        price: 0,
        quantity: 0
      })
    }
    
    const removeVariant = (index) => {
      product.variants.splice(index, 1)
    }
    
    const onImagesSelected = (files) => {
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          product.images.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    }
    
    const removeImage = (index) => {
      product.images.splice(index, 1)
    }
    
    const onSubmit = async () => {
      loading.value = true
      
      try {
        const productData = {
          ...product,
          tags: product.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
        
        // Here you would typically make an API call
        console.log('Submitting product:', productData)
        
        router.push('/seller/products')
      } catch (error) {
        console.error('Error submitting product:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      if (route.params.id) {
        isEdit.value = true
        // Load existing product data
        // This would typically be an API call
      }
    })
    
    return {
      isEdit,
      loading,
      product,
      newImages,
      categories,
      brands,
      statusOptions,
      visibilityOptions,
      addVariant,
      removeVariant,
      onImagesSelected,
      removeImage,
      onSubmit
    }
  }
}
</script>
