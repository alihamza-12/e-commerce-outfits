<template>
  <div class="q-pa-md">
    <h1 class="text-3xl font-bold text-center mb-4">Quasar + Tailwind Integration Test</h1>
    
    <div class="q-gutter-md">
      <!-- Quasar components -->
      <q-btn color="primary" label="Quasar Button" />
      <q-btn color="secondary" label="Another Button" />
      
      <!-- Tailwind styled elements -->
      <div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <p class="text-lg">This is styled with Tailwind CSS</p>
      </div>
      
      <!-- Combined styling -->
      <q-card class="bg-green-100 p-4 rounded-lg shadow-lg">
        <q-card-section>
          <div class="text-2xl font-bold text-green-800 mb-2">
            Combined Quasar + Tailwind
          </div>
          <p class="text-gray-700">
            This card uses Quasar component with Tailwind utility classes
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestIntegration'
}
</script>
