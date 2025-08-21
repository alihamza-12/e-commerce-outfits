<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Seller Registration</div>
          <div class="text-subtitle2 text-grey-7">Complete your seller profile setup</div>
        </q-card-section>

        <q-card-section>
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            animated
          >
            <!-- Step 1: Basic Information -->
            <q-step
              :name="1"
              title="Basic Information"
              icon="person"
              :done="step > 1"
            >
              <q-form @submit="nextStep" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="seller.firstName"
                      label="First Name *"
                      :rules="[val => !!val || 'First name is required']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="seller.lastName"
                      label="Last Name *"
                      :rules="[val => !!val || 'Last name is required']"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <q-input
                  v-model="seller.email"
                  type="email"
                  label="Email *"
                  :rules="[
                    val => !!val || 'Email is required',
                    val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
                  ]"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.phone"
                  type="tel"
                  label="Phone *"
                  :rules="[val => !!val || 'Phone is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.company"
                  label="Company Name *"
                  :rules="[val => !!val || 'Company name is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.address"
                  type="textarea"
                  label="Business Address *"
                  :rules="[val => !!val || 'Address is required']"
                  outlined
                  dense
                  rows="3"
                />

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="seller.city"
                      label="City *"
                      :rules="[val => !!val || 'City is required']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="seller.zipCode"
                      label="ZIP Code *"
                      :rules="[val => !!val || 'ZIP code is required']"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <q-select
                  v-model="seller.country"
                  :options="countries"
                  label="Country *"
                  :rules="[val => !!val || 'Country is required']"
                  outlined
                  dense
                />

                <div class="row justify-end">
                  <q-btn
                    type="submit"
                    label="Next"
                    color="primary"
                  />
                </div>
              </q-form>
            </q-step>

            <!-- Step 2: Business Details -->
            <q-step
              :name="2"
              title="Business Details"
              icon="business"
              :done="step > 2"
            >
              <q-form @submit="nextStep" class="q-gutter-md">
                <q-input
                  v-model="seller.businessName"
                  label="Business Name *"
                  :rules="[val => !!val || 'Business name is required']"
                  outlined
                  dense
                />

                <q-select
                  v-model="seller.businessType"
                  :options="businessTypes"
                  label="Business Type *"
                  :rules="[val => !!val || 'Business type is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.taxId"
                  label="Tax ID *"
                  :rules="[val => !!val || 'Tax ID is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.website"
                  label="Website"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.description"
                  type="textarea"
                  label="Business Description"
                  outlined
                  dense
                  rows="3"
                />

                <div class="row justify-between">
                  <q-btn
                    label="Back"
                    color="grey"
                    @click="previousStep"
                  />
                  <q-btn
                    type="submit"
                    label="Next"
                    color="primary"
                  />
                </div>
              </q-form>
            </q-step>

            <!-- Step 3: Banking Information -->
            <q-step
              :name="3"
              title="Banking Information"
              icon="account_balance"
              :done="step > 3"
            >
              <q-form @submit="nextStep" class="q-gutter-md">
                <q-input
                  v-model="seller.bankName"
                  label="Bank Name *"
                  :rules="[val => !!val || 'Bank name is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.accountNumber"
                  label="Account Number *"
                  :rules="[val => !!val || 'Account number is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.routingNumber"
                  label="Routing Number *"
                  :rules="[val => !!val || 'Routing number is required']"
                  outlined
                  dense
                />

                <q-input
                  v-model="seller.accountHolder"
                  label="Account Holder Name *"
                  :rules="[val => !!val || 'Account holder name is required']"
                  outlined
                  dense
                />

                <div class="row justify-between">
                  <q-btn
                    label="Back"
                    color="grey"
                    @click="previousStep"
                  />
                  <q-btn
                    type="submit"
                    label="Next"
                    color="primary"
                  />
                </div>
              </q-form>
            </q-step>

            <!-- Step 4: Verification -->
            <q-step
              :name="4"
              title="Verification"
              icon="verified"
            >
              <q-form @submit="onSubmit" class="q-gutter-md">
                <div class="text-subtitle1">Upload Required Documents</div>

                <q-file
                  v-model="seller.businessLicense"
                  label="Business License"
                  outlined
                  dense
                  accept=".pdf,.jpg,.png"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-file
                  v-model="seller.taxCertificate"
                  label="Tax Certificate"
                  outlined
                  dense
                  accept=".pdf,.jpg,.png"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-checkbox
                  v-model="seller.termsAccepted"
                  label="I accept the terms and conditions"
                  :rules="[val => !!val || 'You must accept the terms']"
                />

                <div class="row justify-between">
                  <q-btn
                    label="Back"
                    color="grey"
                    @click="previousStep"
                  />
                  <q-btn
                    type="submit"
                    label="Complete Registration"
                    color="primary"
                    :loading="loading"
                  />
                </div>
              </q-form>
            </q-step>
          </q-stepper>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SellerRegistration',
  setup() {
    const router = useRouter()
    const step = ref(1)
    const loading = ref(false)
    
    const seller = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      businessName: '',
      businessType: '',
      taxId: '',
      website: '',
      description: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountHolder: '',
      businessLicense: null,
      taxCertificate: null,
      termsAccepted: false
    })

    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France']
    const businessTypes = ['Sole Proprietorship', 'Partnership', 'LLC', 'Corporation', 'Non-Profit']

    const nextStep = () => {
      step.value++
    }

    const previousStep = () => {
      step.value--
    }

    const onSubmit = async () => {
      loading.value = true
      
      try {
        // Here you would typically make an API call to register the seller
        console.log('Registering seller:', seller)
        
        // Redirect to dashboard after successful registration
        router.push('/seller/dashboard')
      } catch (error) {
        console.error('Registration error:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      step,
      seller,
      countries,
      businessTypes,
      loading,
      nextStep,
      previousStep,
      onSubmit
    }
  }
}
</script>
