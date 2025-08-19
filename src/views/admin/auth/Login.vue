<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Admin Login</div>
            <div class="text-grey-8">Sign in to your admin account</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.email"
                type="email"
                label="Email"
                :rules="[
                  val => !!val || 'Email is required',
                  val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
                ]"
                filled
              />
              
              <q-input
                v-model="form.password"
                type="password"
                label="Password"
                :rules="[val => !!val || 'Password is required']"
                filled
              />

              <q-btn 
                type="submit" 
                label="Login" 
                color="primary" 
                class="full-width q-mt-md"
                :loading="loading"
                :disable="loading"
              />
            </q-form>
          </q-card-section>

          <q-card-section v-if="error" class="text-negative text-center">
            {{ error }}
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form.value)
    $q.notify({
      type: 'positive',
      message: 'Login successful!',
      position: 'top'
    })
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.'
    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.my_card {
  width: 400px;
}
</style>
