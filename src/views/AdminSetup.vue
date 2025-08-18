<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Admin Setup</div>
            <div class="text-grey-8">Set up your admin account</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.email"
                type="email"
                label="Admin Email"
                :rules="[
                  val => !!val || 'Email is required',
                  val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
                ]"
              />
              
              <q-input
                v-model="form.password"
                type="password"
                label="Admin Password"
                :rules="[
                  val => !!val || 'Password is required',
                  val => val.length >= 6 || 'Password must be at least 6 characters'
                ]"
              />

              <q-input
                v-model="form.confirmPassword"
                type="password"
                label="Confirm Password"
                :rules="[
                  val => !!val || 'Please confirm your password',
                  val => val === form.password || 'Passwords do not match'
                ]"
              />

              <q-btn 
                type="submit" 
                label="Setup Admin Account" 
                color="primary" 
                class="full-width"
                :loading="loading"
              />
            </q-form>
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
  confirmPassword: ''
})

const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  loading.value = true
  try {
    await authStore.registerAdmin({
      email: form.value.email,
      password: form.value.password
    })
    
    $q.notify({
      type: 'positive',
      message: 'Admin account created successfully! Please login.',
      position: 'top'
    })
    
    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error creating admin account',
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
